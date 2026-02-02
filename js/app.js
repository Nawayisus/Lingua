document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const UI = {
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    providerSelect: document.getElementById('providerSelect'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    progressArea: document.getElementById('progressArea'),
    progressBar: document.getElementById('progressBar'),
    statusText: document.getElementById('statusText'),
    logConsole: document.getElementById('logConsole'),
    resultArea: document.getElementById('resultArea'),
    downloadBtn: document.getElementById('downloadBtn'),
};

let selectedFile = null;

function initApp() {
    loadProviders();
    setupEventListeners();
}

function loadProviders() {
    fetch('api/get_providers.php')
        .then(response => response.json())
        .then(data => {
            UI.providerSelect.innerHTML = '';
            data.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id; // Or api_url/type depending on logic
                option.textContent = p.name;
                option.dataset.type = p.type;
                option.dataset.url = p.api_url;
                UI.providerSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Failed to load providers', err);
            // Keep default if fail
        });
}

function setupEventListeners() {
    // Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        UI.dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        UI.dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        UI.dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        UI.dropZone.classList.add('bg-white');
        UI.dropZone.classList.remove('bg-light');
        UI.dropZone.style.borderColor = '#0d6efd';
    }

    function unhighlight() {
        UI.dropZone.classList.add('bg-light');
        UI.dropZone.classList.remove('bg-white');
        UI.dropZone.style.borderColor = '#dee2e6';
    }

    UI.dropZone.addEventListener('drop', handleDrop, false);
    UI.fileInput.addEventListener('change', handleFiles, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = e.target.files;
    if (files.length > 0) {
        selectedFile = files[0];
        startProcessing(selectedFile);
    }
}

function log(message) {
    const entry = document.createElement('div');
    entry.textContent = `> ${message}`;
    UI.logConsole.appendChild(entry);
    UI.logConsole.scrollTop = UI.logConsole.scrollHeight;
}

function updateProgress(percent, text) {
    UI.progressBar.style.width = `${percent}%`;
    if (text) UI.statusText.textContent = text;
}

async function startProcessing(file) {
    // Reset UI
    UI.progressArea.classList.remove('d-none');
    UI.resultArea.classList.add('d-none');
    UI.dropZone.classList.add('d-none'); // Hide upload to focus on process
    UI.logConsole.innerHTML = '';
    updateProgress(0, "Iniciando...");

    log(`Archivo seleccionado: ${file.name} (${Math.round(file.size/1024)} KB)`);
    log(`Tipo detectado: ${file.type}`);

    // Get Settings
    const config = {
        sourceLang: UI.sourceLang.value,
        targetLang: UI.targetLang.value,
        provider: {
            type: UI.providerSelect.options[UI.providerSelect.selectedIndex]?.dataset.type || 'libretranslate',
            url: UI.providerSelect.options[UI.providerSelect.selectedIndex]?.dataset.url || 'https://libretranslate.de'
        }
    };

    log(`Configuración: ${config.sourceLang} -> ${config.targetLang} via ${config.provider.type}`);

    // Call the Translator Engine (Defined in translator.js)
    try {
        if (typeof processDocument === 'undefined') {
            throw new Error("Motor de traducción no cargado.");
        }

        const resultBlob = await processDocument(file, config, (progress, message) => {
            updateProgress(progress, message);
            log(message);
        });

        log("Proceso finalizado con éxito.");

        // Save record to backend
        saveRecord(file, config);

        showResult(resultBlob, file.name);

    } catch (error) {
        log(`ERROR: ${error.message}`);
        updateProgress(0, "Error");
        console.error(error);
        alert("Ocurrió un error: " + error.message);
        // Show upload again
        UI.dropZone.classList.remove('d-none');
    }
}

function showResult(blob, originalName) {
    updateProgress(100, "Completado");
    UI.resultArea.classList.remove('d-none');

    // Create download link
    const url = URL.createObjectURL(blob);
    UI.downloadBtn.href = url;

    // Prefix filename with 'translated_'
    const newName = 'translated_' + originalName;
    UI.downloadBtn.download = newName;
}

function saveRecord(file, config) {
    const formData = new FormData();
    formData.append('filename', file.name);
    formData.append('file_type', file.type);
    formData.append('original_lang', config.sourceLang);
    formData.append('target_lang', config.targetLang);

    fetch('api/save_document.php', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(d => console.log("Record saved", d))
        .catch(e => console.warn("Failed to save record", e));
}
