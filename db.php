<?php
// db.php
$config = require_once 'config.php';

$pdo = null;

try {
    $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Log error cleanly
    error_log("Database connection failed: " . $e->getMessage());
    // $pdo remains null. Application should handle this gracefully.
}

function get_db_connection() {
    global $pdo;
    return $pdo;
}
