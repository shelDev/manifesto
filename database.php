<?php
// database.php - Database connection and helper functions

require_once 'config.php';

class Database {
    private $conn;
    
    // Constructor - establishes database connection
    public function __construct() {
        try {
            $this->conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            // Set charset to ensure proper encoding
            $this->conn->set_charset("utf8mb4");
        } catch (Exception $e) {
            $this->handleError($e);
        }
    }
    
    // Close database connection
    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
    
    // Execute a query with prepared statements
    public function query($sql, $params = [], $types = "") {
        try {
            $stmt = $this->conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Query preparation failed: " . $this->conn->error);
            }
            
            // If we have parameters to bind
            if (!empty($params)) {
                // If types string is not provided, generate it
                if (empty($types)) {
                    $types = $this->generateParamTypes($params);
                }
                
                // Convert array to references for bind_param
                $bindParams = array();
                $bindParams[] = &$types;
                
                for ($i = 0; $i < count($params); $i++) {
                    $bindParams[] = &$params[$i];
                }
                
                call_user_func_array(array($stmt, 'bind_param'), $bindParams);
            }
            
            // Execute the statement
            if (!$stmt->execute()) {
                throw new Exception("Query execution failed: " . $stmt->error);
            }
            
            // Get result if it's a SELECT query
            if (stripos(trim($sql), 'SELECT') === 0) {
                $result = $stmt->get_result();
                $data = [];
                
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                
                $stmt->close();
                return $data;
            } else {
                // For INSERT, UPDATE, DELETE queries
                $affectedRows = $stmt->affected_rows;
                $insertId = $stmt->insert_id ?: null;
                $stmt->close();
                
                return [
                    'affected_rows' => $affectedRows,
                    'insert_id' => $insertId
                ];
            }
        } catch (Exception $e) {
            $this->handleError($e);
            return false;
        }
    }
    
    // Generate parameter types string for bind_param
    private function generateParamTypes($params) {
        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i'; // integer
            } elseif (is_float($param)) {
                $types .= 'd'; // double
            } elseif (is_string($param)) {
                $types .= 's'; // string
            } else {
                $types .= 'b'; // blob
            }
        }
        return $types;
    }
    
    // Get a single record
    public function getOne($sql, $params = [], $types = "") {
        $result = $this->query($sql, $params, $types);
        
        if ($result && is_array($result) && count($result) > 0) {
            return $result[0];
        }
        
        return null;
    }
    
    // Begin a transaction
    public function beginTransaction() {
        $this->conn->begin_transaction();
    }
    
    // Commit a transaction
    public function commit() {
        $this->conn->commit();
    }
    
    // Rollback a transaction
    public function rollback() {
        $this->conn->rollback();
    }
    
    // Get the last inserted ID
    public function getLastInsertId() {
        return $this->conn->insert_id;
    }
    
    // Escape a string for use in a query
    public function escapeString($string) {
        return $this->conn->real_escape_string($string);
    }
    
    // Handle database errors
    private function handleError($exception) {
        if (DEBUG_MODE) {
            throw $exception;
        } else {
            // Log error to file
            error_log("Database error: " . $exception->getMessage());
            
            // Return a generic error message
            throw new Exception("A database error occurred. Please try again later.");
        }
    }
}
