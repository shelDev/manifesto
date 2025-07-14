<?php
// utils/auth.php - Authentication utilities

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/response.php';

/**
 * Generate a JWT token for authenticated users
 * 
 * @param int $userId User ID
 * @param string $username Username
 * @param string $email User email
 * @return string JWT token
 */
function generateJWT($userId, $username, $email) {
    $issuedAt = time();
    $expiresAt = $issuedAt + JWT_EXPIRY;
    
    $payload = [
        'iss' => 'voice_journal_api', // Issuer
        'iat' => $issuedAt,           // Issued at time
        'exp' => $expiresAt,          // Expiration time
        'user_id' => $userId,
        'username' => $username,
        'email' => $email
    ];
    
    // Encode Header
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $header = base64_encode($header);
    
    // Encode Payload
    $payload = json_encode($payload);
    $payload = base64_encode($payload);
    
    // Create Signature
    $signature = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $signature = base64_encode($signature);
    
    // Create JWT
    return "$header.$payload.$signature";
}

/**
 * Verify a JWT token
 * 
 * @param string $token JWT token
 * @return array|false User data if token is valid, false otherwise
 */
function verifyJWT($token) {
    // Split token into parts
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    // Verify signature
    $valid = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $valid = base64_encode($valid);
    
    if ($signature !== $valid) {
        return false;
    }
    
    // Decode payload
    $payload = json_decode(base64_decode($payload), true);
    
    // Check if token has expired
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/**
 * Get the authenticated user from the Authorization header
 * 
 * @return array|null User data if authenticated, null otherwise
 */
function getAuthenticatedUser() {
    // Get Authorization header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    // Check if Authorization header exists and has the correct format
    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return null;
    }
    
    $token = $matches[1];
    $userData = verifyJWT($token);
    
    if (!$userData) {
        return null;
    }
    
    return $userData;
}

/**
 * Require authentication for protected routes
 * 
 * @return array User data if authenticated
 */
function requireAuth() {
    $user = getAuthenticatedUser();
    
    if (!$user) {
        sendUnauthorized('Authentication required');
    }
    
    return $user;
}

/**
 * Hash a password securely
 * 
 * @param string $password Plain text password
 * @return string Hashed password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => PASSWORD_HASH_COST]);
}

/**
 * Verify a password against a hash
 * 
 * @param string $password Plain text password
 * @param string $hash Hashed password
 * @return bool True if password is correct
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate a random token for password reset or email verification
 * 
 * @param int $length Token length
 * @return string Random token
 */
function generateRandomToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}
