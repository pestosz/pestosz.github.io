//część skryptu pochodzi z wykładów
//obsługa mapy
let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("PTW");
document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error capturing map:", err);
            return;
        }
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, 300, 300);
        console.log("Map saved to canvas");
    });
});
//na Macu w Safari wymaga zezwolenia na dostęp do lokalizacji na cały dzień, inaczej nie działa
document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }
    navigator.geolocation.getCurrentPosition(position => { //pobieranie lokalizacji
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        document.getElementById("latitude").innerText = lat; //wyświetlanie współrzędnych
        document.getElementById("longitude").innerText = lon;
        map.setView([lat, lon]); //ustawienie widoku mapy na położenie użytkownika
    }, positionError => {
        console.error(positionError);
    });
});

const playmat = document.getElementById("playmat"); //główny canvas
const storage = document.getElementById("storage"); //schowek na puzzle
const SIZE = 300; //rozmiar canvasa (300x300)
const GRID = 4; //wymiary puzzli (4x4)
const PIECE = SIZE / GRID; //rozmiar puzzla
const SNAP = 20; //obszar snappingu przy upuszczaniu blisko poprawnego miejsca

let pieces = []; //tablica puzzli
let solved = false; //czy spełniono warunek wygranej
let selected = null; //kliknięty puzzel
let offsetX = 0; //odległość kliknięcia od lewego górnego rogu puzzla, żeby podniesiony puzzel nie przeskakiwał do rogu w momencie podniesienia
let offsetY = 0;

