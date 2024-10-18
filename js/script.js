document.addEventListener('DOMContentLoaded', function () {
    // URL der Website, von der die Parkplatzdaten abgefragt werden
    const apiUrl = 'https://cityflow.nadiagiliberti.ch/etl/unload_parkplaetze';
    const apiUrl2 = 'https://cityflow.nadiagiliberti.ch/etl/unload_passanten';

    fetchData();

    function getSelectedDateTime() {
        var date = document.getElementById('datePicker').value;
        var time = document.getElementById('time').innerText;

        if (date === '' || time === '') {

            //take current date and time
            let now = new Date();
            time = now.getHours() + ":" + now.getMinutes();
            date = now.toISOString().split('T')[0]; // Format date as YYYY-MM-DD


        }

        console.log('Selected Date:', date);

        // Kombiniere Datum und Uhrzeit in einem passenden Format für SQL
        const selectedDateTime = `${date} ${time}:00`; // YYYY-MM-DD HH:MM:SS
        return selectedDateTime;
    }

    function fetchData() {

        const dateTime = getSelectedDateTime(); // Hole die gewählte Zeit

        console.log(dateTime);

        const apiUrlParkplaetze = `https://cityflow.nadiagiliberti.ch/etl/unload_parkplaetze?datetime=${encodeURIComponent(dateTime)}`;
        const apiUrlPassanten = `https://cityflow.nadiagiliberti.ch/etl/unload_passanten?datetime=${encodeURIComponent(dateTime)}`;

        console.log(apiUrlParkplaetze)
        console.log(apiUrlPassanten)

        let totalParkplaetze = 0;
        let totalPassanten = 0;

        // Fetch für Parkplätze
        fetch(apiUrlParkplaetze)
            .then(response => response.json())
            .then(data => {
                console.log('Parkplaetze zur gewählten Zeit:', data);

                totalParkplaetze = data.reduce((sum, parkplatz) => sum + parseInt(parkplatz.shortfree, 10), 0);
                updateParkplatzBilder(data);

                // Check if passanten data has been fetched already
                if (totalPassanten > 0) {
                    updateAuswertung(totalPassanten, totalParkplaetze); // Hier wird die Auswertung hinzugefügt
                }
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Parkplatzdaten:', error);
            });

        // Fetch für Passanten
        fetch(apiUrlPassanten)
            .then(response => response.json())
            .then(data => {
                console.log('Passanten zur gewählten Zeit:', data);

                totalPassanten = data[0].summe;
                updatePassantenBild(data);

                // Check if parkplaetze data has been fetched already
                if (totalParkplaetze > 0) {
                    updateAuswertung(totalPassanten, totalParkplaetze); // Hier wird die Auswertung hinzugefügt
                }
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Passantendaten:', error);
            });
    }

    // Update-Funktion für Parkhäuser-Bilder
    function updateParkplatzBilder(data) {
        let totalParkplaetze = 0;
        data.forEach(parkplatz => {
            totalParkplaetze += parseInt(parkplatz.shortfree, 10);

            const parkhausId = `parkhaus_${parkplatz.id.toLowerCase()}`;
            const freieParkplaetze = parkplatz.shortfree;
            const bildElement = document.getElementById(parkhausId);

            let statusBild;
            if (freieParkplaetze === 0) {
                statusBild = 'images/stockwerke_0.png';
            } else if (freieParkplaetze >= 1 && freieParkplaetze <= 74) {
                statusBild = 'images/stockwerke_1.png';
            } else if (freieParkplaetze >= 75 && freieParkplaetze <= 149) {
                statusBild = 'images/stockwerke_2.png';
            } else if (freieParkplaetze >= 150 && freieParkplaetze <= 224) {
                statusBild = 'images/stockwerke_3.png';
            } else if (freieParkplaetze >= 225 && freieParkplaetze <= 299) {
                statusBild = 'images/stockwerke_4.png';
            } else if (freieParkplaetze >= 300 && freieParkplaetze <= 371) {
                statusBild = 'images/stockwerke_5.png';
            }

            if (bildElement) {
                bildElement.src = statusBild;
            }
        });

        document.querySelector('h1.total_freie_parkplaetze').textContent = totalParkplaetze;
        document.querySelector('span.total_freie_parkplaetze').textContent = totalParkplaetze;
    }

    // Update-Funktion für Passanten-Bild
    function updatePassantenBild(data) {
        const totalPassanten = data[0].summe;

        const bildElement = document.querySelector('.bilder_passanten');
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

        if (bildElement) {
            bildElement.src = passantenBild;
        }

        document.querySelector('h1.total_passanten').textContent = totalPassanten;
        document.querySelector('span.total_passanten').textContent = totalPassanten;
    }




    // Funktion zur Aktualisierung des Vergleichs
    function updateAuswertung(totalPassanten, totalParkplaetze) {
        const vergleichText = bestimmeParkplatzAuswertung(totalPassanten, totalParkplaetze);
        document.querySelector('span.vergleich').textContent = vergleichText;
    }

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
            return "normal viele";
        }
    }


    //SCROLLFUNKTION ZUR KARTE BEI KLICK AUF PFEIL

    const arrow = document.querySelector('.pfeil'); // Wähle das Pfeilbild aus
    arrow.addEventListener('click', function () {
        const karte = document.getElementById('karte_stgallen');

        const y = karte.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2 - karte.clientHeight / 2);

        window.scrollTo({ top: y, behavior: 'smooth' }); // Sanftes Scrollen
    });


    //FUNKTIONEN FÜR DEN SLIDER
    document.getElementById('slider-handle').addEventListener('mouseup', fetchData);
    document.getElementById('datePicker').addEventListener('change', fetchData);

    const slider = document.getElementById('slider');
    const sliderHandle = document.getElementById('slider-handle');
    const timeDisplay = document.getElementById('time');

    function updateTime() {
        const sliderWidth = slider.offsetWidth;
        const handleWidth = sliderHandle.offsetWidth;
        const handlePosition = parseFloat(sliderHandle.style.left) || (sliderWidth - handleWidth);
    
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
    
        // Berechne die verstrichenen Minuten basierend auf der Slider-Position
        const totalMinutesBack = Math.round((1 - (handlePosition / (sliderWidth - handleWidth))) * 1439); // 0-1439 Minuten (24 Stunden * 60 Minuten)
    
        // Berechne die neue Zeit in Minuten
        const adjustedDate = new Date(now.getTime() - totalMinutesBack * 60 * 1000); // Reduziere die Zeit um diese Minuten
    
        // Extrahiere die Stunden und Minuten für die Anzeige
        const adjustedHours = adjustedDate.getHours();
        const adjustedMinutesFormatted = adjustedDate.getMinutes();
    
        // Anzeigeformat HH:MM
        const timeString = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutesFormatted.toString().padStart(2, '0')}`;
        timeDisplay.innerText = timeString;
    
        // Hier prüfen, ob wir auf das aktuelle Datum (jetzt) stehen
        if (handlePosition >= (sliderWidth - handleWidth)) {
            // Slider ist ganz rechts; also nichts ändern, kein Datum zurücksetzen
            return;
        }
    
        // Wenn die neue Zeit weniger als 24 Stunden von jetzt ist
        if (totalMinutesBack < 1440) {
            // Überprüfen, ob die angepasste Zeit das aktuelle Datum übersteigt
            if (adjustedHours === currentHours && adjustedMinutesFormatted >= currentMinutes) {
                return; // Verhindern, dass das Datum geändert wird
            }
        }
    
        // Überprüfe, ob die Uhrzeit 23:59 oder weniger ist
        if (adjustedHours > currentHours || (adjustedHours === currentHours && adjustedMinutesFormatted >= currentMinutes)) {
            console.log("we're in the past day!");
    
            // Setze das Datum auf den Vortag
            const selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            selectedDate.setDate(selectedDate.getDate() - 1); // Datum um einen Tag zurücksetzen
    
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
            const year = selectedDate.getFullYear();
    
            const newDateString = `${year}-${month}-${day}`;
            document.getElementById('datePicker').value = newDateString; // Aktualisiere das Datum im Kalender
        } else {
            // Setze Datum auf den aktuellen Tag
            const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            document.getElementById('datePicker').value = currentDate; // Setze zurück auf das aktuelle Datum
        }
    }
    

     // Funktion zum Draggen des Sliders mit Maus und Touch
    function onMove(event) {
        const sliderRect = slider.getBoundingClientRect();
        let clientX;

        // Prüfen, ob es ein Touch-Event ist oder ein Maus-Event
        if (event.type === 'mousemove') {
            clientX = event.clientX;
        } else if (event.type === 'touchmove') {
            clientX = event.touches[0].clientX;
        }

        let newLeft = clientX - sliderRect.left - (sliderHandle.offsetWidth / 2);

        // Begrenzen der Position des Handles
        if (newLeft < 0) newLeft = 0;
        if (newLeft > sliderRect.width - sliderHandle.offsetWidth) newLeft = sliderRect.width - sliderHandle.offsetWidth;

        sliderHandle.style.left = newLeft + 'px';
        updateTime();
    }

    // Maus-Events für den Slider
    sliderHandle.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', onMove);
    });

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMove);
        fetchData(); // Aktualisiere die Daten, sobald die Maus losgelassen wird
    });

    // Touch-Events für den Slider
    sliderHandle.addEventListener('touchstart', () => {
        document.addEventListener('touchmove', onMove);
    });

    document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', onMove);
        fetchData(); // Aktualisiere die Daten, sobald der Finger losgelassen wird
    });

    // Initialisierung der Position und Uhrzeit
    function initializeSlider() {
        // Berechne die Breite des Sliders und des Handles
        const sliderWidth = slider.offsetWidth;
        const handleWidth = sliderHandle.offsetWidth;

        // Positioniere den Handle ganz rechts am Slider
        sliderHandle.style.left = (sliderWidth - handleWidth) + 'px';

        // Aktualisiere die Zeit-Anzeige mit der aktuellen Uhrzeit
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const timeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        timeDisplay.innerText = timeString;

        console.log("Slider Width:", sliderWidth);
        console.log("Handle Width:", handleWidth);
        console.log("Handle Position (should be right):", sliderHandle.style.left);
    }

    // Initialisiere den Slider bei Seitenlade-Event und bei Fenstergrößenänderung
    window.addEventListener('load', initializeSlider);
    window.addEventListener('resize', initializeSlider);


    // KALENDER AKTUELLES DATUM
    window.onload = function () {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
        const year = today.getFullYear();

        const currentDate = `${year}-${month}-${day}`;
        document.getElementById('datePicker').value = currentDate;
    };


    // FUNKTION ZUM ERSETZEN VON <br> DURCH LEERZEICHEN IM HTML

    function replaceBrWithSpace() {
        if (window.innerWidth <= 576) {
            // Alle <br>-Tags in der Text-Erklärung durch Leerzeichen ersetzen
            document.querySelectorAll('.text_erklaehrung br').forEach(function(br) {
                const space = document.createTextNode(" ");
                br.replaceWith(space);  // Ersetzt das <br> durch ein Leerzeichen
            });
        }
    }
    
    // Event Listener, um die Funktion beim Laden der Seite auszuführen
    window.addEventListener('load', replaceBrWithSpace);
    
    // Event Listener, um die Funktion bei einer Fenstergrößenänderung auszuführen
    window.addEventListener('resize', replaceBrWithSpace);


});

