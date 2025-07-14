<?php
// controllers/entries_controller.php - Journal entries controller

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Handle get all entries for the authenticated user
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleGetEntries($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Parse query parameters
    $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
    $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 10;
    $sort = isset($queryParams['sort']) ? sanitizeInput($queryParams['sort']) : 'created_at';
    $order = isset($queryParams['order']) ? sanitizeInput($queryParams['order']) : 'DESC';
    $mood = isset($queryParams['mood']) ? sanitizeInput($queryParams['mood']) : null;
    $search = isset($queryParams['search']) ? sanitizeInput($queryParams['search']) : null;
    
    // Validate and sanitize sort and order
    $allowedSortFields = ['created_at', 'updated_at', 'title', 'mood'];
    if (!in_array($sort, $allowedSortFields)) {
        $sort = 'created_at';
    }
    
    $order = strtoupper($order) === 'ASC' ? 'ASC' : 'DESC';
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Build query
    $sql = "SELECT e.entry_id, e.title, LEFT(e.content, 200) AS content_preview, e.mood, 
                   e.created_at, e.updated_at, e.is_public, 
                   (SELECT COUNT(*) FROM audio_recordings WHERE entry_id = e.entry_id) AS has_audio
            FROM journal_entries e
            WHERE e.user_id = ?";
    
    $params = [$user['user_id']];
    
    // Add mood filter if provided
    if ($mood) {
        $sql .= " AND e.mood = ?";
        $params[] = $mood;
    }
    
    // Add search filter if provided
    if ($search) {
        $sql .= " AND (e.title LIKE ? OR e.content LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    // Add order by clause
    $sql .= " ORDER BY e.{$sort} {$order}";
    
    // Add limit and offset
    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    // Execute query
    $entries = $db->query($sql, $params);
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) AS total FROM journal_entries WHERE user_id = ?";
    $countParams = [$user['user_id']];
    
    // Add mood filter if provided
    if ($mood) {
        $countSql .= " AND mood = ?";
        $countParams[] = $mood;
    }
    
    // Add search filter if provided
    if ($search) {
        $countSql .= " AND (title LIKE ? OR content LIKE ?)";
        $searchTerm = "%{$search}%";
        $countParams[] = $searchTerm;
        $countParams[] = $searchTerm;
    }
    
    $totalResult = $db->getOne($countSql, $countParams);
    $total = $totalResult ? $totalResult['total'] : 0;
    
    // For each entry, get topics
    foreach ($entries as &$entry) {
        $topics = $db->query(
            "SELECT topic FROM entry_topics WHERE entry_id = ? ORDER BY confidence DESC LIMIT 5",
            [$entry['entry_id']]
        );
        
        $entry['topics'] = array_column($topics, 'topic');
        
        // Convert boolean string to actual boolean
        $entry['has_audio'] = (bool)$entry['has_audio'];
        $entry['is_public'] = (bool)$entry['is_public'];
    }
    
    sendSuccess([
        'entries' => $entries,
        'total' => (int)$total,
        'page' => $page,
        'limit' => $limit,
        'pages' => ceil($total / $limit)
    ]);
}

