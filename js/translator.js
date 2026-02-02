// js/translator.js

/**
 * Translation Service handles communicating with external APIs
 * and managing text chunking/rate limits.
 */
class TranslationService {
    constructor(providerConfig) {
        this.provider = providerConfig.type; // 'libretranslate', 'mymemory'
        this.apiUrl = providerConfig.url;
        this.apiKey = providerConfig.key || '';
    }

    async translateText(text, sourceLang, targetLang) {
        if (!text || typeof text !== 'string') return text;
        const trimmed = text.trim();
        if (trimmed.length === 0) return text;

        // Basic chunking to avoid payload limits (approx 1000 chars per chunk to be safe)
        const chunks = this.chunkText(text, 1000);
        const translatedChunks = [];

        for (const chunk of chunks) {
            try {
                const translated = await this.callApi(chunk, sourceLang, targetLang);
                translatedChunks.push(translated);
            } catch (e) {
                console.error("Translation error:", e);
                // Fallback: return original text if translation fails
                translatedChunks.push(chunk);
            }
        }

        return translatedChunks.join('');
    }

    chunkText(text, maxLength) {
        const chunks = [];
        let currentChunk = '';
        const sentences = text.split(/([.?!:\n]+)/); // Split by punctuation

        for (const part of sentences) {
            if ((currentChunk + part).length > maxLength) {
                chunks.push(currentChunk);
                currentChunk = part;
            } else {
                currentChunk += part;
            }
        }
        if (currentChunk) chunks.push(currentChunk);
        return chunks;
    }

    async callApi(text, source, target) {
        if (this.provider === 'libretranslate') {
            return this.translateLibre(text, source, target);
        } else if (this.provider === 'mymemory') {
            return this.translateMyMemory(text, source, target);
        } else {
            // Mock or default
            return `[${target}] ${text}`;
        }
    }

