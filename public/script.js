const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const modeSelect = document.getElementById('modeSelect');
const printOptions = document.getElementById('3dprintOptions');
const strokeWidth = document.getElementById('strokeWidth');
const strokeValue = document.getElementById('strokeValue');
const convertQueueButton = document.getElementById('convertQueueButton');
const clearQueueButton = document.getElementById('clearQueueButton');
const queueList = document.getElementById('queueList');
const queueMessage = document.getElementById('queueMessage');
const regionEditor = document.getElementById('regionEditor');
const regionCanvas = document.getElementById('regionCanvas');
const regionMessage = document.getElementById('regionMessage');
const clearRegionButton = document.getElementById('clearRegionButton');
const cancelRegionButton = document.getElementById('cancelRegionButton');
const saveRegionButton = document.getElementById('saveRegionButton');
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const maxFileSize = 50 * 1024 * 1024;
const queue = [];

let isProcessing = false;
let notice = '';
let activeItem = null;
let regionImage = null;
let regionPoints = [];
let draftPoints = [];
let isDrawingRegion = false;
let regionLoadToken = 0;

document.addEventListener('DOMContentLoaded', setupEventListeners);

function setupEventListeners() {
    fileInput.addEventListener('change', (event) => {
        addFiles(event.target.files);
        fileInput.value = '';
    });

    dropZone.addEventListener('click', (event) => {
        if (event.target === fileInput || event.target.closest('.file-input-label')) {
            return;
        }

        fileInput.click();
    });
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', (event) => {
        event.preventDefault();
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('drag-over');
        addFiles(event.dataTransfer.files);
    });

    modeSelect.addEventListener('change', () => {
        printOptions.style.display = modeSelect.value === '3dprint' ? 'block' : 'none';
    });
    strokeWidth.addEventListener('input', () => {
        strokeValue.textContent = `${parseFloat(strokeWidth.value).toFixed(1)} mm`;
    });
    convertQueueButton.addEventListener('click', processQueue);
    clearQueueButton.addEventListener('click', clearQueue);
    regionCanvas.addEventListener('pointerdown', startRegionOutline);
    regionCanvas.addEventListener('pointermove', continueRegionOutline);
    regionCanvas.addEventListener('pointerup', finishRegionOutline);
    regionCanvas.addEventListener('pointercancel', finishRegionOutline);
    clearRegionButton.addEventListener('click', clearRegionOutline);
    cancelRegionButton.addEventListener('click', closeRegionEditor);
    saveRegionButton.addEventListener('click', saveRegion);
    regionEditor.addEventListener('click', (event) => {
        if (event.target === regionEditor) {
            closeRegionEditor();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !regionEditor.hidden) {
            closeRegionEditor();
        }
    });
}

function addFiles(files) {
    const rejected = [];

    Array.from(files).forEach((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const hasSupportedType = allowedTypes.includes(file.type)
            || (!file.type && ['jpg', 'jpeg', 'png'].includes(extension));

        if (!hasSupportedType) {
            rejected.push(`${file.name}: unsupported format`);
            return;
        }
        if (file.size > maxFileSize) {
            rejected.push(`${file.name}: exceeds 50MB`);
            return;
        }

        queue.push({
            file,
            state: 'queued',
            error: '',
            region: null,
            downloadUrl: ''
        });
    });

    notice = rejected.join('; ');
    renderQueue();
}

