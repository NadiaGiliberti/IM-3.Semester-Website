<?php
include('config.php'); // Datenbankverbindung

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL-Abfrage
    $stmt = $pdo->query("SELECT phname, shortfree FROM Parkplaetze");
    $parkplaetze = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSON Ausgabe
    echo json_encode($parkplaetze);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
