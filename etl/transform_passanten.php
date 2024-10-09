<?php

// Angenommen, $data enthält die curl-Antwort
$data = include('extract_passanten.php');
$results = $data['results']; // Zugriff auf den Array der Parkplätze

$transformedData = [];

foreach ($results as $passant) {
    // Extrahiere die relevanten Werte
    $measured_at_new = $passant['measured_at_new'];
    $datum_tag = $passant['datum_tag'];
    $summe = $passant['summe'];

    // Formatiere es für den SQL INSERT Befehl
    $transformedData[] = "('$measured_at_new', '$datum_tag', '$summe')";
}

// Ausgabe der transformierten Daten für den SQL Insert Befehl
$values = implode(", ", $transformedData);

// SQL Insert Query vorbereiten
$sql = "INSERT INTO Passanten (measured_at_new, datum_tag, summe) VALUES $values;";

return $sql; // Ausgabe oder führe den Query in deiner Datenbank aus
?>