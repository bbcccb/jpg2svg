// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const convertButton = document.getElementById('convertButton');
const resetButton = document.getElementById('resetButton');
const resetErrorButton = document.getElementById('resetErrorButton');
const resultSection = document.getElementById('resultSection');
const downloadButton = document.getElementById('downloadButton');
const convertAnotherButton = document.getElementById('convertAnotherButton');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const uploadSection = document.querySelector('.upload-section');
const modeSelect = document.getElementById('modeSelect');
const printOptions = document.getElementById('3dprintOptions');
const strokeWidth = document.getElementById('strokeWidth');
const strokeValue = document.getElementById('strokeValue');

let selectedFile = null;
let convertedSvgBlob = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleFileDrop);
    dropZone.addEventListener('click', () => fileInput.click());

    // Mode selector
    modeSelect.addEventListener('change', handleModeChange);
    strokeWidth.addEventListener('input', handleStrokeWidthChange);

    // Buttons
    convertButton.addEventListener('click', handleConvert);
    resetButton.addEventListener('click', resetForm);
    resetErrorButton.addEventListener('click', resetForm);
    convertAnotherButton.addEventListener('click', resetForm);
    downloadButton.addEventListener('click', handleDownload);
}

function handleModeChange() {
    const mode = modeSelect.value;
    if (mode === '3dprint') {
        printOptions.style.display = 'block';
    } else {
        printOptions.style.display = 'none';
    }
}

function handleStrokeWidthChange() {
    const value = strokeWidth.value;
    strokeValue.textContent = parseFloat(value).toFixed(1) + ' mm';
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        processFile(file);
    }
}

function processFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
        showError('Only JPG and PNG files are supported');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        showError('File size exceeds 50MB limit');
        return;
    }

    selectedFile = file;
    showPreview(file);
}

function showPreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadSection.style.display = 'none';
        previewSection.style.display = 'flex';
        resultSection.style.display = 'none';
        errorSection.style.display = 'none';
    };

    reader.readAsDataURL(file);
}

async function handleConvert() {
    if (!selectedFile) {
        showError('No file selected');
        return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('mode', modeSelect.value);
    formData.append('strokeWidth', strokeWidth.value);

    convertButton.disabled = true;
    const spinner = convertButton.querySelector('.spinner');
    const btnText = convertButton.querySelector('.btn-text');
    spinner.style.display = 'inline-block';
    btnText.textContent = modeSelect.value === '3dprint' ? 'Converting for 3D...' : 'Converting...';

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Conversion failed');
        }

        convertedSvgBlob = await response.blob();
        showResultSection();

    } catch (error) {
        console.error('Conversion error:', error);
        showError(error.message || 'Conversion failed. Please try again.');
    } finally {
        convertButton.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Convert to SVG';
    }
}

async function handleDownload() {
    if (!convertedSvgBlob) {
        showError('No converted file available');
        return;
    }

    const url = window.URL.createObjectURL(convertedSvgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '.svg';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function showResultSection() {
    previewSection.style.display = 'none';
    uploadSection.style.display = 'none';
    errorSection.style.display = 'none';
    resultSection.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    uploadSection.style.display = 'none';
    previewSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'block';
}

function resetForm() {
    fileInput.value = '';
    selectedFile = null;
    convertedSvgBlob = null;
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}
