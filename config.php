<?php
// config.php - Configuration file for Voice Journal API
// This file contains database connection settings and other configuration parameters

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'your_db_username'); // Replace with your IONOS database username
define('DB_PASSWORD', 'your_db_password'); // Replace with your IONOS database password
define('DB_NAME', 'your_db_name');         // Replace with your IONOS database name

// API settings
define('JWT_SECRET', 'your_jwt_secret_key'); // Replace with a secure random string
define('JWT_EXPIRY', 86400); // Token expiry in seconds (24 hours)

// File storage settings
define('UPLOAD_DIR', '../storage/audio/'); // Directory for audio file uploads
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // Maximum file size (10MB)
define('ALLOWED_EXTENSIONS', ['mp3', 'wav', 'ogg', 'm4a']); // Allowed audio file extensions

// Security settings
define('CORS_ALLOWED_ORIGINS', ['https://access901442957.webspace-data.io', 'http://localhost:3000']);
define('RATE_LIMIT', 100); // Maximum requests per hour
define('PASSWORD_HASH_COST', 12); // Cost parameter for password hashing

// Sharing settings
define('SHARE_TOKEN_LENGTH', 32); // Length of share tokens
define('DEFAULT_SHARE_EXPIRY', 7 * 24 * 60 * 60); // Default share expiry (7 days)

// Error reporting (set to false in production)
define('DEBUG_MODE', true);

// Initialize error handling based on debug mode
if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ERROR | E_PARSE);
}

// Time zone setting
date_default_timezone_set('UTC');
