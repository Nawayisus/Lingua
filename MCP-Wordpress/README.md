# MCP-Wordpress

[Español](#español) | [English](#english)

Repositorio: [https://github.com/Nawayisus/MCP-Wordpress](https://github.com/Nawayisus/MCP-Wordpress)

---

<a name="español"></a>
# Español

Este proyecto (anteriormente conocido como Perplexity to WordPress Bridge) te permite conectar la aplicación de escritorio de Perplexity (o cualquier cliente compatible con MCP) a tu sitio web de WordPress.
Utiliza un **Enfoque Híbrido (Opción B)** para garantizar la máxima estabilidad y rendimiento en Windows:

1.  **Plugin de WordPress (`wordpress-plugin/`)**:
    -   Un plugin ligero que expone una ruta API optimizada para la IA en tu sitio de WordPress.
    -   Maneja la autenticación segura utilizando "Contraseñas de Aplicación" (Application Passwords) de WordPress.
    -   Funciona bien en hostings compartidos donde los procesos de larga duración (SSE) suelen fallar.

2.  **Cliente Puente Local (`local-client/`)**:
    -   Un script de Python que se ejecuta en tu máquina Windows.
    -   Actúa como un Servidor MCP para Perplexity Desktop.
    -   Se comunica con tu sitio de WordPress a través de peticiones HTTP estándar.
    -   Traduce los comandos de Perplexity (ej: "Crea un borrador") en acciones reales en tu sitio.

## Instrucciones de Instalación

### Parte 1: Instalar el Plugin de WordPress
1.  Ve a la carpeta `wordpress-plugin`.
2.  Comprime su contenido en un archivo ZIP (o copia la carpeta entera) y súbelo a tu sitio WordPress en `wp-content/plugins/`.
3.  Activa el plugin **"MCP Connect"** en el panel de administración de WordPress.
4.  Ve a **Usuarios > Perfil** en WordPress.
5.  Desplázate hacia abajo hasta la sección **Contraseñas de aplicación**.
6.  Crea una nueva contraseña con el nombre `PerplexityBridge`.
7.  **Copia esta contraseña inmediatamente** (no podrás verla de nuevo). La necesitarás en la Parte 2.

### Parte 2: Configurar el Cliente Local (Windows)
1.  Instala Python 3.10+ si aún no lo tienes.
2.  Abre una terminal (PowerShell o Símbolo del sistema) en la carpeta `local-client`.
3.  Instala las dependencias necesarias:
    ```bash
    pip install -r requirements.txt
    ```
4.  Copia el archivo de ejemplo `.env.example` y renómbralo a `.env`:
    ```bash
    copy .env.example .env
    ```
5.  Abre el archivo `.env` con un editor de texto (Bloc de notas, VS Code) y completa tus datos:
    -   `WP_URL`: La URL de tu sitio WordPress (ej: `https://www.bondagechile.cl/shibari`).
    -   `WP_USER`: Tu nombre de usuario de WordPress.
    -   `WP_APP_PASSWORD`: La contraseña de aplicación que copiaste en la Parte 1.

### Parte 3: Verificar la Conexión (Opcional pero Recomendado)
Antes de conectar Perplexity, prueba que tu configuración de Python puede hablar con tu sitio.
Ejecuta el script de prueba incluido:
```bash
python test_connection.py
```
Si ves marcas de verificación verdes (✅), todo está funcionando correctamente.

### Parte 4: Conectar Perplexity Desktop
1.  Abre la configuración de Perplexity Desktop.
2.  Ve a **MCP Servers**.
3.  Añade un nuevo servidor:
    -   **Name**: WordPress Bridge
    -   **Command**: `python`
    -   **Arguments**: `ruta/absoluta/a/MCP-Wordpress/local-client/bridge.py`
    -   (Reemplaza `ruta/absoluta/a/...` con la ruta completa real al archivo en tu computadora).

## Uso
Una vez conectado, puedes pedirle a Perplexity cosas como:
-   "Crea un borrador sobre el PDF que acabo de subir."
-   "Lista mis posts recientes."
-   "Actualiza el post con ID 123 y publícalo."

El puente se encargará de realizar la comunicación de forma segura.

---

<a name="english"></a>
# English

This project allows you to connect Perplexity Desktop (or any MCP-compatible client) to your WordPress site.
It uses a **Hybrid Approach (Option B)** for maximum stability and performance on Windows:

1.  **WordPress Plugin (`wordpress-plugin/`)**:
    -   A lightweight plugin that exposes a clean, AI-friendly API endpoint on your WordPress site.
    -   Handles secure authentication using WordPress Application Passwords.
    -   Ensures compatibility with shared hosting environments where long-running processes (SSE) might be terminated.

2.  **Local Bridge Client (`local-client/`)**:
    -   A Python script that runs on your Windows machine.
    -   Acts as an MCP Server for Perplexity Desktop.
    -   Communicates with your WordPress site via standard HTTP requests.
    -   Translates Perplexity's commands (e.g., "Create a draft post") into actions on your site.

## Setup Instructions

### Part 1: Install the WordPress Plugin
1.  Go to the `wordpress-plugin` folder.
2.  Zip the contents (or just copy the folder) and upload it to your WordPress site under `wp-content/plugins/`.
3.  Activate the plugin "MCP Connect" in your WordPress admin dashboard.
4.  Go to **Users > Profile** in WordPress.
5.  Scroll down to **Application Passwords**.
6.  Create a new Application Password named `PerplexityBridge`.
7.  **Copy this password immediately** (you won't see it again). You'll need it in Part 2.

### Part 2: Configure the Local Client (Windows)
1.  Install Python 3.10+ if you haven't already.
2.  Open a terminal (PowerShell or Command Prompt) in the `local-client` folder.
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Copy `.env.example` to `.env`:
    ```bash
    copy .env.example .env
    ```
5.  Open `.env` in a text editor (Notepad, VS Code) and fill in your details:
    -   `WP_URL`: Your WordPress site URL (e.g., `https://www.bondagechile.cl/shibari`).
    -   `WP_USER`: Your WordPress username.
    -   `WP_APP_PASSWORD`: The Application Password you copied in Part 1.

### Part 3: Verify Connection (Optional but Recommended)
Before connecting Perplexity, test that your Python setup can talk to your WordPress site.
Run the included test script:
```bash
python test_connection.py
```
If you see ✅ checks, everything is working correctly.

### Part 4: Connect Perplexity Desktop
1.  Open Perplexity Desktop Settings.
2.  Go to **MCP Servers**.
3.  Add a new server:
    -   **Name**: WordPress Bridge
    -   **Command**: `python`
    -   **Arguments**: `absolute/path/to/MCP-Wordpress/local-client/bridge.py`
    -   (Replace `absolute/path/to/...` with the actual full path to the file on your computer).

## Usage
Once connected, you can ask Perplexity:
-   "Create a draft post about the PDF I just uploaded."
-   "List my recent posts."
-   "Update the post with ID 123 to be published."

The bridge will handle the communication securely.