function renderQueue() {
    queueList.replaceChildren();

    queue.forEach((item) => {
        const row = document.createElement('li');
        row.className = `queue-item queue-item-${item.state}`;

        const fileName = document.createElement('span');
        fileName.className = 'queue-file-name';
        fileName.textContent = item.file.name;
        fileName.title = item.file.name;

        const status = document.createElement('span');
        status.className = 'queue-status';
        status.textContent = getStatusText(item);

        const regionStatus = document.createElement('span');
        regionStatus.className = 'queue-region-status';
        regionStatus.textContent = item.region ? 'Area selected' : 'Whole image';

        row.append(fileName, status, regionStatus);

        if (item.state !== 'processing' && item.state !== 'complete') {
            const editRegion = document.createElement('button');
            editRegion.className = 'queue-region-button';
            editRegion.type = 'button';
            editRegion.textContent = item.region ? 'Edit area' : 'Select area';
            editRegion.addEventListener('click', () => openRegionEditor(item));
            row.append(editRegion);
        }

        if (item.downloadUrl) {
            const download = document.createElement('a');
            download.className = 'queue-download';
            download.href = item.downloadUrl;
            download.download = `${item.file.name.replace(/\.[^/.]+$/, '')}.svg`;
            download.textContent = 'Download SVG';
            row.append(download);
        }

        queueList.append(row);
    });

    const completed = queue.filter((item) => item.state === 'complete').length;
    const failed = queue.filter((item) => item.state === 'failed').length;
    if (isProcessing) {
        const current = queue.filter((item) => item.state === 'complete' || item.state === 'failed').length;
        queueMessage.textContent = `Processing ${current + 1} of ${queue.length} images...`;
    } else if (queue.length) {
        queueMessage.textContent = `${queue.length} image(s): ${completed} complete, ${failed} failed, ${queue.length - completed - failed} waiting.`;
    } else {
        queueMessage.textContent = 'Add images to create a batch.';
    }

    if (notice) {
        queueMessage.textContent += ` ${notice}`;
    }

    convertQueueButton.disabled = isProcessing || !queue.some((item) => item.state === 'queued');
    clearQueueButton.disabled = isProcessing || queue.length === 0;
}

function getStatusText(item) {
    if (item.state === 'processing') return 'Converting...';
    if (item.state === 'complete') return 'Ready';
    if (item.state === 'failed') return `Failed: ${item.error}`;
    return 'Queued';
}

function openRegionEditor(item) {
    const loadToken = ++regionLoadToken;
    activeItem = item;
    regionPoints = [];
    draftPoints = [];
    isDrawingRegion = false;
    regionEditor.hidden = false;
    regionCanvas.hidden = true;
    saveRegionButton.disabled = true;
    regionMessage.textContent = 'Loading image preview...';

    const imageUrl = URL.createObjectURL(item.file);
    const image = new Image();
    image.onload = () => {
        URL.revokeObjectURL(imageUrl);
        if (loadToken !== regionLoadToken) return;

        regionImage = image;
        const scale = Math.min(1000 / image.naturalWidth, 700 / image.naturalHeight, 4);
        regionCanvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        regionCanvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        if (item.region) {
            regionPoints = item.region.map(({ x, y }) => ({
                x: x * regionCanvas.width,
                y: y * regionCanvas.height
            }));
        }

        regionMessage.textContent = item.region
            ? 'Drag to redraw the outline, or clear it to convert the whole image.'
            : 'Drag around the area you want converted. Releasing closes the outline.';
        regionCanvas.hidden = false;
        saveRegionButton.disabled = false;
        updateRegionSaveButton();
        drawRegionCanvas();
        saveRegionButton.focus();
    };
    image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        if (loadToken !== regionLoadToken) return;

        activeItem = null;
        regionEditor.hidden = true;
        notice = `Could not preview ${item.file.name}.`;
        renderQueue();
    };
    image.src = imageUrl;
}

function getRegionCanvasPoint(event) {
    const bounds = regionCanvas.getBoundingClientRect();
    return {
        x: (event.clientX - bounds.left) * regionCanvas.width / bounds.width,
        y: (event.clientY - bounds.top) * regionCanvas.height / bounds.height
    };
}

function startRegionOutline(event) {
    if (!activeItem || event.button !== 0) return;

    event.preventDefault();
    regionCanvas.setPointerCapture(event.pointerId);
    draftPoints = [getRegionCanvasPoint(event)];
    isDrawingRegion = true;
    regionMessage.textContent = 'Keep dragging around the area, then release to close the outline.';
    drawRegionCanvas();
}

function continueRegionOutline(event) {
    if (!isDrawingRegion) return;

    const point = getRegionCanvasPoint(event);
    const lastPoint = draftPoints[draftPoints.length - 1];
    if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) >= 2) {
        draftPoints.push(point);
        drawRegionCanvas();
    }
}

