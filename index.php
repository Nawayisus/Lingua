<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universal Document Translator</title>
    <!-- Bootstrap CSS for quick styling -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-light">

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand" href="#"><i class="fas fa-language"></i> Universal Translator</a>
    </div>
</nav>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0">Cargar Documento</h5>
                </div>
                <div class="card-body">

                    <div id="alertPlaceholder"></div>

                    <!-- Settings Row -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label">Idioma Original</label>
                            <select class="form-select" id="sourceLang">
                                <option value="auto">Detectar Automático</option>
                                <option value="en">Inglés</option>
                                <option value="es">Español</option>
                                <option value="fr">Francés</option>
                                <option value="de">Alemán</option>
                                <option value="it">Italiano</option>
                                <option value="pt">Portugués</option>
                                <option value="zh">Chino</option>
                                <option value="ja">Japonés</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Idioma Destino</label>
                            <select class="form-select" id="targetLang">
                                <option value="es" selected>Español</option>
                                <option value="en">Inglés</option>
                                <option value="fr">Francés</option>
                                <option value="de">Alemán</option>
                                <option value="it">Italiano</option>
                                <option value="pt">Portugués</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Formato de Salida</label>
                            <select class="form-select" id="outputFormat">
                                <option value="original" selected>Igual al Original</option>
                                <option value="pdf">PDF (.pdf)</option>
                                <option value="docx">Word (.docx)</option>
                                <option value="txt">Texto (.txt)</option>
                                <!-- EPUB/Images are hard to target generically, keeping simple list -->
                            </select>
                        </div>
                    </div>
                    <div class="row g-3 mb-4">
                        <div class="col-md-12">
                            <label class="form-label">Proveedor de Traducción</label>
                            <select class="form-select" id="providerSelect">
                                <option value="libretranslate">LibreTranslate (Free)</option>
                                <!-- More will be added via JS -->
                            </select>
                        </div>
                    </div>

                    <!-- Upload Area -->
                    <div class="upload-area p-5 text-center border rounded bg-light" id="dropZone">
                        <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                        <h5>Arrastra y suelta tu archivo aquí</h5>
                        <p class="text-muted">PDF, DOCX, JPG, PNG, EPUB</p>
                        <!-- Supported formats: PDF, DOCX, Images, EPUB. .doc/mobi/azw3 removed due to client-side limitations -->
                        <input type="file" id="fileInput" class="d-none" accept=".pdf,.docx,.jpg,.jpeg,.png,.epub">
                        <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">Seleccionar Archivo</button>
                    </div>

                    <!-- Progress Area -->
                    <div id="progressArea" class="mt-4 d-none">
                        <h6 id="statusText">Procesando...</h6>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" id="progressBar"></div>
                        </div>
                        <div class="mt-2 text-muted small" id="logConsole" style="max-height: 100px; overflow-y: auto; font-family: monospace;"></div>
                    </div>

                    <!-- Result Area -->
                    <div id="resultArea" class="mt-4 d-none text-center">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i> Traducción Completada
                        </div>
                        <a href="#" id="downloadBtn" class="btn btn-success btn-lg"><i class="fas fa-download"></i> Descargar Documento</a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<footer class="text-center mt-5 mb-3 text-muted">
    <small>Powered by Client-Side Processing Technology</small>
</footer>

<!-- External Libraries (CDNs for now, can be local) -->
<!-- JSZip -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<!-- PDF.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<!-- PDF-Lib -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
<!-- Tesseract.js -->
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
<!-- FileSaver -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
<!-- DOCX.js -->
<script src="https://unpkg.com/docx@7.1.0/build/index.js"></script>

<!-- App Scripts -->
<script src="js/translator.js"></script>
<script src="js/app.js"></script>

</body>
</html>
