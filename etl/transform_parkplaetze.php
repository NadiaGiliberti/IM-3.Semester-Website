<?php

// Angenommen, $data enthält die curl-Antwort
$data = include('extract_parkplaetze.php');
$results = $data['results']; // Zugriff auf den Array der Parkplätze

$transformedData = [];

foreach ($results as $parkplatz) {
    // Extrahiere die relevanten Werte
    $phid = $parkplatz['phid'];
    $phname = $parkplatz['phname'];
    $phstate = $parkplatz['phstate'];
    $shortmax = $parkplatz['shortmax'];
    $shortfree = $parkplatz['shortfree'];
    $lon = $parkplatz['standort']['lon'];
    $lat = $parkplatz['standort']['lat'];
    $zeitpunkt = $parkplatz['zeitpunkt'];

    // Formatiere es für den SQL INSERT Befehl
    $transformedData[] = "('$phid', '$phname', '$phstate', $shortmax, $shortfree, $lon, $lat, '$zeitpunkt')";
}

// Ausgabe der transformierten Daten für den SQL Insert Befehl
$values = implode(", ", $transformedData);

// SQL Insert Query vorbereiten
$sql = "INSERT INTO Parkplaetze (phid, phname, phstate, shortmax, shortfree, lon, lat, zeitpunkt) VALUES $values;";

return $sql; // Ausgabe oder führe den Query in deiner Datenbank aus
?>