document.addEventListener('DOMContentLoaded', () => {
    let map = L.map('map').setView([50.45, 25.21], 18);
    let marker;

    L.tileLayer.provider('Esri.WorldImagery').addTo(map);

    const customMarkerIcon = L.icon({
        iconUrl: 'https://data.chpic.su/stickers/d/duraktndrch/duraktndrch_023.webp',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    document.getElementById("getLocation").addEventListener("click", () => {
        if (!navigator.geolocation) {
            console.log("No geolocation.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lon } = position.coords;
                map.setView([lat, lon]);

                if (marker) {
                    map.removeLayer(marker);
                }
                marker = L.marker([lat, lon], { icon: customMarkerIcon }).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
            },
            (error) => console.error(error)
        );
    });

    document.getElementById("saveButton").addEventListener("click", () => {
        leafletImage(map, (err, canvas) => {
            if (err) {
                console.error(err);
                return;
            }
            const savedMapCanvas = document.getElementById('savedMapCanvas');
            const rasterContext = savedMapCanvas.getContext("2d");
            rasterContext.clearRect(0, 0, savedMapCanvas.width, savedMapCanvas.height);
            rasterContext.drawImage(canvas, 0, 0, savedMapCanvas.width, savedMapCanvas.height);
            generatePuzzlePieces(savedMapCanvas);
            generateDropzones();
        });
    });

    const generatePuzzlePieces = (rasterMap) => {
        const puzzleContainer = document.getElementById('puzzleContainer');
        puzzleContainer.innerHTML = '';

        const pieceSize = 100;
        let pieces = [];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
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
                pieces.push(piece);
            }
        }
        shuffleArray(pieces).forEach(piece => puzzleContainer.appendChild(piece));
    };

    const generateDropzones = () => {
        const dropzoneContainer = document.getElementById('dropzoneContainer');
        dropzoneContainer.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const dropzone = document.createElement('div');
            dropzone.classList.add('dropzone');
            dropzone.addEventListener('dragover', handleDragOver);
            dropzone.addEventListener('drop', handleDrop);
            dropzoneContainer.appendChild(dropzone);
        }
    };

    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    };

    const handleDragEnd = (event) => {event.target.classList.remove('dragging');};

    const handleDragOver = (event) => { event.preventDefault();};

    const handleDrop = (event) => {
        event.preventDefault();
        const draggedElement = document.querySelector('.dragging');

        if (event.target.classList.contains('dropzone') && event.target.children.length === 0) {
            event.target.appendChild(draggedElement);
            if (isPuzzleSolved()) { showNotification('Puzzle completed successfully!');}
        }
    };

    const isPuzzleSolved = () => {
        const dropzones = document.querySelectorAll('.dropzone');
        return Array.from(dropzones).every((dropzone, index) => {
            const piece = dropzone.firstElementChild;
            return piece && piece.dataset.position === indexToPosition(index);
        });
    };

    const indexToPosition = (index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        return `${row}-${col}`;
    };

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
            if (permission === "granted") { new Notification("Map Puzzle Game", { body: message }); }
        });
    };
});
