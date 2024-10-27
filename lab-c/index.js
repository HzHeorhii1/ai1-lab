document.addEventListener('DOMContentLoaded', () => {
    let map = L.map('map').setView([50.45, 25.21], 18);
    let marker;

    L.tileLayer.provider('Esri.WorldImagery').addTo(map);

    let customMarkerIcon = L.icon({
        iconUrl: 'https://data.chpic.su/stickers/d/duraktndrch/duraktndrch_023.webp',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    document.getElementById("getLocation").addEventListener("click", function () {
        if (!navigator.geolocation) {
            console.log("No geolocation.");
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            map.setView([lat, lon]);
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();
        }, positionError => {
            console.error(positionError);
        });
    });

    document.getElementById("saveButton").addEventListener("click", function () {
        leafletImage(map, function (err, canvas) {
            if (err) {
                console.error(err);
                return;
            }

            // Отримуємо елемент canvas для збереженої карти
            let savedMapCanvas = document.getElementById('savedMapCanvas');
            let rasterContext = savedMapCanvas.getContext("2d");

            // Очищаємо попередній вміст та копіюємо карту в savedMapCanvas
            rasterContext.clearRect(0, 0, savedMapCanvas.width, savedMapCanvas.height);
            rasterContext.drawImage(canvas, 0, 0, savedMapCanvas.width, savedMapCanvas.height);

            // Створюємо пазли з savedMapCanvas
            generatePuzzlePieces(savedMapCanvas);
            generateDropzones();
        });
    });

    function generatePuzzlePieces(rasterMap) {
        const puzzleContainer = document.getElementById('puzzleContainer');
        puzzleContainer.innerHTML = '';

        const pieceSize = 100;
        let pieces = [];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceSize;
                pieceCanvas.height = pieceSize;
                let context = pieceCanvas.getContext('2d');
                context.drawImage(rasterMap, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

                let piece = document.createElement('div');
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

        pieces = shuffleArray(pieces);
        pieces.forEach(piece => puzzleContainer.appendChild(piece));
    }

    function generateDropzones() {
        const dropzoneContainer = document.getElementById('dropzoneContainer');
        dropzoneContainer.innerHTML = '';

        for (let i = 0; i < 16; i++) {
            let dropzone = document.createElement('div');
            dropzone.classList.add('dropzone');
            dropzone.addEventListener('dragover', handleDragOver);
            dropzone.addEventListener('drop', handleDrop);

            dropzoneContainer.appendChild(dropzone);
        }
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedElement = document.querySelector('.dragging');

        if (event.target.classList.contains('dropzone') && event.target.children.length === 0) {
            event.target.appendChild(draggedElement);

            if (isPuzzleSolved()) {
                showNotification('Puzzle completed successfully!');
            }
        }
    }

    function isPuzzleSolved() {
        const dropzones = document.querySelectorAll('.dropzone');
        return Array.from(dropzones).every((dropzone, index) => {
            const piece = dropzone.firstElementChild;
            return piece && piece.dataset.position === indexToPosition(index);
        });
    }

    function indexToPosition(index) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        return `${row}-${col}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function showNotification(message) {
        alert("you did everything good:)")
        if (!("Notification" in window)) {
            alert("Your browser does not support notifications.");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("play with map", { body: message });
            }
        });
    }
});
