<?php
header('Content-Type: application/json');
// Read incoming JSON 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $flightId = $data['flight_id'] ?? '';
   
}
?>