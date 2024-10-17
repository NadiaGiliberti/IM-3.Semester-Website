document.addEventListener('DOMContentLoaded', function () {
    // URL der Website, von der die Parkplatzdaten abgefragt werden
    const apiUrl = 'https://cityflow.nadiagiliberti.ch/etl/unload_parkplaetze';
    const apiUrl2 = 'https://cityflow.nadiagiliberti.ch/etl/unload_passanten';

    // Führt einen Fetch-Request an die angegebene URL durch
    fetch(apiUrl)
        .then(response => response.json()) // Wandelt die Antwort in JSON um
        .then(data => {
            console.log('Parkplaetze St.Gallen', data);
            let totalParkplaetze = 0;
            data.forEach(parkplatz => {
                totalParkplaetze += parseInt(parkplatz.shortfree, 10);

                // Hier den richtigen Bild-Tag auswählen
                const parkhausId = `parkhaus_${parkplatz.id.toLowerCase()}`; // ID aus der Datenbank
                const freieParkplaetze = parkplatz.shortfree;
                const bildElement = document.getElementById(parkhausId);

                // Entscheide welches Bild angezeigt werden soll
                let statusBild;
                if (freieParkplaetze === 0) {
                    statusBild = 'images/stockwerke_0.png'; // Bild für besetzt
                } else if (freieParkplaetze >= 1 && freieParkplaetze <= 74) {
                    statusBild = 'images/stockwerke_1.png'; // Bild für 1 Etage frei
                } else if (freieParkplaetze >= 75 && freieParkplaetze <= 149) {
                    statusBild = 'images/stockwerke_2.png'; // Bild für 2 Etagen frei
                } else if (freieParkplaetze >= 150 && freieParkplaetze <= 224) {
                    statusBild = 'images/stockwerke_3.png'; // Bild für 3 Etagen frei
                } else if (freieParkplaetze >= 225 && freieParkplaetze <= 299) {
                    statusBild = 'images/stockwerke_4.png'; // Bild für 4 Etagen frei
                } else if (freieParkplaetze >= 300 && freieParkplaetze <= 371) {
                    statusBild = 'images/stockwerke_5.png'; // Bild für 5 Etagen frei
                } 

                // Setze das Bild
                if (bildElement) {
                    bildElement.src = statusBild;
                }
            });

            // Finde die beiden nötigen Element und setze die berechnete Summe
            document.querySelector('h1.total_freie_parkplaetze').textContent = totalParkplaetze;
            document.querySelector('span.total_freie_parkplaetze').textContent = totalParkplaetze;

        })
        .catch(error => {
            console.error('Fehler beim Abrufen Parkplätze:', error);
        });

    // Fetch für die zweite API
    fetch(apiUrl2)
        .then(response => response.json())
        .then(data2 => {
            console.log('Passanten St.Gallen', data2);
            const totalPassanten = data2[0].summe;


            // Finde die beiden nötigen Element und setze die berechnete Summe
            document.querySelector('h1.total_passanten').textContent = totalPassanten;
            document.querySelector('span.total_passanten').textContent = totalPassanten;

            // Bildwechsel je nach Passantenzahl
            const bildElement = document.querySelector('.bilder_passanten'); // Dein Bild-Element
            let passantenBild;

            if (totalPassanten >= 0 && totalPassanten <= 64) {
                passantenBild = 'images/passanten_1.png';
            } else if (totalPassanten >= 65 && totalPassanten <= 129) {
                passantenBild = 'images/passanten_2.png';
            } else if (totalPassanten >= 130 && totalPassanten <= 194) {
                passantenBild = 'images/passanten_3.png';
            } else if (totalPassanten >= 195 && totalPassanten <= 259) {
                passantenBild = 'images/passanten_4.png';
            } else if (totalPassanten >= 260) {
                passantenBild = 'images/passanten_5.png';
            }

            // Setze das entsprechende Bild
            if (bildElement) {
                bildElement.src = passantenBild;
            }

        })



        .catch(error => {
            console.error('Fehler beim Abrufen der Passanten-Daten:', error);
        });




        // Beispielwerte für durchschnittliche freie Parkplätze pro Passant
const durchschnittParkplaetzeProPassant = 20; // z.B. 20 Parkplätze pro Passant im Durchschnitt
const toleranz = 0.1; // 10% Toleranz für die Einstufung „gleich viele“

// Funktion zur Bestimmung, ob es mehr, weniger oder gleich viele Parkplätze gibt
function bestimmeParkplatzAuswertung(totalPassanten, totalParkplaetze) {
    const erwarteteParkplaetze = totalPassanten * durchschnittParkplaetzeProPassant;

    if (totalParkplaetze < erwarteteParkplaetze * (1 - toleranz)) {
        return "weniger";
    } else if (totalParkplaetze > erwarteteParkplaetze * (1 + toleranz)) {
        return "viele";
    } else {
        return "gleich viele";
    }
}

// Fetch für Parkplätze und Passanten zusammenfassen
fetch(apiUrl)
    .then(response => response.json())
    .then(parkplatzData => {
        let totalParkplaetze = 0;
        parkplatzData.forEach(parkplatz => {
            totalParkplaetze += parseInt(parkplatz.shortfree, 10);
        });

        fetch(apiUrl2)
            .then(response => response.json())
            .then(passantenData => {
                const totalPassanten = passantenData[0].summe;

                // Bestimme die Auswertung auf Basis der aktuellen Daten
                const parkplatzAuswertung = bestimmeParkplatzAuswertung(totalPassanten, totalParkplaetze);

                // Finde das Span-Element und setze den Auswertungstext
                const vergleichSpan = document.querySelector('span.vergleich');
                vergleichSpan.textContent = parkplatzAuswertung;
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Passanten-Daten:', error);
            });
    })
    .catch(error => {
        console.error('Fehler beim Abrufen Parkplätze:', error);
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