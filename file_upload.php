<?php
// utils/file_upload.php - File upload utilities

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Handle file upload for audio recordings
 * 
 * @param array $file File from $_FILES array
 * @param int $entryId Journal entry ID
 * @return array|false File info if successful, false otherwise
 */
function handleAudioUpload($file, $entryId) {
    // Check if file was uploaded without errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorMessage = getUploadErrorMessage($file['error']);
        return ['error' => $errorMessage];
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['error' => 'File is too large. Maximum size is ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB'];
    }
    
    // Check file extension
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($fileExtension, ALLOWED_EXTENSIONS)) {
        return ['error' => 'Invalid file type. Allowed types: ' . implode(', ', ALLOWED_EXTENSIONS)];
    }
    
    // Create upload directory if it doesn't exist
    if (!file_exists(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    
    // Generate unique filename
    $filename = 'entry_' . $entryId . '_' . time() . '.' . $fileExtension;
    $filepath = UPLOAD_DIR . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['error' => 'Failed to save file'];
    }
    
    // Get file duration (would require additional library in production)
    $duration = 0; // Placeholder
    
    return [
        'file_path' => $filepath,
        'file_size' => $file['size'],
        'duration' => $duration,
        'filename' => $filename
    ];
}

/**
 * Get error message for upload error code
 * 
 * @param int $errorCode Upload error code
 * @return string Error message
 */
function getUploadErrorMessage($errorCode) {
    switch ($errorCode) {
        case UPLOAD_ERR_INI_SIZE:
            return 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
        case UPLOAD_ERR_FORM_SIZE:
            return 'The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form';
        case UPLOAD_ERR_PARTIAL:
            return 'The uploaded file was only partially uploaded';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded';
        case UPLOAD_ERR_NO_TMP_DIR:
            return 'Missing a temporary folder';
        case UPLOAD_ERR_CANT_WRITE:
            return 'Failed to write file to disk';
        case UPLOAD_ERR_EXTENSION:
            return 'A PHP extension stopped the file upload';
        default:
            return 'Unknown upload error';
    }
}

/**
 * Serve audio file securely
 * 
 * @param string $filePath Path to audio file
 * @return void
 */
function serveAudioFile($filePath) {
    if (!file_exists($filePath)) {
        header('HTTP/1.0 404 Not Found');
        echo 'File not found';
        exit;
    }
    
    $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    
    // Set appropriate content type
    switch ($fileExtension) {
        case 'mp3':
            $contentType = 'audio/mpeg';
            break;
        case 'wav':
            $contentType = 'audio/wav';
            break;
        case 'ogg':
            $contentType = 'audio/ogg';
            break;
        case 'm4a':
            $contentType = 'audio/mp4';
            break;
        default:
            $contentType = 'application/octet-stream';
    }
    
    // Set headers
    header('Content-Type: ' . $contentType);
    header('Content-Length: ' . filesize($filePath));
    header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
    header('Accept-Ranges: bytes');
    header('Cache-Control: private, max-age=3600');
    
    // Output file
    readfile($filePath);
    exit;
}
