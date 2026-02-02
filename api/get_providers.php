<?php
// api/get_providers.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$pdo = get_db_connection();

if (!$pdo) {
    // Fallback if DB not configured (or connection failed)
    echo json_encode([
        ['name' => 'LibreTranslate (Public)', 'type' => 'libretranslate', 'api_url' => 'https://libretranslate.de', 'id' => 1],
        ['name' => 'MyMemory (Free)', 'type' => 'mymemory', 'api_url' => 'https://api.mymemory.translated.net', 'id' => 99]
    ]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT id, name, type, api_url FROM providers WHERE is_active = 1");
    $providers = $stmt->fetchAll();
    // If empty table, return default
    if (!$providers) {
         echo json_encode([
            ['name' => 'LibreTranslate (Public)', 'type' => 'libretranslate', 'api_url' => 'https://libretranslate.de', 'id' => 1]
        ]);
    } else {
        echo json_encode($providers);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
