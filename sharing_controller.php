<?php
// controllers/sharing_controller.php - Sharing controller

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Handle create a sharing link for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleShareEntry($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get entry ID from route parameters
    $entryId = isset($params['id']) ? (int)$params['id'] : 0;
    
    // Check if entry exists and belongs to user
    $entry = $db->getOne(
        "SELECT entry_id, title FROM journal_entries WHERE entry_id = ? AND user_id = ?",
        [$entryId, $user['user_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Parse request body
    $expiresAt = null;
    if (isset($body['expires_at']) && !empty($body['expires_at'])) {
        $expiresAt = date('Y-m-d H:i:s', strtotime($body['expires_at']));
    } else {
        // Default expiry is 7 days
        $expiresAt = date('Y-m-d H:i:s', time() + DEFAULT_SHARE_EXPIRY);
    }
    
    $isPasswordProtected = isset($body['is_password_protected']) ? (bool)$body['is_password_protected'] : false;
    $password = isset($body['password']) ? $body['password'] : null;
    $passwordHash = null;
    
    if ($isPasswordProtected && $password) {
        $passwordHash = hashPassword($password);
    }
    
    // Generate access token
    $accessToken = generateRandomToken(SHARE_TOKEN_LENGTH);
    
    // Check if entry already has a share token
    $existingShare = $db->getOne(
        "SELECT access_id FROM shared_access WHERE entry_id = ?",
        [$entryId]
    );
    
    if ($existingShare) {
        // Update existing share
        $result = $db->query(
            "UPDATE shared_access 
             SET access_token = ?, expires_at = ?, is_password_protected = ?, password_hash = ?
             WHERE entry_id = ?",
            [$accessToken, $expiresAt, $isPasswordProtected, $passwordHash, $entryId]
        );
    } else {
        // Create new share
        $result = $db->query(
            "INSERT INTO shared_access (entry_id, access_token, expires_at, is_password_protected, password_hash)
             VALUES (?, ?, ?, ?, ?)",
            [$entryId, $accessToken, $expiresAt, $isPasswordProtected, $passwordHash]
        );
    }
    
    if (!$result) {
        sendServerError('Failed to create share link');
        return;
    }
    
    // Update journal entry to mark as public
    $db->query(
        "UPDATE journal_entries SET is_public = 1, share_token = ?, share_expires = ? WHERE entry_id = ?",
        [$accessToken, $expiresAt, $entryId]
    );
    
    // Generate share URL
    $shareUrl = 'https://' . $_SERVER['HTTP_HOST'] . '/shared/' . $accessToken;
    
    sendSuccess([
        'access_token' => $accessToken,
        'share_url' => $shareUrl,
        'expires_at' => $expiresAt,
        'is_password_protected' => $isPasswordProtected
    ]);
}

/**
 * Handle remove sharing for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleRemoveShare($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get entry ID from route parameters
    $entryId = isset($params['id']) ? (int)$params['id'] : 0;
    
    // Check if entry exists and belongs to user
    $entry = $db->getOne(
        "SELECT entry_id FROM journal_entries WHERE entry_id = ? AND user_id = ?",
        [$entryId, $user['user_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Delete share
    $db->query(
        "DELETE FROM shared_access WHERE entry_id = ?",
        [$entryId]
    );
    
    // Update journal entry to mark as private
    $db->query(
        "UPDATE journal_entries SET is_public = 0, share_token = NULL, share_expires = NULL WHERE entry_id = ?",
        [$entryId]
    );
    
    sendSuccess(['success' => true]);
}

/**
 * Handle get a shared entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleGetSharedEntry($db, $params, $queryParams, $body) {
    // Get token from route parameters
    $token = isset($params['token']) ? sanitizeInput($params['token']) : '';
    
    if (empty($token)) {
        sendBadRequest('Invalid token');
        return;
    }
    
    // Get shared access
    $sharedAccess = $db->getOne(
        "SELECT sa.entry_id, sa.is_password_protected, sa.password_hash, sa.expires_at
         FROM shared_access sa
         WHERE sa.access_token = ? AND (sa.expires_at IS NULL OR sa.expires_at > NOW())",
        [$token]
    );
    
    if (!$sharedAccess) {
        sendNotFound('Shared entry not found or has expired');
        return;
    }
    
    // Check if password protected
    if ($sharedAccess['is_password_protected']) {
        $password = isset($queryParams['password']) ? $queryParams['password'] : '';
        
        if (empty($password) || !verifyPassword($password, $sharedAccess['password_hash'])) {
            sendUnauthorized('Password required or incorrect');
            return;
        }
    }
    
    // Get entry
    $entry = $db->getOne(
        "SELECT e.entry_id, e.title, e.content, e.mood, e.created_at, e.updated_at,
                u.username as author
         FROM journal_entries e
         JOIN users u ON e.user_id = u.user_id
         WHERE e.entry_id = ? AND e.is_public = 1",
        [$sharedAccess['entry_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Get topics
    $topics = $db->query(
        "SELECT topic, confidence FROM entry_topics WHERE entry_id = ? ORDER BY confidence DESC",
        [$sharedAccess['entry_id']]
    );
    
    // Get audio recording
    $audio = $db->getOne(
        "SELECT recording_id, file_path, duration, file_size, created_at
         FROM audio_recordings
         WHERE entry_id = ?",
        [$sharedAccess['entry_id']]
    );
    
    // Get AI analysis
    $analysis = $db->getOne(
        "SELECT analysis_id, mood_analysis, topic_analysis, hero_journey, created_at
         FROM ai_analysis
         WHERE entry_id = ?",
        [$sharedAccess['entry_id']]
    );
    
    // Add topics, audio, and analysis to entry
    $entry['topics'] = $topics;
    $entry['audio'] = $audio;
    $entry['analysis'] = $analysis;
    
    sendSuccess($entry);
}
