// Daten von API verlinken
const stgallen = document.querySelector('#stgallen');

//API URL's
let urlPassanten = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/fussganger-stgaller-innenstadt-vadianstrasse/records?order_by=datum_tag%20DESC&limit=20'; // Verlinkung zu API Datenbank (Passanten)
let urlParkplatze = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20'; // Verlinkung zu API Datenbank (Parkhaus)

// Initialisierung der beiden API-Daten

async function initPassanten() {
    //let url = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/fussganger-stgaller-innenstadt-vadianstrasse/records?order_by=datum_tag%20DESC&limit=20';
    let passanten = await fetchData(urlPassanten);
    console.log(passanten.results[0].summe);
    passanten.results.forEach(passant => {
        createPassantenItem(passant);
    });

}


async function initParkplatze() {
    //let url2 = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/freie-parkplatze-in-der-stadt-stgallen-pls/records?limit=20';
    let parkplatze = await fetchData(urlParkplatze);
    console.log(parkplatze.results[0].phname);
    parkplatze.results.forEach(parkplatz => {
        createParkplatzeItem(parkplatz);
    });

}

// Aufruf der Initialisierungen
initPassanten();
initParkplatze();

// oben die Grundfunktionen
// ab hier Werkzeugkasten von Funktionen:

function createPassantenItem(passant) {
    let item = document.createElement('div');
    item.classList.add('passanten');
    item.innerHTML = `
        <h2>Passanten</h2>
        <p>Anzahl Passanten: ${passant.summe}</p>
        <p> Datum: ${new Date(passant.measured_at_new).toLocaleString('de-CH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Zurich'  // Schweizer Zeitzone
    })}
</p>
        `;
    stgallen.appendChild(item);
}


function createParkplatzeItem(parkplatz) {
    let item = document.createElement('div');
    item.classList.add('parkplatze');
    item.innerHTML = `
    <h2>Parkplätze</h2>    
    <p>${parkplatz.belegung_prozent}% belegt im ${parkplatz.phname}</p>
        `;
    stgallen.appendChild(item);
}


// Daten aus einer API holen
async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}
