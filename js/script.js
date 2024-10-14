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
    })
    .catch(error => {
        // Gibt Fehlermeldungen in der Konsole aus, falls der Fetch-Request scheitert
        console.error('Fehler beim Abrufen der Passanten-Daten:', error);
    });
});

