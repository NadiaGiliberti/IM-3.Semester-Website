<?php
// Include the database configuration file
require 'config.php';

try {
    // Create a new PDO instance using the settings in config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL query to fetch the required data
    $sql = "SELECT summe 
            FROM passanten 
            WHERE measured_at_new = (SELECT MAX(measured_at_new) FROM passanten) LIMIT 1";

    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);

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