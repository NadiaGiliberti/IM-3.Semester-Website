<?php
// Include the database configuration file
require 'config.php';
header('Access-Control-Allow-Origin: *');

try {
    // Create a new PDO instance using the settings in config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    $dateTime = $_GET['datetime']; // Datum und Uhrzeit aus der Anfrage

    $sql = "SELECT pp.shortfree, ph.*
            FROM parkplaetze pp, parkhaeuser ph
            WHERE pp.phid = ph.id 
            AND ph.status = 1
            AND pp.timestamp <= :datetime1
            AND pp.timestamp = (SELECT MAX(timestamp) FROM parkplaetze WHERE timestamp <= :datetime2)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':datetime1', $dateTime);
    $stmt->bindParam(':datetime2', $dateTime);

    // Execute the statement
    $stmt->execute();

    // Fetch all results
    $results = $stmt->fetchAll();

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Encode the results to JSON and output them
    echo json_encode($results);

} catch (PDOException $e) {
    // Handle any errors that occur during the connection or query
    echo json_encode([
        'error' => 'Database query error',
        'message' => $e->getMessage()
    ]);
}
