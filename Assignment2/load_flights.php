<?php
include 'db.php';

// Note: Using INSERT IGNORE to preserve existing bookings
// No deletion of tickets, flight_booking, or flights tables
// Only new flights will be added; existing flights remain unchanged

// Load the JSON file
$jsonFile = 'data/flights.json';
if (!file_exists($jsonFile)) {
    die("JSON file not found!");
}

$jsonData = file_get_contents($jsonFile);
$flights = json_decode($jsonData, true);
$inserted = 0;

foreach ($flights as $flight) {
    $flight_id = $conn->real_escape_string($flight['flight_id']);
    $origin = $conn->real_escape_string($flight['origin']);
    $destination = $conn->real_escape_string($flight['destination']);
    $depart_date = $conn->real_escape_string($flight['depart_date']);
    $arrive_date = $conn->real_escape_string($flight['arrive_date']);
    $depart_time = $conn->real_escape_string($flight['depart_time']);
    $arrive_time = $conn->real_escape_string($flight['arrive_time']);
    $available_seats = (int)$flight['available_seats'];
    $price = (float)$flight['price'];

    $sql = "INSERT IGNORE INTO flights (flight_id, origin, destination, departure_date, arrival_date, departure_time, arrival_time, available_seats, price) 
            VALUES ('$flight_id', '$origin', '$destination', '$depart_date', '$arrive_date', '$depart_time', '$arrive_time', $available_seats, $price)";
    if ($conn->query($sql) === TRUE) {
        $inserted++;
    }
}

$conn->close();
echo "Flights loaded successfully! Total flights inserted: $inserted (existing flights preserved, bookings unaffected)";
?>