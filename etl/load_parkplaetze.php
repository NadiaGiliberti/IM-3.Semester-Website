<?php

// Lade SQL aus transform_parkplaetze.php
$sql = include('transform_parkplaetze.php');

// Lade die Datenbankkonfiguration
include('config.php');

try {
    // Erstelle eine neue PDO-Verbindung
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Bereite das SQL-Statement vor
    $stmt = $pdo->prepare($sql);

    // Führe das SQL-Statement aus
    $stmt->execute();

    echo "Daten wurden erfolgreich in die Datenbank eingefügt.";
} catch (PDOException $e) {
    echo "Fehler: " . $e->getMessage();
}
?>
