<?php
// api/save_document.php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$pdo = get_db_connection();

// If DB is not configured, just return success (mock)
if (!$pdo) {
    echo json_encode(['status' => 'success', 'message' => 'DB not connected, skipped log']);
    exit;
}

try {
    $filename = $_POST['filename'] ?? 'unknown';
    $file_type = $_POST['file_type'] ?? 'unknown';
    $original_lang = $_POST['original_lang'] ?? '';
    $target_lang = $_POST['target_lang'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO documents (filename, file_type, original_lang, target_lang) VALUES (?, ?, ?, ?)");
    $stmt->execute([$filename, $file_type, $original_lang, $target_lang]);

    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    error_log("Save Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
