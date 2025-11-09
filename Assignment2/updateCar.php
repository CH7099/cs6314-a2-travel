<?php
// File: updateCar.php

// Path to your cars.xml file
$xmlFile = __DIR__ . '/data/cars.xml';

// Get raw POST data
$carID = file_get_contents('php://input');

if (empty($carID)) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "No CarID received"
    ]);
    exit;
}

// Load XML
if (!file_exists($xmlFile)) {
    http_response_code(404);
    echo json_encode([
        "success" => false, 
        "error" => "cars.xml not found"
    ]);
    exit;
}

$doc = new DOMDocument();
$doc->preserveWhiteSpace = false;
$doc->formatOutput = true;
$doc->load($xmlFile);

// Find the <Car> element with matching <CarID>
$cars = $doc->getElementsByTagName("Car");
$updated = false;

foreach ($cars as $car) {
    $idNode = $car->getElementsByTagName("CarID")->item(0);
    if ($idNode && $idNode->nodeValue == trim($carID)) {
        $availNode = $car->getElementsByTagName("Available")->item(0);
        if ($availNode) {
            $availNode->nodeValue = "No";
            $updated = true;
        }
        break;
    }
}

// Save if updated
if ($updated && $doc->save($xmlFile)) {
    echo json_encode([
        "success" => true, 
        "message" => "Car availability updated to No"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "CarID not found or failed to update"
    ]);
}
?>