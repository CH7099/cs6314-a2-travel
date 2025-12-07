<?php
header('Content-Type: application/json');
include 'db.php';

// Get city from GET request
$city = isset($_GET['city']) ? $_GET['city'] : '';
$city = $conn->real_escape_string($city);

// Query hotels in this city
$sql = "SELECT hotel_id, name, city, price_per_night 
        FROM Hotel 
        WHERE city = '$city'";
$result = $conn->query($sql);

$hotels = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
}

// Return JSON
echo json_encode($hotels);
$conn->close();
?>