# Voice Journal Database Schema Design for IONOS Hosting

## Database Schema (MySQL/MariaDB)

### Users Table
```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(100) NULL,
    reset_token_expires TIMESTAMP NULL
);
```

### Journal Entries Table
```sql
CREATE TABLE journal_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    mood VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) NULL,
    share_expires TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Audio Recordings Table
```sql
CREATE TABLE audio_recordings (
    recording_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    duration INT NULL,
    file_size INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(entry_id) ON DELETE CASCADE
);
```

### Entry Topics Table
```sql
CREATE TABLE entry_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    confidence FLOAT NULL,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(entry_id) ON DELETE CASCADE
);
```

### AI Analysis Table
```sql
CREATE TABLE ai_analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    mood_analysis TEXT NULL,
    topic_analysis TEXT NULL,
    hero_journey TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(entry_id) ON DELETE CASCADE
);
```

### Shared Access Table
```sql
CREATE TABLE shared_access (
    access_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    access_token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_password_protected BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NULL,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(entry_id) ON DELETE CASCADE
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## API Endpoints Design

### Authentication Endpoints

#### POST /api/auth/register
- Register a new user
- Request body: `{ username, email, password }`
- Response: `{ user_id, username, email, created_at }`

#### POST /api/auth/login
- Authenticate a user
- Request body: `{ email, password }`
- Response: `{ token, user_id, username, email }`

#### POST /api/auth/logout
- End a user session
- Request header: `Authorization: Bearer {token}`
- Response: `{ success: true }`

#### POST /api/auth/reset-password
- Request a password reset
- Request body: `{ email }`
- Response: `{ success: true }`

#### PUT /api/auth/reset-password
- Reset password with token
- Request body: `{ token, new_password }`
- Response: `{ success: true }`

### Journal Entry Endpoints

#### GET /api/entries
- Get all entries for the authenticated user
- Query parameters: `page, limit, sort, mood, search`
- Response: `{ entries: [...], total, page, limit }`

#### GET /api/entries/:id
- Get a specific entry
- Response: `{ entry_id, title, content, mood, created_at, updated_at, topics: [...], audio: {...}, analysis: {...} }`

#### POST /api/entries
- Create a new journal entry
- Request body: `{ title, content, mood, is_public }`
- Response: `{ entry_id, title, content, mood, created_at }`

#### PUT /api/entries/:id
- Update an existing entry
- Request body: `{ title, content, mood, is_public }`
- Response: `{ entry_id, title, content, mood, updated_at }`

#### DELETE /api/entries/:id
- Delete an entry
- Response: `{ success: true }`

### Audio Recording Endpoints

#### POST /api/entries/:id/audio
- Upload an audio recording for an entry
- Request: multipart form data with audio file
- Response: `{ recording_id, file_path, duration, file_size }`

#### GET /api/entries/:id/audio
- Get audio recording for an entry
- Response: Audio file stream or `{ recording_id, file_path, duration, file_size }`

#### DELETE /api/entries/:id/audio
- Delete an audio recording
- Response: `{ success: true }`

### AI Analysis Endpoints

#### POST /api/entries/:id/analyze
- Generate AI analysis for an entry
- Request body: `{ analyze_mood: true, analyze_topics: true, generate_hero_journey: true }`
- Response: `{ analysis_id, mood_analysis, topic_analysis, hero_journey }`

#### GET /api/entries/:id/analysis
- Get AI analysis for an entry
- Response: `{ analysis_id, mood_analysis, topic_analysis, hero_journey }`

### Sharing Endpoints

#### POST /api/entries/:id/share
- Create a sharing link for an entry
- Request body: `{ expires_at, is_password_protected, password }`
- Response: `{ access_token, share_url, expires_at }`

#### DELETE /api/entries/:id/share
- Remove sharing for an entry
- Response: `{ success: true }`

#### GET /api/shared/:token
- Access a shared entry
- Query parameters: `password` (if password protected)
- Response: `{ entry_id, title, content, mood, created_at, topics: [...], audio: {...}, analysis: {...} }`

## Implementation Notes for IONOS Hosting

### Database Connection
```php
<?php
// Database connection for IONOS hosting
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "your_db_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

### File Storage
- Store audio files in a directory outside the web root for security
- Use a PHP script to serve audio files securely
- Implement proper file permissions

### Security Considerations
- Use prepared statements for all database queries
- Implement CSRF protection
- Set secure and HTTP-only flags for cookies
- Validate and sanitize all user inputs
- Implement rate limiting for API endpoints

### Performance Optimization
- Index frequently queried columns
- Implement caching for frequently accessed data
- Optimize database queries
- Consider pagination for large result sets

This database schema and API design provides a solid foundation for implementing server-side storage for the Voice Journal application on IONOS hosting. The design supports all the key requirements including user authentication, journal entry management, audio recording storage, AI analysis, and sharing functionality.
