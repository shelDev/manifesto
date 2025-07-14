<?php
// api/index.php - Main API entry point and router

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include required files
require_once '../config.php';
require_once '../database.php';
require_once '../utils/auth.php';
require_once '../utils/response.php';

// Initialize database connection
$db = new Database();

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api'; // Base path for the API
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove base path from the request path
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Remove trailing slash if present
$path = rtrim($path, '/');

// Parse query parameters
$queryParams = [];
parse_str(parse_url($requestUri, PHP_URL_QUERY) ?? '', $queryParams);

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get request body for POST, PUT requests
$body = null;
if ($method === 'POST' || $method === 'PUT') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true);
    
    // Check for JSON parsing errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendResponse(400, ['error' => 'Invalid JSON in request body']);
        exit;
    }
}

// Define routes and their handlers
$routes = [
    // Authentication routes
    'POST /auth/register' => 'handleRegister',
    'POST /auth/login' => 'handleLogin',
    'POST /auth/logout' => 'handleLogout',
    'POST /auth/reset-password' => 'handlePasswordResetRequest',
    'PUT /auth/reset-password' => 'handlePasswordReset',
    
    // Journal entry routes
    'GET /entries' => 'handleGetEntries',
    'GET /entries/{id}' => 'handleGetEntry',
    'POST /entries' => 'handleCreateEntry',
    'PUT /entries/{id}' => 'handleUpdateEntry',
    'DELETE /entries/{id}' => 'handleDeleteEntry',
    
    // Audio recording routes
    'POST /entries/{id}/audio' => 'handleUploadAudio',
    'GET /entries/{id}/audio' => 'handleGetAudio',
    'DELETE /entries/{id}/audio' => 'handleDeleteAudio',
    
    // AI analysis routes
    'POST /entries/{id}/analyze' => 'handleAnalyzeEntry',
    'GET /entries/{id}/analysis' => 'handleGetAnalysis',
    
    // Sharing routes
    'POST /entries/{id}/share' => 'handleShareEntry',
    'DELETE /entries/{id}/share' => 'handleRemoveShare',
    'GET /shared/{token}' => 'handleGetSharedEntry'
];

// Route the request
$routeFound = false;
foreach ($routes as $route => $handler) {
    // Split route into method and path
    list($routeMethod, $routePath) = explode(' ', $route, 2);
    
    // Check if method matches
    if ($routeMethod !== $method) {
        continue;
    }
    
    // Replace route parameters with regex patterns
    $pattern = preg_replace('/{([^}]+)}/', '(?P<$1>[^/]+)', $routePath);
    $pattern = "#^{$pattern}$#";
    
    // Check if path matches the pattern
    if (preg_match($pattern, $path, $matches)) {
        $routeFound = true;
        
        // Extract route parameters
        $params = array_filter($matches, function($key) {
            return !is_numeric($key);
        }, ARRAY_FILTER_USE_KEY);
        
        // Include the appropriate controller file based on the route
        $controllerFile = getControllerFile($routePath);
        if (file_exists($controllerFile)) {
            require_once $controllerFile;
        }
        
        // Call the handler function with parameters
        if (function_exists($handler)) {
            $handler($db, $params, $queryParams, $body);
        } else {
            sendResponse(500, ['error' => 'Handler function not found']);
        }
        
        break;
    }
}

// If no route matched, return 404
if (!$routeFound) {
    sendResponse(404, ['error' => 'Endpoint not found']);
}

// Helper function to determine which controller file to include
function getControllerFile($routePath) {
    if (strpos($routePath, '/auth/') === 0) {
        return '../controllers/auth_controller.php';
    } elseif (strpos($routePath, '/entries') === 0) {
        if (strpos($routePath, '/audio') !== false) {
            return '../controllers/audio_controller.php';
        } elseif (strpos($routePath, '/analyze') !== false || strpos($routePath, '/analysis') !== false) {
            return '../controllers/analysis_controller.php';
        } elseif (strpos($routePath, '/share') !== false) {
            return '../controllers/sharing_controller.php';
        } else {
            return '../controllers/entries_controller.php';
        }
    } elseif (strpos($routePath, '/shared/') === 0) {
        return '../controllers/sharing_controller.php';
    }
    
    return '';
}
