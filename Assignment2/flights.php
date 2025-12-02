<?php
header('Content-Type: application/json');
include "db.php";

// Handle GET request for searching flights
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get search parameters
    $origin = trim($_GET['origin'] ?? '');
    $destination = trim($_GET['destination'] ?? '');
    $departDate = trim($_GET['depart_date'] ?? '');
    $returnDate = trim($_GET['return_date'] ?? '');
    $tripType = trim($_GET['trip_type'] ?? 'oneway');
    $totalPassengers = intval($_GET['total_passengers'] ?? 0);

    // Validate required parameters
    if (empty($origin) || empty($destination) || empty($departDate) || $totalPassengers <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameters: origin, destination, depart_date, total_passengers']);
        exit;
    }

    // Normalize location function
    function normalizeLocation($location) {
        if (empty($location)) return "";
        $parts = array_map('trim', explode(",", $location));
        if (count($parts) !== 2) return strtolower($location);
        $city = strtolower(trim($parts[0]));
        $state = strtolower(trim($parts[1]));
        // Normalize state abbreviations
        if ($state === "texas") $state = "tx";
        if ($state === "california") $state = "ca";
        return $city . ", " . $state;
    }

    $normalizedOrigin = normalizeLocation($origin);
    $normalizedDestination = normalizeLocation($destination);

    // Search outbound flights
    // First, try exact date match
    $stmt = $conn->prepare("SELECT flight_id, origin, destination, departure_date, arrival_date, 
                            TIME_FORMAT(departure_time, '%H:%i') as depart_time,
                            TIME_FORMAT(arrival_time, '%H:%i') as arrive_time,
                            available_seats, price
                            FROM flights 
                            WHERE LOWER(origin) = ? AND LOWER(destination) = ? 
                            AND departure_date = ? AND available_seats >= ?
                            ORDER BY departure_time");
    $stmt->bind_param("sssi", $normalizedOrigin, $normalizedDestination, $departDate, $totalPassengers);
    $stmt->execute();
    $result = $stmt->get_result();
    $outboundFlights = [];
    while ($row = $result->fetch_assoc()) {
        $outboundFlights[] = [
            'flight_id' => $row['flight_id'],
            'origin' => $row['origin'],
            'destination' => $row['destination'],
            'depart_date' => $row['departure_date'],
            'arrive_date' => $row['arrival_date'],
            'depart_time' => $row['depart_time'],
            'arrive_time' => $row['arrive_time'],
            'available_seats' => intval($row['available_seats']),
            'price' => floatval($row['price'])
        ];
    }

    // If no exact match, search within ±3 days
    if (empty($outboundFlights)) {
        $departDateObj = new DateTime($departDate);
        $dateMin = $departDateObj->modify('-3 days')->format('Y-m-d');
        $dateMax = (new DateTime($departDate))->modify('+3 days')->format('Y-m-d');
        
        $stmt = $conn->prepare("SELECT flight_id, origin, destination, departure_date, arrival_date,
                                TIME_FORMAT(departure_time, '%H:%i') as depart_time,
                                TIME_FORMAT(arrival_time, '%H:%i') as arrive_time,
                                available_seats, price
                                FROM flights 
                                WHERE LOWER(origin) = ? AND LOWER(destination) = ? 
                                AND departure_date BETWEEN ? AND ? AND available_seats >= ?
                                ORDER BY ABS(DATEDIFF(departure_date, ?)), departure_time");
        $stmt->bind_param("sssssis", $normalizedOrigin, $normalizedDestination, $dateMin, $dateMax, $totalPassengers, $departDate);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $outboundFlights[] = [
                'flight_id' => $row['flight_id'],
                'origin' => $row['origin'],
                'destination' => $row['destination'],
                'depart_date' => $row['departure_date'],
                'arrive_date' => $row['arrival_date'],
                'depart_time' => $row['depart_time'],
                'arrive_time' => $row['arrive_time'],
                'available_seats' => intval($row['available_seats']),
                'price' => floatval($row['price'])
            ];
        }
    }

    $returnFlights = [];
    // Search return flights for roundtrip
    if ($tripType === "roundtrip" && !empty($returnDate)) {
        $normalizedReturnOrigin = $normalizedDestination;
        $normalizedReturnDestination = $normalizedOrigin;

        // First, try exact date match
        $stmt = $conn->prepare("SELECT flight_id, origin, destination, departure_date, arrival_date,
                                TIME_FORMAT(departure_time, '%H:%i') as depart_time,
                                TIME_FORMAT(arrival_time, '%H:%i') as arrive_time,
                                available_seats, price
                                FROM flights 
                                WHERE LOWER(origin) = ? AND LOWER(destination) = ? 
                                AND departure_date = ? AND available_seats >= ?
                                ORDER BY departure_time");
        $stmt->bind_param("sssi", $normalizedReturnOrigin, $normalizedReturnDestination, $returnDate, $totalPassengers);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $returnFlights[] = [
                'flight_id' => $row['flight_id'],
                'origin' => $row['origin'],
                'destination' => $row['destination'],
                'depart_date' => $row['departure_date'],
                'arrive_date' => $row['arrival_date'],
                'depart_time' => $row['depart_time'],
                'arrive_time' => $row['arrive_time'],
                'available_seats' => intval($row['available_seats']),
                'price' => floatval($row['price'])
            ];
        }

        // If no exact match, search within ±3 days
        if (empty($returnFlights)) {
            $returnDateObj = new DateTime($returnDate);
            $dateMin = $returnDateObj->modify('-3 days')->format('Y-m-d');
            $dateMax = (new DateTime($returnDate))->modify('+3 days')->format('Y-m-d');
            
            $stmt = $conn->prepare("SELECT flight_id, origin, destination, departure_date, arrival_date,
                                    TIME_FORMAT(departure_time, '%H:%i') as depart_time,
                                    TIME_FORMAT(arrival_time, '%H:%i') as arrive_time,
                                    available_seats, price
                                    FROM flights 
                                    WHERE LOWER(origin) = ? AND LOWER(destination) = ? 
                                    AND departure_date BETWEEN ? AND ? AND available_seats >= ?
                                    ORDER BY ABS(DATEDIFF(departure_date, ?)), departure_time");
            $stmt->bind_param("sssssis", $normalizedReturnOrigin, $normalizedReturnDestination, $dateMin, $dateMax, $totalPassengers, $returnDate);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $returnFlights[] = [
                    'flight_id' => $row['flight_id'],
                    'origin' => $row['origin'],
                    'destination' => $row['destination'],
                    'depart_date' => $row['departure_date'],
                    'arrive_date' => $row['arrival_date'],
                    'depart_time' => $row['depart_time'],
                    'arrive_time' => $row['arrive_time'],
                    'available_seats' => intval($row['available_seats']),
                    'price' => floatval($row['price'])
                ];
            }
        }
    }

    // Return JSON response
    echo json_encode([
        'outbound' => $outboundFlights,
        'return' => $returnFlights
    ]);

    $conn->close();
    exit;
}

// Handle POST request for booking flights
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