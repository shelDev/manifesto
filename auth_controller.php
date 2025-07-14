<?php
// controllers/auth_controller.php - Authentication controller

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Handle user registration
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleRegister($db, $params, $queryParams, $body) {
    // Validate required fields
    if (!validateRequiredFields($body, ['username', 'email', 'password'])) {
        return;
    }
    
    // Sanitize input
    $username = sanitizeInput($body['username']);
    $email = sanitizeInput($body['email']);
    $password = $body['password']; // Don't sanitize password before hashing
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendBadRequest('Invalid email format');
        return;
    }
    
    // Check if username or email already exists
    $existingUser = $db->getOne(
        "SELECT user_id FROM users WHERE username = ? OR email = ?",
        [$username, $email]
    );
    
    if ($existingUser) {
        sendBadRequest('Username or email already exists');
        return;
    }
    
    // Hash password
    $passwordHash = hashPassword($password);
    
    // Insert new user
    $result = $db->query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [$username, $email, $passwordHash]
    );
    
    if (!$result) {
        sendServerError('Failed to create user');
        return;
    }
    
    $userId = $result['insert_id'];
    
    // Return user data (without password)
    sendCreated([
        'user_id' => $userId,
        'username' => $username,
        'email' => $email,
        'created_at' => date('Y-m-d H:i:s')
    ]);
}

/**
 * Handle user login
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleLogin($db, $params, $queryParams, $body) {
    // Validate required fields
    if (!validateRequiredFields($body, ['email', 'password'])) {
        return;
    }
    
    // Sanitize input
    $email = sanitizeInput($body['email']);
    $password = $body['password']; // Don't sanitize password before verification
    
    // Get user by email
    $user = $db->getOne(
        "SELECT user_id, username, email, password_hash FROM users WHERE email = ?",
        [$email]
    );
    
    if (!$user) {
        sendUnauthorized('Invalid email or password');
        return;
    }
    
    // Verify password
    if (!verifyPassword($password, $user['password_hash'])) {
        sendUnauthorized('Invalid email or password');
        return;
    }
    
    // Update last login timestamp
    $db->query(
        "UPDATE users SET last_login = NOW() WHERE user_id = ?",
        [$user['user_id']]
    );
    
    // Generate JWT token
    $token = generateJWT($user['user_id'], $user['username'], $user['email']);
    
    // Create session record
    $sessionId = generateRandomToken();
    $expiresAt = date('Y-m-d H:i:s', time() + JWT_EXPIRY);
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    $db->query(
        "INSERT INTO user_sessions (session_id, user_id, expires_at, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?)",
        [$sessionId, $user['user_id'], $expiresAt, $ipAddress, $userAgent]
    );
    
    // Return token and user data
    sendSuccess([
        'token' => $token,
        'user_id' => $user['user_id'],
        'username' => $user['username'],
        'email' => $user['email']
    ]);
}

/**
 * Handle user logout
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleLogout($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get Authorization header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        
        // Invalidate all sessions for this user
        // In a more sophisticated implementation, we would invalidate only the current session
        $db->query(
            "DELETE FROM user_sessions WHERE user_id = ?",
            [$user['user_id']]
        );
    }
    
    sendSuccess(['success' => true]);
}

/**
 * Handle password reset request
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handlePasswordResetRequest($db, $params, $queryParams, $body) {
    // Validate required fields
    if (!validateRequiredFields($body, ['email'])) {
        return;
    }
    
    // Sanitize input
    $email = sanitizeInput($body['email']);
    
    // Get user by email
    $user = $db->getOne(
        "SELECT user_id, username FROM users WHERE email = ?",
        [$email]
    );
    
    if (!$user) {
        // Don't reveal that the email doesn't exist
        sendSuccess(['success' => true]);
        return;
    }
    
    // Generate reset token
    $resetToken = generateRandomToken();
    $resetTokenExpires = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry
    
    // Save reset token to database
    $db->query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?",
        [$resetToken, $resetTokenExpires, $user['user_id']]
    );
    
    // In a real implementation, send an email with the reset link
    // For now, we'll just return success
    // The reset link would be something like: https://yourdomain.com/reset-password?token={$resetToken}
    
    sendSuccess(['success' => true]);
}

/**
 * Handle password reset
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handlePasswordReset($db, $params, $queryParams, $body) {
    // Validate required fields
    if (!validateRequiredFields($body, ['token', 'new_password'])) {
        return;
    }
    
    // Sanitize input
    $token = sanitizeInput($body['token']);
    $newPassword = $body['new_password']; // Don't sanitize password before hashing
    
    // Get user by reset token
    $user = $db->getOne(
        "SELECT user_id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
        [$token]
    );
    
    if (!$user) {
        sendBadRequest('Invalid or expired token');
        return;
    }
    
    // Hash new password
    $passwordHash = hashPassword($newPassword);
    
    // Update password and clear reset token
    $db->query(
        "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?",
        [$passwordHash, $user['user_id']]
    );
    
    // Invalidate all sessions for this user
    $db->query(
        "DELETE FROM user_sessions WHERE user_id = ?",
        [$user['user_id']]
    );
    
    sendSuccess(['success' => true]);
}
