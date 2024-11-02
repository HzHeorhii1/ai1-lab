document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    const map = initializeMap();
    let marker;
    document.getElementById("getLocation").addEventListener("click", () => getLocation(map, marker, updateMapCanvas));
    document.getElementById("saveButton").addEventListener("click", () => saveMapView(map));
}

const initializeMap = () => {
    const map = L.map('map').setView([50.45, 25.21], 18);
    L.tileLayer.provider('Esri.WorldImagery').addTo(map);
    return map;
};

const createCustomMarkerIcon = () => L.icon({
    iconUrl: 'https://data.chpic.su/stickers/d/duraktndrch/duraktndrch_023.webp',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getLocation = (map, marker, callback) => {
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => updateMapWithLocation(map, marker, position.coords, callback),
        error => console.error("Geolocation error:", error)
    );
};

const updateMapWithLocation = (map, marker, { latitude, longitude }, callback) => {
    const customMarkerIcon = createCustomMarkerIcon();

    map.setView([latitude, longitude]);
    if (marker) map.removeLayer(marker);
    
    marker = L.marker([latitude, longitude], { icon: customMarkerIcon })
        .addTo(map)
        .bindPopup("You are here!")
        .openPopup();

    callback(map);
};

const saveMapView = (map) => {
    updateMapCanvas(map);
    generatePuzzlePieces(document.getElementById('savedMapCanvas'));
    generateDropzones();
};

const updateMapCanvas = (map) => {
    leafletImage(map, (err, canvas) => {
        if (err) {
            console.error("Leaflet image error:", err);
            return;
        }
        const savedMapCanvas = document.getElementById('savedMapCanvas');
        const context = savedMapCanvas.getContext("2d");
        context.clearRect(0, 0, savedMapCanvas.width, savedMapCanvas.height);
        context.drawImage(canvas, 0, 0, savedMapCanvas.width, savedMapCanvas.height);
    });
};

const generatePuzzlePieces = (rasterMap) => {
    const pieceSize = 100;
    const pieces = createPuzzlePieces(rasterMap, pieceSize);

    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    shuffleArray(pieces).forEach(piece => puzzleContainer.appendChild(piece));
};

// Create puzzle pieces
const createPuzzlePieces = (rasterMap, pieceSize) => {
    return Array.from({ length: 4 }, (_, row) => 
        Array.from({ length: 4 }, (_, col) => createPuzzlePiece(rasterMap, row, col, pieceSize))
    ).flat();
};

const createPuzzlePiece = (rasterMap, row, col, pieceSize) => {
    const pieceCanvas = document.createElement('canvas');
    pieceCanvas.width = pieceSize;
    pieceCanvas.height = pieceSize;
    const context = pieceCanvas.getContext('2d');
    context.drawImage(rasterMap, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.appendChild(pieceCanvas);
    piece.setAttribute('draggable', true);
    piece.id = `piece-${row}-${col}`;
    piece.dataset.position = `${row}-${col}`;
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragend', handleDragEnd);
    return piece;
};

const generateDropzones = () => {
    const dropzoneContainer = document.getElementById('dropzoneContainer');
    dropzoneContainer.innerHTML = '';
    Array.from({ length: 16 }, () => createDropzone()).forEach(dropzone => dropzoneContainer.appendChild(dropzone));
};

const createDropzone = () => {
    const dropzone = document.createElement('div');
    dropzone.classList.add('dropzone');
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('drop', handleDrop);
    return dropzone;
};

const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
};

const handleDragEnd = (event) => {
    event.target.classList.remove('dragging');
};

const handleDragOver = (event) => event.preventDefault();

const handleDrop = (event) => {
    event.preventDefault();
    const draggedElement = document.querySelector('.dragging');

    if (event.target.classList.contains('dropzone') && !event.target.hasChildNodes()) {
        event.target.appendChild(draggedElement);
        if (isPuzzleSolved()) showNotification('Puzzle completed successfully!');
    }
};

const isPuzzleSolved = () => {
    const dropzones = document.querySelectorAll('.dropzone');
    return Array.from(dropzones).every((dropzone, index) => {
        const piece = dropzone.firstElementChild;
        return piece && piece.dataset.position === indexToPosition(index);
    });
};

const indexToPosition = (index) => `${Math.floor(index / 4)}-${index % 4}`;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const showNotification = (message) => {
    alert("Great job on the puzzle!");
    if (!("Notification" in window)) {
        alert("Your browser does not support notifications.");
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Map Puzzle Game", { body: message });
        }
    });
};
