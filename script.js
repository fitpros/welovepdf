// Global variables for PDF editing
let pdfDoc = null;
let pageNum = 1;
let canvas = null;
let ctx = null;
let editedPDF = null;

// Load and render PDF
async function loadPDF() {
    const fileInput = document.getElementById('editFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a PDF file.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    editedPDF = await PDFLib.PDFDocument.create();

    // Render first page with PDF.js
    const pdfJS = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdfJS.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    canvas = document.getElementById('pdfCanvas');
    ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Set overlay size and enable clicking
    const overlay = document.getElementById('editOverlay');
    overlay.style.width = `${canvas.width}px`;
    overlay.style.height = `${canvas.height}px`;
    overlay.addEventListener('click', addTextToOverlay);

    document.getElementById('saveButton').style.display = 'block';
}

// Add text interactively on click
function addTextToOverlay(event) {
    const text = document.getElementById('editText').value;
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const fontColor = document.getElementById('fontColor').value;

    if (!text) {
        alert('Please enter text to add.');
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add text to canvas (temporary preview)
    ctx.font = `${fontSize}px Poppins`;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, x, y);

    // Store edit for saving
    const page = pdfDoc.getPage(0);
    page.drawText(text, {
        x: x / 1.5, // Adjust for scale
        y: page.getHeight() - (y / 1.5),
        size: fontSize,
        color: hexToRgb(fontColor),
    });
}

// Convert hex color to RGB for pdf-lib
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return PDFLib.rgb(r, g, b);
}

// Save edited PDF
async function savePDF() {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadEditLink');
    downloadLink.href = url;
    downloadLink.style.display = 'inline';
}

// Merge PDFs (unchanged from previous)
async function mergePDFs() {
    const files = document.getElementById('mergeFiles').files;
    if (files.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
    }

    try {
        const pdfDoc = await PDFLib.PDFDocument.create();
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => pdfDoc.addPage(page));
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Download Merged PDF';
    } catch (error) {
        alert('Error merging PDFs: ' + error.message);
    }
}

// Compress and Convert (placeholders unchanged)
function compressPDF() {
    const file = document.getElementById('compressFile').files[0];
    if (file) {
        alert('Compression requires a backend service for full functionality.');
    } else {
        alert('Please select a PDF file to compress.');
    }
}

function convertPDF() {
    const file = document.getElementById('convertFile').files[0];
    const format = document.getElementById('convertFormat').value;
    if (file) {
        alert(`Conversion to ${format} requires a backend service for full functionality.`);
    } else {
        alert('Please select a PDF file to convert.');
    }
}
