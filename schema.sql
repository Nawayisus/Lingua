CREATE TABLE IF NOT EXISTS providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'libretranslate', 'google', 'deepl'
    api_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    original_lang VARCHAR(10),
    target_lang VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default public LibreTranslate instances (subject to change by user)
INSERT INTO providers (name, type, api_url, is_active) VALUES
('LibreTranslate (Public)', 'libretranslate', 'https://libretranslate.de', 1),
('LibreTranslate (Argos)', 'libretranslate', 'https://translate.argosopentech.com', 1);
