<?php
// File: saveBooking.php

// Path to your XML file
$xmlFile = __DIR__ . '/data/carsBooked.xml';

// Get raw POST data
$xmlData = file_get_contents('php://input');

// Basic validation
if (empty($xmlData)) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "No XML data received"
    ]);
    exit;
}

// Ensure file exists, if not create a basic root structure
if (!file_exists($xmlFile)) {
    file_put_contents($xmlFile, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Bookings></Bookings>");
}

// Load XML
$doc = new DOMDocument();
$doc->preserveWhiteSpace = false;
$doc->formatOutput = true;
$doc->load($xmlFile);

// Load the new booking XML fragment
$newBooking = new DOMDocument();
$newBooking->loadXML($xmlData);
$imported = $doc->importNode($newBooking->documentElement, true);

// Append to root element
$doc->documentElement->appendChild($imported);

// Save file
if ($doc->save($xmlFile)) {
    echo json_encode([
        "success" => true, 
        "message" => "Booking added successfully"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to write to XML"
    ]);
}
?>
