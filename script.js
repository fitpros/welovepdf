// Merge PDF function
async function mergePDF() {
    const files = document.getElementById('mergeFiles').files;
    if (files.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
    }

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
}

// Compress PDF (placeholder - basic compression not fully supported in pdf-lib)
function compressPDF() {
    const file = document.getElementById('compressFile').files[0];
    if (file) {
        alert('Compression is a placeholder feature. Use a backend service for full functionality.');
    } else {
        alert('Please select a PDF file to compress.');
    }
}

// Convert PDF (placeholder - requires external tools for full conversion)
function convertPDF() {
    const file = document.getElementById('convertFile').files[0];
    const format = document.getElementById('convertFormat').value;
    if (file) {
        alert(`Conversion to ${format} is a placeholder. Use a backend service for full functionality.`);
    } else {
        alert('Please select a PDF file to convert.');
    }
}

// Edit PDF function (add text)
async function editPDF() {
    const file = document.getElementById('editFile').files[0];
    const text = document.getElementById('editText').value;
    if (!file || !text) {
        alert('Please select a PDF file and enter text to add.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPage(0); // Edit first page only
    page.drawText(text, {
        x: 50,
        y: page.getHeight() - 50,
        size: 20,
        color: PDFLib.rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.getElementById('downloadEditLink');
    downloadLink.href = url;
    downloadLink.style.display = 'inline';
    downloadLink.textContent = 'Download Edited PDF';
}
