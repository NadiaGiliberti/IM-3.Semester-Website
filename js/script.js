

//// Daten von API verlinken
//const apiDaten = document.querySelector('#apiDaten');

////API URL's
//let urlPassanten = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/fussganger-stgaller-innenstadt-vadianstrasse/records?order_by=datum_tag%20DESC&limit=20'; // Verlinkung zu API Datenbank (Passanten)
//let urlParkplaetze = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20'; // Verlinkung zu API Datenbank (Parkhaus)

//// Initialisierung der beiden API-Daten

//async function initPassanten() {
//    let passanten = await fetchData(urlPassanten);
//    console.log(passanten.results[0].summe);
//    passanten.results.forEach(passant => {
//       createPassantenItem(passant);
//    });

//}


//async function initParkplaetze() {
//    let parkplaetze = await fetchData(urlParkplaetze);
//    console.log(parkplaetze.results[0].phname);
//    parkplaetze.results.forEach(parkplatz => {
//        createParkplaetzeItem(parkplatz);
//    });

//}

//// Aufruf der Initialisierungen
//initPassanten();
//initParkplaetze();

//// oben die Grundfunktionen
//// ab hier Werkzeugkasten von Funktionen:

//function createPassantenItem(passant) {
//    let item = document.createElement('div');
//    item.classList.add('passanten');
//    item.innerHTML = `
//        <h2>Passanten</h2>
//        <p>Anzahl Passanten: ${passant.summe}</p>
//        <p> Datum: ${new Date(passant.measured_at_new).toLocaleString('de-CH', {
//        year: 'numeric',
//        month: 'long',
//        day: 'numeric',
//        hour: '2-digit',
//        minute: '2-digit',
//        timeZone: 'Europe/Zurich'  // Schweizer Zeitzone
//    })}
//</p>
//        `;
//    apiDaten.appendChild(item);
//}


//function createParkplaetzeItem(parkplatz) {
//    let item = document.createElement('div');
//    item.classList.add('parkplaetze');
//    item.innerHTML = `
//    <h2>Parkplätze</h2>    
//    <p>${parkplatz.belegung_prozent}% belegt im ${parkplatz.phname}</p>
//        `;
//    apiDaten.appendChild(item);
//}


//// Daten aus einer API holen
//async function fetchData(url) {
//    try {
//        let response = await fetch(url);
//        let data = await response.json();
//        return data;
//    }
//    catch (error) {
//        console.log(error);
//    }
//}
