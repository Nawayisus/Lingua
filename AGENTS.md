# AGENTS.md

## Project Context
This is a web-based file translation application designed for standard Shared Hosting environments (Apache, PHP, MariaDB).

## Constraints & Requirements
1.  **No Node.js Build Steps:** The frontend must use Vanilla JavaScript or libraries loadable via `<script>` tags (ES Modules or UMD). Do not use Webpack, Vite, or Parcel. The user must be able to just copy the files to a server.
2.  **Compatibility:** PHP code must be compatible with PHP 8.0+.
3.  **Database:** Use PDO for all database interactions.
4.  **Client-Side Processing:** All heavy lifting (OCR, Parsing, PDF manipulation) must happen in the browser to avoid server timeouts and limits.
5.  **Files:**
    - `index.php`: Main entry point.
    - `js/`: Application logic.
    - `css/`: Styles.
    - `api/`: PHP endpoints for server-side persistence (if enabled).

## Coding Style
-   Use modern JavaScript (ES6+) but ensure browser compatibility.
-   Comment code generously, especially complex document parsing logic.
