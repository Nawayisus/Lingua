# Universal Document Translator / Traductor Universal de Documentos

[English Version Below](#english-version)

---

# 🇪🇸 Versión en Español

## Descripción
Esta es una aplicación web potente y sencilla para traducir documentos manteniendo su formato original. Está diseñada para funcionar en cualquier hosting compartido estándar (PHP/Apache) sin necesidad de servidores complejos ni configuraciones avanzadas.

**Toda la magia ocurre en tu navegador:** La aplicación utiliza tecnologías modernas (WebAssembly) para procesar los archivos en tu propio dispositivo, lo que garantiza privacidad y rapidez.

## Características Principales
*   **Múltiples Formatos:** Soporta PDF, DOCX (Word), EPUB (Libros electrónicos), Imágenes (JPG, PNG) y Texto (.txt).
*   **OCR Integrado:** Reconoce texto dentro de imágenes y documentos escaneados automáticamente.
*   **Conserva el Formato:** Intenta mantener el diseño visual, fuentes y estructura del documento original.
*   **Conversión de Salida:** Puedes elegir guardar la traducción en el formato original o convertirla a PDF, Word o Texto.
*   **Hosting Sencillo:** Funciona en hostings baratos (cPanel, Hostinger, etc.) con PHP 8.0+. No requiere VPS.

## Guía de Instalación (Paso a Paso)

### 1. Preparar los archivos
Descarga el código fuente de esta aplicación (archivo .zip) y descomprímelo en tu computadora.

### 2. Subir al Servidor
1.  Accede a tu hosting (vía cPanel o FTP).
2.  Sube todos los archivos y carpetas (`index.php`, `config.php`, `js/`, `css/`, `api/`, etc.) a la carpeta pública de tu sitio (usualmente `public_html` o una subcarpeta como `public_html/traductor`).
3.  Asegúrate de que la carpeta `uploads/` tenga permisos de escritura. (En FileZilla: Clic derecho -> Permisos de archivo -> escribir `755` o `777`).

### 3. Crear la Base de Datos
1.  Entra a tu panel de control (cPanel).
2.  Ve a "MySQL Databases" y crea una nueva base de datos (ej. `miweb_traductor`).
3.  Crea un usuario y contraseña para esa base de datos y asígnale todos los permisos.
4.  Abre **phpMyAdmin**, selecciona tu nueva base de datos y ve a la pestaña "Importar".
5.  Selecciona el archivo `schema.sql` que viene con la aplicación y ejecuta la importación.

### 4. Conectar la Aplicación
1.  Edita el archivo `config.php` que subiste al servidor.
2.  Actualiza los datos con los de tu base de datos:
    ```php
    return [
        'db_host' => 'localhost',
        'db_name' => 'nombre_de_tu_base_de_datos',
        'db_user' => 'usuario_de_la_base',
        'db_pass' => 'tu_contraseña',
        // ...
    ];
    ```
3.  ¡Listo! Accede a tu sitio web (ej. `www.tu-dominio.com/traductor`) y empieza a traducir.

## Uso
1.  **Selecciona Idiomas:** Elige el idioma original (o déjalo en "Detectar Automático") y el idioma al que deseas traducir.
2.  **Formato de Salida:** Elige si quieres mantener el formato original o convertir el archivo (ej. Imagen a PDF).
3.  **Cargar Archivo:** Arrastra tu documento al recuadro azul o haz clic en el botón.
4.  **Esperar:** Verás una barra de progreso mientras el navegador lee, reconoce (OCR) y traduce el texto.
5.  **Descargar:** Al finalizar, aparecerá un botón verde para descargar tu documento traducido.

---

# 🇬🇧 English Version

## Description
This is a powerful yet simple web application for translating documents while preserving their original layout. It is designed to run on any standard shared hosting (PHP/Apache) without the need for complex servers or advanced configurations.

**All the magic happens in your browser:** The app uses modern technologies (WebAssembly) to process files on your own device, ensuring privacy and speed.

## Key Features
*   **Multiple Formats:** Supports PDF, DOCX (Word), EPUB (E-books), Images (JPG, PNG), and Text (.txt).
*   **Built-in OCR:** Automatically recognizes text inside images and scanned documents.
*   **Format Preservation:** Strives to maintain the visual design, fonts, and structure of the original document.
*   **Output Conversion:** Choose to save the translation in the original format or convert it to PDF, Word, or Text.
*   **Simple Hosting:** Runs on cheap hosting plans (cPanel, Hostinger, etc.) with PHP 8.0+. No VPS required.

## Installation Guide (Step-by-Step)

### 1. Prepare Files
Download the source code (zip file) and unzip it on your computer.

### 2. Upload to Server
1.  Access your hosting control panel (via cPanel or FTP).
2.  Upload all files and folders (`index.php`, `config.php`, `js/`, `css/`, `api/`, etc.) to your site's public folder (usually `public_html` or a subfolder like `public_html/translator`).
3.  Ensure the `uploads/` folder has write permissions. (In FileZilla: Right click -> File permissions -> set to `755` or `777`).

### 3. Create Database
1.  Go to your control panel (cPanel).
2.  Go to "MySQL Databases" and create a new database (e.g., `myweb_translator`).
3.  Create a user and password for that database and assign all privileges.
4.  Open **phpMyAdmin**, select your new database, and go to the "Import" tab.
5.  Select the `schema.sql` file included with the app and run the import.

### 4. Connect the App
1.  Edit the `config.php` file you uploaded to the server.
2.  Update the details with your database credentials:
    ```php
    return [
        'db_host' => 'localhost',
        'db_name' => 'your_database_name',
        'db_user' => 'database_user',
        'db_pass' => 'your_password',
        // ...
    ];
    ```
3.  Done! Visit your website (e.g., `www.your-domain.com/translator`) and start translating.

## Usage
1.  **Select Languages:** Choose the source language (or leave as "Auto Detect") and the target language.
2.  **Output Format:** Choose whether to keep the original format or convert the file (e.g., Image to PDF).
3.  **Upload File:** Drag and drop your document into the blue box or click the button.
4.  **Wait:** You will see a progress bar while the browser reads, recognizes (OCR), and translates the text.
5.  **Download:** Once finished, a green button will appear to download your translated document.