function finishRegionOutline() {
    if (!isDrawingRegion) return;

    isDrawingRegion = false;
    if (draftPoints.length < 3 || polygonArea(draftPoints) < 10) {
        draftPoints = [];
        regionMessage.textContent = 'The outline is too small. Draw around a larger area.';
        drawRegionCanvas();
        return;
    }

    regionPoints = draftPoints;
    draftPoints = [];
    regionMessage.textContent = 'Area selected. Use it to convert only the outlined region, or redraw it.';
    updateRegionSaveButton();
    drawRegionCanvas();
}

function polygonArea(points) {
    let area = 0;
    for (let index = 0; index < points.length; index += 1) {
        const current = points[index];
        const next = points[(index + 1) % points.length];
        area += current.x * next.y - next.x * current.y;
    }
    return Math.abs(area) / 2;
}

function drawRegionCanvas() {
    if (!regionImage) return;

    const context = regionCanvas.getContext('2d');
    context.clearRect(0, 0, regionCanvas.width, regionCanvas.height);
    context.drawImage(regionImage, 0, 0, regionCanvas.width, regionCanvas.height);

    if (regionPoints.length >= 3) {
        drawRegionPolygon(context, regionPoints, true);
    }
    if (draftPoints.length) {
        drawRegionPolygon(context, draftPoints, false);
    }
}

function drawRegionPolygon(context, points, selected) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => context.lineTo(point.x, point.y));

    if (selected) {
        context.closePath();
        context.fillStyle = 'rgba(36, 112, 220, 0.28)';
        context.fill();
    }

    context.strokeStyle = '#1769d2';
    context.lineWidth = Math.max(2, regionCanvas.width / 400);
    context.setLineDash(selected ? [] : [8, 4]);
    context.stroke();
    context.setLineDash([]);
}

function clearRegionOutline() {
    regionPoints = [];
    draftPoints = [];
    isDrawingRegion = false;
    regionMessage.textContent = 'Outline cleared. Confirm to convert the whole image.';
    updateRegionSaveButton();
    drawRegionCanvas();
}

function updateRegionSaveButton() {
    saveRegionButton.textContent = regionPoints.length >= 3 ? 'Use This Area' : 'Use Whole Image';
}

function saveRegion() {
    if (!activeItem || !regionImage) return;

    activeItem.region = regionPoints.length >= 3
        ? regionPoints.map(({ x, y }) => ({
            x: Math.max(0, Math.min(1, x / regionCanvas.width)),
            y: Math.max(0, Math.min(1, y / regionCanvas.height))
        }))
        : null;
    if (activeItem.state === 'failed') {
        activeItem.state = 'queued';
        activeItem.error = '';
    }

    closeRegionEditor();
    renderQueue();
}

function closeRegionEditor() {
    regionLoadToken += 1;
    regionEditor.hidden = true;
    regionCanvas.hidden = false;
    saveRegionButton.disabled = false;
    activeItem = null;
    regionImage = null;
    regionPoints = [];
    draftPoints = [];
    isDrawingRegion = false;
}

async function processQueue() {
    if (isProcessing) return;

    isProcessing = true;
    notice = '';
    const mode = modeSelect.value;
    const selectedStrokeWidth = strokeWidth.value;
    renderQueue();

    try {
        let item;
        while ((item = queue.find((queuedItem) => queuedItem.state === 'queued'))) {
            item.state = 'processing';
            renderQueue();

            try {
                const formData = new FormData();
                formData.append('image', item.file);
                formData.append('mode', mode);
                formData.append('strokeWidth', selectedStrokeWidth);
                if (item.region) {
                    formData.append('region', JSON.stringify(item.region));
                }

                const response = await fetch('/api/convert', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Conversion failed');
                }

                const svgBlob = await response.blob();
                item.downloadUrl = URL.createObjectURL(svgBlob);
                item.state = 'complete';
            } catch (error) {
                item.state = 'failed';
                item.error = error.message || 'Conversion failed';
            }

            renderQueue();
        }

        const completed = queue.filter((queuedItem) => queuedItem.state === 'complete').length;
        const failed = queue.filter((queuedItem) => queuedItem.state === 'failed').length;
        notice = `Batch finished: ${completed} converted, ${failed} failed.`;
    } finally {
        isProcessing = false;
        renderQueue();
    }
}

function clearQueue() {
    if (isProcessing) return;

    queue.forEach((item) => {
        if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
    });
    queue.length = 0;
    notice = '';
    renderQueue();
}