function drawAll() {
    const pctx = playmat.getContext("2d"); //playmatContext
    const sctx = storage.getContext("2d"); //storageContext

    pctx.clearRect(0, 0, SIZE, SIZE); //czyszczenie canvasów
    sctx.clearRect(0, 0, SIZE, SIZE);
    pctx.fillStyle = "#e6f1fc"; //kolor wypełnienia
    sctx.fillStyle = "#e6f1fc";
    pctx.fillRect(0, 0, SIZE, SIZE); //wypełnianie canvasów
    sctx.fillRect(0, 0, SIZE, SIZE);

    for (const piece of pieces) { //rysowanie puzzli na podstawie zawartości tablicy pieces
        const ctx = piece.zone === "playmat" ? pctx : sctx;
        ctx.putImageData(piece.imageData, piece.x, piece.y); //rysowanie puzzla
        ctx.strokeStyle = "#000149FF";
        ctx.lineWidth = 1;
        ctx.strokeRect(piece.x, piece.y, PIECE, PIECE); //rysowanie obramówki puzzla
    }
}
function checkDone() { //sprawdza czy wszystkie puzzle są na swoich miejscach, jeśli tak, to wysyła powiadomienie
    if (solved) {
        return;
    }
    const done = pieces.every((piece) => piece.zone === "playmat" && piece.placed); //sprawdza warunek wygranej, czyli czy każdy puzzel jest na swoim miejscu na canvasie playmat
    if (done) {
        solved = true;
        const notification = new Notification("Gratulacje!", { body: "Udało Ci się ułozyć puzzle."});
    }
}
document.getElementById("startGame").addEventListener("click", () => {
    Notification.requestPermission().then((result) => {
        console.log(result);
    }); //zgoda pobierana w momencie tworzenia puzzli, wydaje się to być lepszy moment niż np. w momencie wygranej
    const rasterMap = document.getElementById("rasterMap"); //Pobrany fragment mapy
    const rctx = rasterMap.getContext("2d"); //rasterMapContext
    pieces = []; //czyszczenie tablicy z puzzlami, bo mogła być pełna po poprzedniej rozgrywce
    solved = false; //przełączenie flagi wygranej
    for (let row = 0; row < GRID; row += 1) { //wypełnienie tablicy z puzzlami
        for (let col = 0; col < GRID; col += 1) {
            pieces.push({
                row, //położenie w siatce
                col,
                imageData: rctx.getImageData(col * PIECE, row * PIECE, PIECE, PIECE), //obraz
                x: 0, //współrzędne
                y: 0,
                zone: "storage", //obecny canvas
                placed: false //czy jest na swoim miejscu
            });
        }
    }
    const slots = []; //miejsca do wygenerowania puzzli
    for (let row = 0; row < GRID; row += 1) {
        for (let col = 0; col < GRID; col += 1) {
            slots.push({ x: col * PIECE, y: row * PIECE });
        }
    }
    slots.sort(() => Math.random() - 0.5); //mieszanie puzzli
    pieces.forEach((piece, i) => { //przypisanie wylosowanych współrzędnych
        piece.x = slots[i].x;
        piece.y = slots[i].y;
    });
    drawAll();
});
function handleDown(zone, event) { //podniesienie puzzla
    const canvas = zone === "playmat" ? playmat : storage;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; //współrzędne kliknięcia w canvasie
    const y = event.clientY - rect.top;
    for (let i = pieces.length - 1; i >= 0; i -= 1) { //wyszukiwanie czy kliknięto na puzzel
        const piece = pieces[i];
        if (piece.zone !== zone) { //ignoruje puzzle z drugiego canvasa
            continue;
        }
        if (x >= piece.x && x < piece.x + PIECE && y >= piece.y && y < piece.y + PIECE) { //trafienie w puzzel
            selected = piece;
            selected.placed = false;
            offsetX = x - piece.x; //offset ustawiany według współrzędnych kliknięcia
            offsetY = y - piece.y;
            pieces.splice(i, 1);
            pieces.push(piece); //przeniesienie puzzla na koniec listy, więc będzie rysowany na wierzchu
            playmat.style.cursor = "grabbing";
            storage.style.cursor = "grabbing";
            return;
        }
    }
}
playmat.addEventListener("mousedown", (event) => handleDown("playmat", event));
storage.addEventListener("mousedown", (event) => handleDown("storage", event));
document.addEventListener("mousemove", (event) => { //przemieszczanie puzzla, ograniczenie do obszaru canvasów
    if (!selected) {
        return;
    }
    const playRect = playmat.getBoundingClientRect(); //położenie i rozmiar canvasa
    const storageRect = storage.getBoundingClientRect();
    let zone = selected.zone; //obecny canvas
    let rect = zone === "playmat" ? playRect : storageRect;
    if (event.clientX >= playRect.left && event.clientX <= playRect.right && event.clientY >= playRect.top && event.clientY <= playRect.bottom) {
        zone = "playmat"; //sprawdza aktywny canvas
        rect = playRect;
    } else if (event.clientX >= storageRect.left && event.clientX <= storageRect.right && event.clientY >= storageRect.top && event.clientY <= storageRect.bottom) {
        zone = "storage";
        rect = storageRect;
    }
    selected.zone = zone;
    selected.x = Math.max(0, Math.min(event.clientX - rect.left - offsetX, SIZE - PIECE)); //zatrzymuje puzzle w obrębie canvasów
    selected.y = Math.max(0, Math.min(event.clientY - rect.top - offsetY, SIZE - PIECE));
    drawAll();
});
document.addEventListener("mouseup", () => { //upuszczenie puzzla
    if (!selected) {
        return;
    }
    if (selected.zone === "playmat") { //jeśli puzzel został odłożony na głównej planszy, to sprawdza czy to poprawne miejsce
        const correctX = selected.col * PIECE; //poprawny obszar dla puzzla
        const correctY = selected.row * PIECE;
        if (Math.abs(selected.x - correctX) < SNAP && Math.abs(selected.y - correctY) < SNAP) {
            selected.x = correctX;
            selected.y = correctY;
            selected.placed = true; //jeśli puzzel jest w zasięgu zmiennej SNAP od poprawnego miejsca, to zostaje w nim odłożony i oznaczony jako poprawnie ułożony
        } else {
            selected.placed = false; //gdyby puzzel został przełożony z miejsca poprawnego na niepoprawne, to flaga nie może pozostać ustawiona na true
        }
    } else {
        selected.placed = false; //jeśli puzzel został odłożony w schowku, to wiadomo, że nie jest na swoim miejscu
    }
    selected = null;
    playmat.style.cursor = "grab";
    storage.style.cursor = "grab";
    drawAll();
    checkDone(); //sprawdza, czy ta operacja drag & drop skończyła się wygraną
});
drawAll();