/**
 * Handle get a specific entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleGetEntry($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get entry ID from route parameters
    $entryId = isset($params['id']) ? (int)$params['id'] : 0;
    
    // Get entry
    $entry = $db->getOne(
        "SELECT entry_id, title, content, mood, created_at, updated_at, is_public, share_token, share_expires
         FROM journal_entries
         WHERE entry_id = ? AND user_id = ?",
        [$entryId, $user['user_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Get topics
    $topics = $db->query(
        "SELECT topic, confidence FROM entry_topics WHERE entry_id = ? ORDER BY confidence DESC",
        [$entryId]
    );
    
    // Get audio recording
    $audio = $db->getOne(
        "SELECT recording_id, file_path, duration, file_size, created_at
         FROM audio_recordings
         WHERE entry_id = ?",
        [$entryId]
    );
    
    // Get AI analysis
    $analysis = $db->getOne(
        "SELECT analysis_id, mood_analysis, topic_analysis, hero_journey, created_at
         FROM ai_analysis
         WHERE entry_id = ?",
        [$entryId]
    );
    
    // Convert boolean string to actual boolean
    $entry['is_public'] = (bool)$entry['is_public'];
    
    // Add topics, audio, and analysis to entry
    $entry['topics'] = $topics;
    $entry['audio'] = $audio;
    $entry['analysis'] = $analysis;
    
    sendSuccess($entry);
}

/**
 * Handle create a new journal entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleCreateEntry($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Validate required fields
    if (!validateRequiredFields($body, ['title', 'content'])) {
        return;
    }
    
    // Sanitize input
    $title = sanitizeInput($body['title']);
    $content = sanitizeInput($body['content']);
    $mood = isset($body['mood']) ? sanitizeInput($body['mood']) : null;
    $isPublic = isset($body['is_public']) ? (bool)$body['is_public'] : false;
    
    // Insert entry
    $result = $db->query(
        "INSERT INTO journal_entries (user_id, title, content, mood, is_public)
         VALUES (?, ?, ?, ?, ?)",
        [$user['user_id'], $title, $content, $mood, $isPublic]
    );
    
    if (!$result) {
        sendServerError('Failed to create entry');
        return;
    }
    
    $entryId = $result['insert_id'];
    
    // If topics are provided, insert them
    if (isset($body['topics']) && is_array($body['topics'])) {
        foreach ($body['topics'] as $topic) {
            if (is_string($topic)) {
                $topicName = sanitizeInput($topic);
                $confidence = 1.0; // Default confidence
                
                $db->query(
                    "INSERT INTO entry_topics (entry_id, topic, confidence)
                     VALUES (?, ?, ?)",
                    [$entryId, $topicName, $confidence]
                );
            }
        }
    }
    
    // Return the created entry
    $entry = $db->getOne(
        "SELECT entry_id, title, content, mood, created_at, updated_at, is_public
         FROM journal_entries
         WHERE entry_id = ?",
        [$entryId]
    );
    
    // Convert boolean string to actual boolean
    $entry['is_public'] = (bool)$entry['is_public'];
    
    sendCreated($entry);
}

/**
 * Handle update an existing entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleUpdateEntry($db, $params, $queryParams, $body) {
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
    
    // Build update query
    $updateFields = [];
    $updateParams = [];
    
    if (isset($body['title'])) {
        $updateFields[] = "title = ?";
        $updateParams[] = sanitizeInput($body['title']);
    }
    
    if (isset($body['content'])) {
        $updateFields[] = "content = ?";
        $updateParams[] = sanitizeInput($body['content']);
    }
    
    if (isset($body['mood'])) {
        $updateFields[] = "mood = ?";
        $updateParams[] = sanitizeInput($body['mood']);
    }
    
    if (isset($body['is_public'])) {
        $updateFields[] = "is_public = ?";
        $updateParams[] = (bool)$body['is_public'];
    }
    
    if (empty($updateFields)) {
        sendBadRequest('No fields to update');
        return;
    }
    
    // Add entry ID and user ID to params
    $updateParams[] = $entryId;
    $updateParams[] = $user['user_id'];
    
    // Execute update
    $result = $db->query(
        "UPDATE journal_entries SET " . implode(", ", $updateFields) . "
         WHERE entry_id = ? AND user_id = ?",
        $updateParams
    );
    
    if (!$result) {
        sendServerError('Failed to update entry');
        return;
    }
    
    // If topics are provided, update them
    if (isset($body['topics']) && is_array($body['topics'])) {
        // Delete existing topics
        $db->query(
            "DELETE FROM entry_topics WHERE entry_id = ?",
            [$entryId]
        );
        
        // Insert new topics
        foreach ($body['topics'] as $topic) {
            if (is_string($topic)) {
                $topicName = sanitizeInput($topic);
                $confidence = 1.0; // Default confidence
                
                $db->query(
                    "INSERT INTO entry_topics (entry_id, topic, confidence)
                     VALUES (?, ?, ?)",
                    [$entryId, $topicName, $confidence]
                );
            }
        }
    }
    
    // Return the updated entry
    $updatedEntry = $db->getOne(
        "SELECT entry_id, title, content, mood, created_at, updated_at, is_public
         FROM journal_entries
         WHERE entry_id = ?",
        [$entryId]
    );
    
    // Convert boolean string to actual boolean
    $updatedEntry['is_public'] = (bool)$updatedEntry['is_public'];
    
    sendSuccess($updatedEntry);
}

/**
 * Handle delete an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleDeleteEntry($db, $params, $queryParams, $body) {
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
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Delete audio recordings
        $audioRecordings = $db->query(
            "SELECT file_path FROM audio_recordings WHERE entry_id = ?",
            [$entryId]
        );
        
        foreach ($audioRecordings as $recording) {
            // Delete file from disk
            $filePath = $recording['file_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        // Delete from database tables (foreign keys will cascade the deletion)
        $db->query(
            "DELETE FROM journal_entries WHERE entry_id = ? AND user_id = ?",
            [$entryId, $user['user_id']]
        );
        
        // Commit transaction
        $db->commit();
        
        sendSuccess(['success' => true]);
    } catch (Exception $e) {
        // Rollback transaction on error
        $db->rollback();
        sendServerError('Failed to delete entry: ' . $e->getMessage());
    }
}
