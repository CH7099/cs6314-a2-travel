<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

//Read incoming JSON 
$data = json_decode(file_get_contents("php://input"), true);
$booking = $data['Booking'] ?? [];

//Check if empty; return error
if (empty($booking)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing Booking object"]);
    exit;
}

//Establish required fields
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

//Validate required fields
foreach ($requiredFields as $field) {
    if (!isset($booking[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

//Extract data
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


// --------------------------------------------- AVAILABILITY UPDATE ------------------------------------------------------------
// Update hotels.xml (availability)
$xmlFile = __DIR__ . "/data/hotels.xml";

//Check for file; return error if missing
if (!file_exists($xmlFile)) {
    http_response_code(500);
    echo json_encode(["error" => "hotels.xml not found"]);
    exit;
}

//Load file
$xml = simplexml_load_file($xmlFile);
$found = false;

//Update availability (return error if not enough rooms)
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

//If HotelID is missing, return error
if (!$found) {
    http_response_code(404);
    echo json_encode(["error" => "Hotel ID not found"]);
    exit;
}

//Save updated hotels.xml
if (!$xml->asXML($xmlFile)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update hotels.xml"]);
    exit;
}

//Save booking information to hotel.json
$bookingFile =  __DIR__ . "/data/hotel.json";
$bookingToSave = [
    "Hotel" => $booking
];

//Put contents in file; echo success or error
if (file_put_contents($bookingFile, json_encode($bookingToSave, JSON_PRETTY_PRINT))) {
    echo json_encode([
        "success" => "Booking created successfully",
        "bookingNumber" => $bookingNumber
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write hotel.json"]);
}

//--------------------------------------------- DATABASE CONNECTION ------------------------------------------------------------
// Database connection parameters
$servername = "localhost";
$username = "travel_user";     
$password = "Travel123!";         
$database = "traqvel_db"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert data
$sql = $conn->prepare("INSERT INTO Hotels (user_id, booking_number, hotel_id, hotel_name, city, check_in, check_out, adults, children, infants, rooms, price_per_night, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$sql->bind_param("issssssiiiidd", $userId, $bookingNumber, $hotelId, $hotelName, $city, $checkIn, $checkOut, $adults, $children, $infants, $rooms, $pricePerNight, $totalPrice);
if ($conn->query($sql) === TRUE) {
    // Success
    echo json_encode(["success" => "Database insertion successful"]);
} else {
    // Error
    http_response_code(500);
    echo json_encode(["error" => "Database insertion failed: " . $conn->error]);
}
$conn->close();
?>