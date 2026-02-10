# Perplexity to WordPress Bridge (MCP)

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
    -   **Arguments**: `absolute/path/to/perplexity-wordpress-bridge/local-client/bridge.py`
    -   (Replace `absolute/path/to/...` with the actual full path to the file on your computer).

## Usage
Once connected, you can ask Perplexity:
-   "Create a draft post about the PDF I just uploaded."
-   "List my recent posts."
-   "Update the post with ID 123 to be published."

The bridge will handle the communication securely.
