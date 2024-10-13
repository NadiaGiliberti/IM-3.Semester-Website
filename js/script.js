document.addEventListener('DOMContentLoaded', function () {
    // URL der Website, von der die Parkplatzdaten abgefragt werden
    const apiUrl = 'https://cityflow.nadiagiliberti.ch/etl/unload_parkplaetze';

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
            console.error('Fehler beim Abrufen:', error);
        });
});

