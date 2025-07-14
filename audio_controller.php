<?php
// controllers/audio_controller.php - Audio recording controller

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../utils/file_upload.php';

/**
 * Handle upload an audio recording for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleUploadAudio($db, $params, $queryParams, $body) {
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
    
    // Check if file was uploaded
    if (!isset($_FILES['audio']) || $_FILES['audio']['error'] === UPLOAD_ERR_NO_FILE) {
        sendBadRequest('No audio file uploaded');
        return;
    }
    
    // Handle file upload
    $fileInfo = handleAudioUpload($_FILES['audio'], $entryId);
    
    if (isset($fileInfo['error'])) {
        sendBadRequest($fileInfo['error']);
        return;
    }
    
    // Check if entry already has an audio recording
    $existingRecording = $db->getOne(
        "SELECT recording_id, file_path FROM audio_recordings WHERE entry_id = ?",
        [$entryId]
    );
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // If entry already has an audio recording, delete it
        if ($existingRecording) {
            // Delete file from disk
            $filePath = $existingRecording['file_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
            // Delete from database
            $db->query(
                "DELETE FROM audio_recordings WHERE recording_id = ?",
                [$existingRecording['recording_id']]
            );
        }
        
        // Insert new audio recording
        $result = $db->query(
            "INSERT INTO audio_recordings (entry_id, file_path, duration, file_size)
             VALUES (?, ?, ?, ?)",
            [$entryId, $fileInfo['file_path'], $fileInfo['duration'], $fileInfo['file_size']]
        );
        
        if (!$result) {
            throw new Exception('Failed to save audio recording');
        }
        
        $recordingId = $result['insert_id'];
        
        // Commit transaction
        $db->commit();
        
        // Return recording info
        sendCreated([
            'recording_id' => $recordingId,
            'file_path' => $fileInfo['file_path'],
            'duration' => $fileInfo['duration'],
            'file_size' => $fileInfo['file_size'],
            'created_at' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        // Rollback transaction on error
        $db->rollback();
        
        // Delete uploaded file if it exists
        if (file_exists($fileInfo['file_path'])) {
            unlink($fileInfo['file_path']);
        }
        
        sendServerError('Failed to save audio recording: ' . $e->getMessage());
    }
}

/**
 * Handle get audio recording for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleGetAudio($db, $params, $queryParams, $body) {
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
    
    // Get audio recording
    $recording = $db->getOne(
        "SELECT recording_id, file_path, duration, file_size, created_at
         FROM audio_recordings
         WHERE entry_id = ?",
        [$entryId]
    );
    
    if (!$recording) {
        sendNotFound('Audio recording not found');
        return;
    }
    
    // Check if download parameter is set
    $download = isset($queryParams['download']) && $queryParams['download'] === 'true';
    
    if ($download) {
        // Serve audio file
        serveAudioFile($recording['file_path']);
    } else {
        // Return recording info
        sendSuccess($recording);
    }
}

/**
 * Handle delete an audio recording
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleDeleteAudio($db, $params, $queryParams, $body) {
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
    
    // Get audio recording
    $recording = $db->getOne(
        "SELECT recording_id, file_path FROM audio_recordings WHERE entry_id = ?",
        [$entryId]
    );
    
    if (!$recording) {
        sendNotFound('Audio recording not found');
        return;
    }
    
    // Delete file from disk
    $filePath = $recording['file_path'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    // Delete from database
    $result = $db->query(
        "DELETE FROM audio_recordings WHERE recording_id = ?",
        [$recording['recording_id']]
    );
    
    if (!$result) {
        sendServerError('Failed to delete audio recording');
        return;
    }
    
    sendSuccess(['success' => true]);
}
