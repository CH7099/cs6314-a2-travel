<?php
header('Content-Type: application/json');

// Read incoming JSON -
$data = json_decode(file_get_contents("php://input"), true);
$booking = $data['Booking'] ?? [];

if (empty($booking)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing Booking object"]);
    exit;
}

// Validate required fields
$requiredFields = [
    'user-id',
    'booking-number',
    'hotel-id',
    'hotel-name',
    'city',
    'check-in',
    'check-out',
    'adults',
    'children',
    'infants',
    'rooms',
    'price-per-night',
    'total-price'
];

foreach ($requiredFields as $field) {
    if (!isset($booking[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

// Extract data
$userId = $booking['user-id'];
$bookingNumber = $booking['booking-number'];
$hotelId = $booking['hotel-id'];
$hotelName = $booking['hotel-name'];
$city = $booking['city'];
$checkIn = $booking['check-in'];
$checkOut = $booking['check-out'];
$adults = intval($booking['adults']);
$children = intval($booking['children']);
$infants = intval($booking['infants']);
$rooms = intval($booking['rooms']);
$pricePerNight = floatval($booking['price-per-night']);
$totalPrice = floatval($booking['total-price']);

// --- 4️⃣ Update hotels.xml availability ---
$xmlFile = "hotels.xml";

if (!file_exists($xmlFile)) {
    http_response_code(500);
    echo json_encode(["error" => "hotels.xml not found"]);
    exit;
}

$xml = simplexml_load_file($xmlFile);
$found = false;

foreach ($xml->Hotel as $hotel) {
    if ((string)$hotel->HotelID === $hotelId) {
        $availableRooms = intval($hotel->AvailableRooms);
        if ($availableRooms < $rooms) {
            http_response_code(400);
            echo json_encode(["error" => "Not enough rooms available"]);
            exit;
        }
        $hotel->AvailableRooms = $availableRooms - $rooms;
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(["error" => "Hotel ID not found"]);
    exit;
}

// Save updated hotels.xml
if (!$xml->asXML($xmlFile)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update hotels.xml"]);
    exit;
}

// --- 5️⃣ Save booking in hotel.json (overwrite with single object) ---
$bookingFile = "hotel.json";
$bookingToSave = [
    "Hotel" => $booking
];

if (file_put_contents($bookingFile, json_encode($bookingToSave, JSON_PRETTY_PRINT))) {
    echo json_encode([
        "success" => "Booking created successfully",
        "bookingNumber" => $bookingNumber
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write hotel.json"]);
}
?>