    async translateLibre(text, source, target) {
        try {
            const res = await fetch(this.apiUrl + '/translate', {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: source,
                    target: target,
                    format: 'text'
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            return data.translatedText || text;
        } catch (e) {
            console.warn("LibreTranslate failed, trying fallback...", e);
            throw e;
        }
    }

    async translateMyMemory(text, source, target) {
        // MyMemory requires email for more usage, but works without for small bits
        let src = source;
        if (src === 'auto') src = 'en'; // Fallback: MyMemory requires explicit source

        const url = `${this.apiUrl}/get?q=${encodeURIComponent(text)}&langpair=${src}|${target}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        }
        throw new Error(data.responseDetails || "MyMemory error");
    }
}


// Main Orchestrator
async function processDocument(file, config, callback) {
    const translator = new TranslationService(config.provider);

    callback(5, `Iniciando motor de traducción (${config.provider.type})...`);

    // Dispatcher based on file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let processedBlob = null;
    let inputType = 'unknown';

    try {
        // 1. Translation Phase (Preserving Format)
        if (fileType === 'text/plain') {
            inputType = 'txt';
            processedBlob = await processTextFile(file, translator, config, callback);
        } else if (fileName.endsWith('.docx')) {
            inputType = 'docx';
            processedBlob = await processDocxFile(file, translator, config, callback);
        } else if (fileName.endsWith('.pdf')) {
            inputType = 'pdf';
            processedBlob = await processPdfFile(file, translator, config, callback);
        } else if (fileType.startsWith('image/')) {
            inputType = 'image';
            processedBlob = await processImageFile(file, translator, config, callback);
        } else if (fileName.endsWith('.epub')) {
            inputType = 'epub';
            processedBlob = await processEpubFile(file, translator, config, callback);
        } else {
            throw new Error(`Formato no soportado: ${fileType || fileName}`);
        }

        // 2. Conversion Phase (If needed)
        const targetFormat = config.outputFormat; // original, pdf, docx, txt
        if (targetFormat !== 'original' && targetFormat !== inputType) {
            callback(96, `Convirtiendo formato de ${inputType} a ${targetFormat}...`);
            return await convertFormat(processedBlob, inputType, targetFormat, callback);
        }

        return processedBlob;

    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function convertFormat(blob, fromType, toType, callback) {
    // Basic conversion logic matrix

    // To TXT
    if (toType === 'txt') {
        if (fromType === 'txt') return blob;
        // Extracting text from PDF/DOCX blob client-side is hard without re-parsing.
        // For this version, we will only support robust conversions.
        // If we just translated it, we might have the text, but the architecture separates translation from conversion.
        // We will try a simple text extraction if possible or return blob with warning.
        // Note: Implementing full text extraction from Blob again is heavy.
        // We will fallback to returning the original for unsupported conversions to avoid breaking flow.
        console.warn("TXT conversion from complex binary not fully implemented.");
        return blob;
    }

    // To PDF
    if (toType === 'pdf') {
        if (fromType === 'image') {
            const pdfDoc = await PDFLib.PDFDocument.create();
            const imageBytes = await blob.arrayBuffer();
            let embeddedImage;
            // Detect mime from blob
            if (blob.type === 'image/png') embeddedImage = await pdfDoc.embedPng(imageBytes);
            else embeddedImage = await pdfDoc.embedJpg(imageBytes);

            const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
            page.drawImage(embeddedImage, {x:0, y:0, width: embeddedImage.width, height: embeddedImage.height});
            const pdfBytes = await pdfDoc.save();
            return new Blob([pdfBytes], { type: 'application/pdf' });
        }
        if (fromType === 'txt') {
             const pdfDoc = await PDFLib.PDFDocument.create();
             const page = pdfDoc.addPage();
             const text = await blob.text();
             const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
             const fontSize = 12;
             const { width, height } = page.getSize();

             page.drawText(text, {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: timesRomanFont,
                maxWidth: width - 100,
                lineHeight: fontSize + 2
             });
             const pdfBytes = await pdfDoc.save();
             return new Blob([pdfBytes], { type: 'application/pdf' });
        }
    }

    // To DOCX
    if (toType === 'docx') {
        if (fromType === 'txt') {
             if (!window.docx) throw new Error("Librería DOCX no cargada.");
             const text = await blob.text();
             const doc = new docx.Document({
                 sections: [{
                     properties: {},
                     children: [
                         new docx.Paragraph({ children: [new docx.TextRun(text)] })
                     ]
                 }]
             });
             return await docx.Packer.toBlob(doc);
        }
    }

    // Fallback
    console.warn(`Conversión de ${fromType} a ${toType} no soportada en cliente.`);
    alert(`No es posible convertir de ${fromType} a ${toType} en el navegador. Se descargará en formato original.`);
    return blob;
}

// --- Specific File Handlers (Placeholders for now) ---

async function processTextFile(file, translator, config, callback) {
    callback(10, "Leyendo archivo de texto...");
    const text = await file.text();

    callback(30, "Traduciendo...");
    const translated = await translator.translateText(text, config.sourceLang, config.targetLang);

    callback(100, "Finalizado.");
    return new Blob([translated], { type: 'text/plain' });
}

async function processDocxFile(file, translator, config, callback) {
    callback(10, "Descomprimiendo DOCX...");

    if (!window.JSZip) throw new Error("Librería JSZip no cargada.");

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const docXmlFile = zip.file("word/document.xml");
    if (!docXmlFile) throw new Error("No es un archivo DOCX válido (falta document.xml).");

    let docXmlText = await docXmlFile.async("string");

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(docXmlText, "text/xml");

    // Find Paragraphs
    const paragraphs = xmlDoc.getElementsByTagName("w:p");
    const totalP = paragraphs.length;

    callback(20, `Encontrados ${totalP} párrafos. Traduciendo...`);

    // Process chunks to allow UI updates
    for (let i = 0; i < totalP; i++) {
        const p = paragraphs[i];
        const pTextNodes = p.getElementsByTagName("w:t");

        if (pTextNodes.length === 0) continue;

        // Extract full text of paragraph
        let originalText = "";
        for (let t of pTextNodes) {
            originalText += t.textContent;
        }

        if (!originalText.trim()) continue;

        // Translate
        // Note: For a real app, we should batch these calls to reduce API latency.
        // But for simplicity/readability here, we await each.
        const translatedText = await translator.translateText(originalText, config.sourceLang, config.targetLang);

        // Strategy: Update first node, clear others to maintain paragraph structure but replace text.
        // This sacrifices internal styling changes (e.g. one bold word) for translation grammar.
        pTextNodes[0].textContent = translatedText;
        for (let j = 1; j < pTextNodes.length; j++) {
            pTextNodes[j].textContent = "";
        }

        // Update progress
        if (i % 5 === 0) {
            const percent = 20 + Math.round((i / totalP) * 60);
            callback(percent, `Traduciendo párrafo ${i + 1}/${totalP}...`);
        }
    }

    // Re-serialize
    const serializer = new XMLSerializer();
    const newXmlStr = serializer.serializeToString(xmlDoc);

    zip.file("word/document.xml", newXmlStr);

    callback(90, "Reconstruyendo archivo DOCX...");
    const outBlob = await zip.generateAsync({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    return outBlob;
}

async function processPdfFile(file, translator, config, callback) {
    callback(5, "Inicializando PDF Engine...");

    if (!window.pdfjsLib) throw new Error("PDF.js no cargado.");
    if (!window.PDFLib) throw new Error("PDF-Lib no cargado.");
    if (!window.Tesseract) throw new Error("Tesseract no cargado.");

    // Setup PDF.js worker
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Initialize OCR Worker once
    const langMap = {
        'en': 'eng', 'es': 'spa', 'fr': 'fra', 'de': 'deu',
        'it': 'ita', 'pt': 'por', 'zh': 'chi_sim', 'ja': 'jpn', 'auto': 'eng+spa'
    };
    const tessLang = langMap[config.sourceLang] || 'eng';
    const worker = await Tesseract.createWorker(tessLang);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        callback(10, `PDF cargado: ${numPages} páginas.`);

        // Create new PDF
        const newPdfDoc = await PDFLib.PDFDocument.create();

        for (let i = 1; i <= numPages; i++) {
            callback(10 + Math.round((i/numPages)*70), `Procesando página ${i}/${numPages}...`);

            // Render Page to Image
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({scale: 2.0}); // High scale for better OCR
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({canvasContext: ctx, viewport: viewport}).promise;

            const pageBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.8));

            // Process Image (OCR + Reconstruct)
            const processedBlob = await ocrAndReconstruct(pageBlob, worker, translator, config, (p, msg) => {
                // optional sub-progress
            });

            // Add to new PDF
            const processedImageBytes = await processedBlob.arrayBuffer();
            const embeddedImage = await newPdfDoc.embedJpg(processedImageBytes);

            const newPage = newPdfDoc.addPage([embeddedImage.width / 2, embeddedImage.height / 2]); // Scale back down
            newPage.drawImage(embeddedImage, {
                x: 0,
                y: 0,
                width: embeddedImage.width / 2,
                height: embeddedImage.height / 2,
            });
        }

        callback(90, "Finalizando documento PDF...");
        const pdfBytes = await newPdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });

    } finally {
        await worker.terminate();
    }
}

async function processImageFile(file, translator, config, callback) {
    callback(10, "Cargando motor de OCR...");

    // Map language
    const langMap = {
        'en': 'eng', 'es': 'spa', 'fr': 'fra', 'de': 'deu',
        'it': 'ita', 'pt': 'por', 'zh': 'chi_sim', 'ja': 'jpn', 'auto': 'eng+spa'
    };
    const tessLang = langMap[config.sourceLang] || 'eng';

    const worker = await Tesseract.createWorker(tessLang);

    try {
        return await ocrAndReconstruct(file, worker, translator, config, callback);
    } finally {
        await worker.terminate();
    }
}

// Reusable logic
async function ocrAndReconstruct(file, worker, translator, config, callback) {
    const cb = callback || (() => {});
    cb(30, "Analizando texto...");

    const ret = await worker.recognize(file);
    const blocks = ret.data.blocks;

    // Prepare Canvas
    const imgBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0);

    if (!blocks || blocks.length === 0) {
        // Just return original if no text found
        const blob = await new Promise(r => canvas.toBlob(r, file.type || 'image/jpeg'));
        return blob;
    }

    cb(50, "Traduciendo...");

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const text = block.text.trim();
        const bbox = block.bbox;

        if (!text) continue;

        const translatedText = await translator.translateText(text, config.sourceLang, config.targetLang);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);

        drawTextInBox(ctx, translatedText, bbox);
    }

    cb(95, "Generando imagen...");
    return await new Promise(r => canvas.toBlob(r, file.type || 'image/jpeg'));
}


function drawTextInBox(ctx, text, bbox) {
    const x = bbox.x0;
    const y = bbox.y0;
    const w = bbox.x1 - bbox.x0;
    const h = bbox.y1 - bbox.y0;

    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    // Initial font size guess based on box height (very rough)
    // We assume about 20px or box height/lines
    let fontSize = 20;
    ctx.font = `${fontSize}px Arial`;

    // Simple fitting: wrap text. If it overflows height, reduce font size.
    const words = text.split(' ');
    let lines = [];

    // Function to calculate lines for a given font size
    const getLines = (fSize) => {
        ctx.font = `${fSize}px Arial`;
        let curLines = [];
        let curLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let width = ctx.measureText(curLine + " " + words[i]).width;
            if (width < w) {
                curLine += " " + words[i];
            } else {
                curLines.push(curLine);
                curLine = words[i];
            }
        }
        curLines.push(curLine);
        return curLines;
    };

    // Iteratively reduce font size until it fits in height
    // Max iterations to avoid freeze
    for (let i = 0; i < 10; i++) {
        lines = getLines(fontSize);
        const totalHeight = lines.length * (fontSize * 1.2); // 1.2 line height
        if (totalHeight <= h || fontSize <= 8) {
            break;
        }
        fontSize -= 2;
    }

    // Draw
    ctx.font = `${fontSize}px Arial`;
    let curY = y;
    for (let line of lines) {
        ctx.fillText(line, x, curY);
        curY += fontSize * 1.2;
    }
}

async function processEpubFile(file, translator, config, callback) {
    callback(10, "Descomprimiendo EPUB...");
    if (!window.JSZip) throw new Error("Librería JSZip no cargada.");

    const zip = await JSZip.loadAsync(file);

    // Find content.opf via META-INF/container.xml
    const containerFile = zip.file("META-INF/container.xml");
    if (!containerFile) throw new Error("No es un archivo EPUB válido (falta META-INF/container.xml).");

    const containerXml = await containerFile.async("string");
    const parser = new DOMParser();
    const containerDoc = parser.parseFromString(containerXml, "text/xml");

    // Handle namespaces in XML properly or just use querySelector if simple
    const rootNode = containerDoc.getElementsByTagName("rootfile")[0];
    if (!rootNode) throw new Error("EPUB inválido: no rootfile.");

    const rootPath = rootNode.getAttribute("full-path");

    // Read OPF
    const opfFile = zip.file(rootPath);
    if (!opfFile) throw new Error(`EPUB inválido: no se encuentra ${rootPath}`);

    const opfXml = await opfFile.async("string");
    const opfDoc = parser.parseFromString(opfXml, "text/xml");

    // Get Manifest (id -> href)
    const manifestItems = opfDoc.getElementsByTagName("item");
    const hrefMap = {};
    for (let i=0; i<manifestItems.length; i++) {
        const item = manifestItems[i];
        hrefMap[item.getAttribute("id")] = item.getAttribute("href");
    }

    // Get Spine (reading order)
    const spine = opfDoc.getElementsByTagName("itemref");
    const filesToProcess = [];

    const rootDir = rootPath.includes('/') ? rootPath.substring(0, rootPath.lastIndexOf('/') + 1) : '';

    for (let i=0; i<spine.length; i++) {
        const id = spine[i].getAttribute("idref");
        const href = hrefMap[id];
        if (href) {
            // Path resolution
            const fullPath = rootDir + href;
            filesToProcess.push(fullPath);
        }
    }

    callback(20, `Encontrados ${filesToProcess.length} capítulos/secciones.`);

    // Process HTML/XHTML files
    for (let i = 0; i < filesToProcess.length; i++) {
        const path = filesToProcess[i];
        const htmlFile = zip.file(path);

        // Skip if not found or if it's an image/css listed in spine (unlikely but possible)
        if (!htmlFile) continue;

        const content = await htmlFile.async("string");

        // Detect mimetype based on extension
        const mime = path.endsWith('.xhtml') || path.endsWith('.xml') ? 'application/xhtml+xml' : 'text/html';
        const doc = parser.parseFromString(content, mime);

        // Translate DOM
        await translateHtmlDocument(doc, translator, config);

        // Serialize back
        const serializer = new XMLSerializer();
        const newContent = serializer.serializeToString(doc);
        zip.file(path, newContent);

        // Update progress
        const percent = 20 + Math.round((i / filesToProcess.length) * 70);
        if (i % 2 === 0) callback(percent, `Traduciendo sección ${i+1}/${filesToProcess.length}...`);
    }

    callback(95, "Reconstruyendo EPUB...");
    return await zip.generateAsync({type:"blob", mimeType: "application/epub+zip"});
}

async function translateHtmlDocument(doc, translator, config) {
    // Traverse text nodes
    // Using TreeWalker is efficient
    const walker = doc.createTreeWalker(doc.body || doc.documentElement, NodeFilter.SHOW_TEXT, null, false);
    const nodesToTranslate = [];

    let currentNode = walker.nextNode();
    while(currentNode) {
        const text = currentNode.textContent.trim();
        if (text.length > 0) {
            // Exclude script/style
            const parent = currentNode.parentNode;
            if (parent) {
                const tag = parent.tagName.toLowerCase();
                if (tag !== 'script' && tag !== 'style' && tag !== 'code') {
                    nodesToTranslate.push(currentNode);
                }
            }
        }
        currentNode = walker.nextNode();
    }

    // Batch translation or per-node?
    // Per-node maintains structure safely.
    // For performance, we could batch, but keeping it simple for now.

    for (const node of nodesToTranslate) {
        const original = node.textContent;
        // Skip very short generic things maybe? No, translate everything.
        try {
            const translated = await translator.translateText(original, config.sourceLang, config.targetLang);
            node.textContent = translated;
        } catch (e) {
            console.warn("Translation failed for node", e);
        }
    }
}
