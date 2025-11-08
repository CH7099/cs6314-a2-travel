<?php
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Read incoming JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check for JSON parsing errors
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

$action = $data['action'] ?? '';

if ($action !== "book") {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action. Expected "book"']);
    exit;
}

$userId = trim($data['user_id'] ?? '');
$flightId = trim($data['flight_id'] ?? '');
$seats = intval($data['seats'] ?? 0);

// Generate unique booking number: BKG-{8 alphanumeric characters}
// Uses random hash for uniqueness
$randomPart = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
$bookingNumber = 'BKG-' . $randomPart;

// Validate required fields
if (empty($userId) || empty($flightId) || $seats <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: user_id, flight_id, and seats']);
    exit;
}

// Read flights.json
$flightsFile = 'data/flights.json';
if (!file_exists($flightsFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Flights data file not found']);
    exit;
}

$flights = json_decode(file_get_contents($flightsFile), true);
if (!is_array($flights)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read flights.json']);
    exit;
}

// Find the flight and update the seats
$foundFlight = false;
$flightIndex = -1;

foreach ($flights as $index => &$flight) {
    if ($flight['flight_id'] === $flightId) {
        $foundFlight = true;
        $flightIndex = $index;
        $seatsAvailable = intval($flight['available_seats'] ?? 0);
        
        if ($seatsAvailable < $seats) {
            http_response_code(400);
            echo json_encode(['error' => 'Not enough seats available. Available: ' . $seatsAvailable . ', Requested: ' . $seats]);
            exit;
        }
        
        // Update the seats in the array
        $flight['available_seats'] = $seatsAvailable - $seats;
        break;
    }
}
unset($flight); 

if (!$foundFlight) {
    http_response_code(404);
    echo json_encode(['error' => 'Flight not found']);
    exit;
}

// Save the updated flights.json
if (file_put_contents($flightsFile, json_encode($flights, JSON_PRETTY_PRINT)) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update flights data']);
    exit;
}

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true, 
    'message' => 'Flight booked successfully',
    'flight_id' => $flightId,
    'seats_booked' => $seats,
    'remaining_seats' => $flights[$flightIndex]['available_seats'],
    'booking' => [
        'booking_number' => $bookingNumber,
        'user_id' => $userId,
        'flight_id' => $flightId,
        'seats_booked' => $seats
    ]
]);
?>