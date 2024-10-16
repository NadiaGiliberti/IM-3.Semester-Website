document.addEventListener('DOMContentLoaded', function () {
    // URL der Website, von der die Parkplatzdaten abgefragt werden
    const apiUrl = 'https://cityflow.nadiagiliberti.ch/etl/unload_parkplaetze';
    const apiUrl2 = 'https://cityflow.nadiagiliberti.ch/etl/unload_passanten';

    // Führt einen Fetch-Request an die angegebene URL durch
    fetch(apiUrl)
        .then(response => response.json()) // Wandelt die Antwort in JSON um
        .then(data => {
            // Gibt die Wetterdaten für Bern in der Konsole aus
            console.log('Parkplaetze St.Gallen', data);
            let totalParkplaetze = 0;
            data.forEach(parkplatz => {
                totalParkplaetze += parseInt(parkplatz.shortfree, 10);
            });

            // Finde das H2-Element und setze die berechnete Summe
            document.querySelector('h1.total_freie_parkplaetze').textContent = totalParkplaetze;
            document.querySelector('span.total_freie_parkplaetze').textContent = totalParkplaetze;

        })
        .catch(error => {
            // Gibt Fehlermeldungen in der Konsole aus, falls der Fetch-Request scheitert
            console.error('Fehler beim Abrufen Parkplätze:', error);
        });

    // Fetch für die zweite API
    fetch(apiUrl2)
        .then(response => response.json())
        .then(data2 => {
            // Gibt die Passanten-Daten für St.Gallen in der Konsole aus
            console.log('Passanten St.Gallen', data2);

            // Greife auf das erste Element im Array zu und hole den Wert der 'summe'
            const totalPassanten = data2[0].summe;

            // Finde das H1-Element und setze die berechnete Summe der Passanten
            document.querySelector('h1.total_passanten').textContent = totalPassanten;
            document.querySelector('span.total_passanten').textContent = totalPassanten;
       
        })
        .catch(error => {
            // Gibt Fehlermeldungen in der Konsole aus, falls der Fetch-Request scheitert
            console.error('Fehler beim Abrufen der Passanten-Daten:', error);
        });


//SCROLLFUNKTION ZUR KARTE BEI KLICK AUF PFEIL

    const arrow = document.querySelector('.pfeil'); // Wähle das Pfeilbild aus
    arrow.addEventListener('click', function () {
        const karte = document.getElementById('karte_stgallen');
        
        const y = karte.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2 - karte.clientHeight / 2);

        window.scrollTo({ top: y, behavior: 'smooth' }); // Sanftes Scrollen
    });


//SLIDER FÜR DIE UHRZEIT
const slider = document.getElementById('slider');
const sliderHandle = document.getElementById('slider-handle');
const timeDisplay = document.getElementById('time');

// Funktion zur Aktualisierung der Uhrzeit basierend auf der Position des Sliders
function updateTime() {
    const sliderWidth = slider.offsetWidth;
    const handleWidth = sliderHandle.offsetWidth;
    const handlePosition = parseFloat(sliderHandle.style.left) || (sliderWidth - handleWidth);

    // Berechne die Stunden und Minuten basierend auf der Position des Handles
    const totalMinutes = Math.round((handlePosition / (sliderWidth - handleWidth)) * 1439); // 0-1439 Minuten (24 Stunden * 60 Minuten)
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    timeDisplay.innerText = timeString;
}


// Funktion zum Draggen des Sliders
function onMouseMove(event) {
    const sliderRect = slider.getBoundingClientRect();
    let newLeft = event.clientX - sliderRect.left - (sliderHandle.offsetWidth / 2);

    // Begrenzen der Position des Handles
    if (newLeft < 0) newLeft = 0;
    if (newLeft > sliderRect.width - sliderHandle.offsetWidth) newLeft = sliderRect.width - sliderHandle.offsetWidth;

    sliderHandle.style.left = newLeft + 'px';
    updateTime();
}

// Maus-Events für den Slider
sliderHandle.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', onMouseMove);
});

document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
});

// Initialisierung der Position und Uhrzeit
function initializeSlider() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Berechne die Position des Sliders für die aktuelle Uhrzeit
    const sliderWidth = slider.offsetWidth;
    const handleWidth = sliderHandle.offsetWidth;
    
    // Berechnung der aktuellen Position des Handles unter Berücksichtigung von Minuten
    const totalMinutes = currentHours * 60 + currentMinutes;
    const currentHandlePosition = (totalMinutes / 1440) * (sliderWidth - handleWidth); // 1440 Minuten in einem Tag
    sliderHandle.style.left = currentHandlePosition + 'px';
    
    // Aktualisiere die Zeit-Anzeige
    updateTime();
}

// Rufe die Initialisierungsfunktion auf
initializeSlider();

// KALENDER AKTUELLES DATUM
window.onload = function () {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = today.getFullYear();

    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('datePicker').value = currentDate;
};

});