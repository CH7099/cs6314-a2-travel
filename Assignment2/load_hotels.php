<?php
include 'db.php';

// Clear the table first
$conn->query("TRUNCATE TABLE Hotel");

// Load the XML file
$xmlFile = 'data/hotels.xml';
if (!file_exists($xmlFile)) {
    die("XML file not found!");
}

$xml = simplexml_load_file($xmlFile);
$inserted = 0;

foreach ($xml->Hotel as $hotel) {
    $hotel_id = $conn->real_escape_string((string)$hotel->HotelID);
    $name = $conn->real_escape_string((string)$hotel->Name);
    $city = $conn->real_escape_string((string)$hotel->City);
    $price = (float)$hotel->PricePerNight;

    $sql = "INSERT INTO Hotel (hotel_id, name, city, price_per_night) 
            VALUES ('$hotel_id', '$name', '$city', $price)";
    if ($conn->query($sql) === TRUE) {
        $inserted++;
    }
}

$conn->close();
echo "Table cleared and hotels loaded successfully! Total hotels inserted: $inserted";
?>
