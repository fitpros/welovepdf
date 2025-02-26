// Merge PDFs
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

// Compress PDF (Placeholder)
function compressPDF() {
    const file = document.getElementById('compressFile').files[0];
    if (file) {
        alert('Compression is not fully supported in the browser. For full functionality, use a backend service.');
    } else {
        alert('Please select a PDF file to compress.');
    }
}

// Convert PDF (Placeholder)
function convertPDF() {
    const file = document.getElementById('convertFile').files[0];
    const format = document.getElementById('convertFormat').value;
    if (file) {
        alert(`Conversion to ${format} is not supported in the browser yet. For full conversion, a backend service is required.`);
    } else {
        alert('Please select a PDF file to convert.');
    }
}

// Edit PDF
async function editPDF() {
    const file = document.getElementById('editFile').files[0];
    const text = document.getElementById('editText').value;
    const xPos = parseInt(document.getElementById('xPos').value) || 50;
    const yPos = parseInt(document.getElementById('yPos').value) || 50;

    if (!file) {
        alert('Please select a PDF file.');
        return;
    }
    if (!text) {
        alert('Please enter text to add.');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const page = pdfDoc.getPage(0); // Edit first page

        // Add Text
        page.drawText(text, {
            x: xPos,
            y: page.getHeight() - yPos, // Y is from bottom, adjust from top
            size: 20,
            color: PDFLib.rgb(0, 0, 1), // Blue text
        });

        // Add Rectangle (example of drawing)
        page.drawRectangle({
            x: xPos + 50,
            y: page.getHeight() - yPos - 20,
            width: 100,
            height: 50,
            borderColor: PDFLib.rgb(1, 0, 0), // Red border
            borderWidth: 2,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('downloadEditLink');
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Download Edited PDF';
    } catch (error) {
        alert('Error editing PDF: ' + error.message);
    }
}
