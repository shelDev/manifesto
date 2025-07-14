<?php
// utils/response.php - Helper functions for API responses

/**
 * Send a JSON response with the specified status code
 * 
 * @param int $statusCode HTTP status code
 * @param array $data Response data
 * @return void
 */
function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

/**
 * Send a success response (HTTP 200)
 * 
 * @param array $data Response data
 * @return void
 */
function sendSuccess($data) {
    sendResponse(200, $data);
}

/**
 * Send a created response (HTTP 201)
 * 
 * @param array $data Response data
 * @return void
 */
function sendCreated($data) {
    sendResponse(201, $data);
}

/**
 * Send a no content response (HTTP 204)
 * 
 * @return void
 */
function sendNoContent() {
    http_response_code(204);
    exit;
}

/**
 * Send a bad request error response (HTTP 400)
 * 
 * @param string $message Error message
 * @return void
 */
function sendBadRequest($message = 'Bad request') {
    sendResponse(400, ['error' => $message]);
}

/**
 * Send an unauthorized error response (HTTP 401)
 * 
 * @param string $message Error message
 * @return void
 */
function sendUnauthorized($message = 'Unauthorized') {
    sendResponse(401, ['error' => $message]);
}

/**
 * Send a forbidden error response (HTTP 403)
 * 
 * @param string $message Error message
 * @return void
 */
function sendForbidden($message = 'Forbidden') {
    sendResponse(403, ['error' => $message]);
}

/**
 * Send a not found error response (HTTP 404)
 * 
 * @param string $message Error message
 * @return void
 */
function sendNotFound($message = 'Resource not found') {
    sendResponse(404, ['error' => $message]);
}

/**
 * Send a server error response (HTTP 500)
 * 
 * @param string $message Error message
 * @return void
 */
function sendServerError($message = 'Internal server error') {
    sendResponse(500, ['error' => $message]);
}

/**
 * Validate required fields in request data
 * 
 * @param array $data Request data
 * @param array $requiredFields List of required field names
 * @return bool True if all required fields are present
 */
function validateRequiredFields($data, $requiredFields) {
    if (!is_array($data)) {
        return false;
    }
    
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendBadRequest("Missing required field: {$field}");
            return false;
        }
    }
    
    return true;
}

/**
 * Sanitize input data to prevent XSS and other attacks
 * 
 * @param mixed $data Input data to sanitize
 * @return mixed Sanitized data
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInput($value);
        }
        return $data;
    }
    
    if (is_string($data)) {
        // Remove HTML tags and encode special characters
        return htmlspecialchars(strip_tags($data), ENT_QUOTES, 'UTF-8');
    }
    
    return $data;
}
