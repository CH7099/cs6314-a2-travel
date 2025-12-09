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
        $stmt->bind_param("ssssis", $normalizedOrigin, $normalizedDestination, $dateMin, $dateMax, $totalPassengers, $departDate);
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
            $stmt->bind_param("ssssis", $normalizedReturnOrigin, $normalizedReturnDestination, $dateMin, $dateMax, $totalPassengers, $returnDate);
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

// Extract booking data
$userId = trim($data['user_id'] ?? '');
$userPhone = trim($data['user_phone'] ?? '');
$flight = $data['flight'] ?? null;
$returnFlight = $data['return_flight'] ?? null;
$passengers = $data['passengers'] ?? [];
$passengersDetails = $data['passengers_details'] ?? [];
$totalPrice = floatval($data['total_price'] ?? 0);

// Validate required fields
if (empty($userId) || !$flight || empty($passengersDetails)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: user_id, flight, and passengers_details']);
    exit;
}

// Get user phone from database if not provided
if (empty($userPhone)) {
    $phoneStmt = $conn->prepare("SELECT phone FROM users WHERE userid = ?");
    $phoneStmt->bind_param("i", $userId);
    $phoneStmt->execute();
    $phoneResult = $phoneStmt->get_result();
    if ($phoneResult->num_rows > 0) {
        $userRow = $phoneResult->fetch_assoc();
        $userPhone = $userRow['phone'];
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    $phoneStmt->close();
}

// Calculate total passengers
$totalPassengers = intval($passengers['adults'] ?? 0) + intval($passengers['children'] ?? 0) + intval($passengers['infants'] ?? 0);

// Validate flights and check seat availability
$outboundFlightId = $flight['flight_id'] ?? '';
$returnFlightId = $returnFlight['flight_id'] ?? null;

// Check outbound flight
$flightStmt = $conn->prepare("SELECT flight_id, available_seats, price FROM flights WHERE flight_id = ?");
$flightStmt->bind_param("s", $outboundFlightId);
$flightStmt->execute();
$flightResult = $flightStmt->get_result();

if ($flightResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Outbound flight not found']);
    exit;
}

$outboundFlightData = $flightResult->fetch_assoc();
$outboundSeatsAvailable = intval($outboundFlightData['available_seats']);

if ($outboundSeatsAvailable < $totalPassengers) {
    http_response_code(400);
    echo json_encode(['error' => 'Not enough seats available on outbound flight. Available: ' . $outboundSeatsAvailable . ', Requested: ' . $totalPassengers]);
    exit;
}

// Check return flight if exists
$returnFlightData = null;
if ($returnFlightId) {
    $returnStmt = $conn->prepare("SELECT flight_id, available_seats, price FROM flights WHERE flight_id = ?");
    $returnStmt->bind_param("s", $returnFlightId);
    $returnStmt->execute();
    $returnResult = $returnStmt->get_result();
    
    if ($returnResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Return flight not found']);
        exit;
    }
    
    $returnFlightData = $returnResult->fetch_assoc();
    $returnSeatsAvailable = intval($returnFlightData['available_seats']);
    
    if ($returnSeatsAvailable < $totalPassengers) {
        http_response_code(400);
        echo json_encode(['error' => 'Not enough seats available on return flight. Available: ' . $returnSeatsAvailable . ', Requested: ' . $totalPassengers]);
        exit;
    }
    $returnStmt->close();
}

$flightStmt->close();

// Start transaction
$conn->begin_transaction();

try {
    // Insert passengers into passenger table
    $passengerSSNs = [];
    foreach ($passengersDetails as $passenger) {
        $ssn = trim($passenger['ssn'] ?? '');
        $firstName = trim($passenger['first_name'] ?? '');
        $lastName = trim($passenger['last_name'] ?? '');
        $dob = trim($passenger['date_of_birth'] ?? '');
        $category = trim($passenger['category'] ?? 'adult');
        
        // Normalize category
        if ($category === 'adults') $category = 'adult';
        if ($category === 'children') $category = 'child';
        if ($category === 'infants') $category = 'infant';
        
        // Insert or update passenger (ON DUPLICATE KEY UPDATE)
        $passengerStmt = $conn->prepare("INSERT INTO passenger (SSN, first_name, last_name, date_of_birth, category) 
                                        VALUES (?, ?, ?, ?, ?)
                                        ON DUPLICATE KEY UPDATE 
                                        first_name = VALUES(first_name), 
                                        last_name = VALUES(last_name),
                                        date_of_birth = VALUES(date_of_birth),
                                        category = VALUES(category)");
        $passengerStmt->bind_param("sssss", $ssn, $firstName, $lastName, $dob, $category);
        
        if (!$passengerStmt->execute()) {
            throw new Exception("Failed to insert passenger: " . $passengerStmt->error);
        }
        
        $passengerSSNs[] = $ssn;
        $passengerStmt->close();
    }
    
    // Insert flight_booking for outbound flight
    $outboundPrice = floatval($flight['price'] ?? 0);
    $adults = intval($passengers['adults'] ?? 0);
    $children = intval($passengers['children'] ?? 0);
    $infants = intval($passengers['infants'] ?? 0);
    
    $outboundBookingPrice = $outboundPrice * $adults + $outboundPrice * $children * 0.7 + $outboundPrice * $infants * 0.1;
    
    $bookingStmt = $conn->prepare("INSERT INTO flight_booking (flight_id, user_phone, total_price) VALUES (?, ?, ?)");
    $bookingStmt->bind_param("ssd", $outboundFlightId, $userPhone, $outboundBookingPrice);
    
    if (!$bookingStmt->execute()) {
        throw new Exception("Failed to insert flight_booking: " . $bookingStmt->error);
    }
    
    $outboundBookingId = $conn->insert_id;
    $bookingStmt->close();
    
    // Insert tickets for outbound flight
    $ticketIndex = 0;
    foreach ($passengerSSNs as $ssn) {
        // Determine ticket price based on passenger category
        $passengerDetail = $passengersDetails[$ticketIndex];
        $category = $passengerDetail['category'] ?? 'adult';
        if ($category === 'adults') $category = 'adult';
        if ($category === 'children') $category = 'child';
        if ($category === 'infants') $category = 'infant';
        
        $ticketPrice = $outboundPrice;
        if ($category === 'child') $ticketPrice = $outboundPrice * 0.7;
        if ($category === 'infant') $ticketPrice = $outboundPrice * 0.1;
        
        $ticketStmt = $conn->prepare("INSERT INTO tickets (flight_booking_id, SSN, price) VALUES (?, ?, ?)");
        $ticketStmt->bind_param("isd", $outboundBookingId, $ssn, $ticketPrice);
        
        if (!$ticketStmt->execute()) {
            throw new Exception("Failed to insert ticket: " . $ticketStmt->error);
        }
        
        $ticketStmt->close();
        $ticketIndex++;
    }
    
    // Handle return flight if exists
    $returnBookingId = null;
    if ($returnFlightId && $returnFlightData) {
        $returnPrice = floatval($returnFlight['price'] ?? 0);
        $returnBookingPrice = $returnPrice * $adults + $returnPrice * $children * 0.7 + $returnPrice * $infants * 0.1;
        
        $returnBookingStmt = $conn->prepare("INSERT INTO flight_booking (flight_id, user_phone, total_price) VALUES (?, ?, ?)");
        $returnBookingStmt->bind_param("ssd", $returnFlightId, $userPhone, $returnBookingPrice);
        
        if (!$returnBookingStmt->execute()) {
            throw new Exception("Failed to insert return flight_booking: " . $returnBookingStmt->error);
        }
        
        $returnBookingId = $conn->insert_id;
        $returnBookingStmt->close();
        
        // Insert tickets for return flight
        $ticketIndex = 0;
        foreach ($passengerSSNs as $ssn) {
            $passengerDetail = $passengersDetails[$ticketIndex];
            $category = $passengerDetail['category'] ?? 'adult';
            if ($category === 'adults') $category = 'adult';
            if ($category === 'children') $category = 'child';
            if ($category === 'infants') $category = 'infant';
            
            $ticketPrice = $returnPrice;
            if ($category === 'child') $ticketPrice = $returnPrice * 0.7;
            if ($category === 'infant') $ticketPrice = $returnPrice * 0.1;
            
            $returnTicketStmt = $conn->prepare("INSERT INTO tickets (flight_booking_id, SSN, price) VALUES (?, ?, ?)");
            $returnTicketStmt->bind_param("isd", $returnBookingId, $ssn, $ticketPrice);
            
            if (!$returnTicketStmt->execute()) {
                throw new Exception("Failed to insert return ticket: " . $returnTicketStmt->error);
            }
            
            $returnTicketStmt->close();
            $ticketIndex++;
        }
    }
    
    // Update available seats for outbound flight
    $newOutboundSeats = $outboundSeatsAvailable - $totalPassengers;
    $updateOutboundStmt = $conn->prepare("UPDATE flights SET available_seats = ? WHERE flight_id = ?");
    $updateOutboundStmt->bind_param("is", $newOutboundSeats, $outboundFlightId);
    
    if (!$updateOutboundStmt->execute()) {
        throw new Exception("Failed to update outbound flight seats: " . $updateOutboundStmt->error);
    }
    $updateOutboundStmt->close();
    
    // Update available seats for return flight if exists
    if ($returnFlightId && $returnFlightData) {
        $newReturnSeats = intval($returnFlightData['available_seats']) - $totalPassengers;
        $updateReturnStmt = $conn->prepare("UPDATE flights SET available_seats = ? WHERE flight_id = ?");
        $updateReturnStmt->bind_param("is", $newReturnSeats, $returnFlightId);
        
        if (!$updateReturnStmt->execute()) {
            throw new Exception("Failed to update return flight seats: " . $updateReturnStmt->error);
        }
        $updateReturnStmt->close();
    }
    
    // Commit transaction
    $conn->commit();
    
    // Generate booking number
    $randomPart = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
    $bookingNumber = 'BKG-' . $randomPart;
    
    // Query booking details and tickets for outbound flight
    $outboundBookingDetails = [];
    $outboundTicketsQuery = $conn->prepare("
        SELECT 
            fb.flight_booking_id,
            fb.flight_id,
            fb.total_price,
            f.origin,
            f.destination,
            f.departure_date,
            f.arrival_date,
            TIME_FORMAT(f.departure_time, '%H:%i') as departure_time,
            TIME_FORMAT(f.arrival_time, '%H:%i') as arrival_time
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE fb.flight_booking_id = ?
    ");
    $outboundBookingDetails['booking_id'] = $outboundBookingId;
    $outboundTicketsQuery->bind_param("i", $outboundBookingId);
    $outboundTicketsQuery->execute();
    $outboundResult = $outboundTicketsQuery->get_result();
    if ($outboundRow = $outboundResult->fetch_assoc()) {
        $outboundBookingDetails['flight_id'] = $outboundRow['flight_id'];
        $outboundBookingDetails['origin'] = $outboundRow['origin'];
        $outboundBookingDetails['destination'] = $outboundRow['destination'];
        $outboundBookingDetails['departure_date'] = $outboundRow['departure_date'];
        $outboundBookingDetails['arrival_date'] = $outboundRow['arrival_date'];
        $outboundBookingDetails['departure_time'] = $outboundRow['departure_time'];
        $outboundBookingDetails['arrival_time'] = $outboundRow['arrival_time'];
        $outboundBookingDetails['total_price'] = floatval($outboundRow['total_price']);
    }
    $outboundTicketsQuery->close();
    
    // Query tickets for outbound flight
    $outboundTickets = [];
    $ticketsQuery = $conn->prepare("
        SELECT 
            t.ticket_id,
            t.flight_booking_id,
            t.SSN,
            t.price,
            p.first_name,
            p.last_name,
            p.date_of_birth
        FROM tickets t
        JOIN passenger p ON t.SSN = p.SSN
        WHERE t.flight_booking_id = ?
    ");
    $ticketsQuery->bind_param("i", $outboundBookingId);
    $ticketsQuery->execute();
    $ticketsResult = $ticketsQuery->get_result();
    while ($ticketRow = $ticketsResult->fetch_assoc()) {
        $outboundTickets[] = [
            'ticket_id' => $ticketRow['ticket_id'],
            'flight_booking_id' => $ticketRow['flight_booking_id'],
            'SSN' => $ticketRow['SSN'],
            'first_name' => $ticketRow['first_name'],
            'last_name' => $ticketRow['last_name'],
            'date_of_birth' => $ticketRow['date_of_birth'],
            'price' => floatval($ticketRow['price'])
        ];
    }
    $outboundBookingDetails['tickets'] = $outboundTickets;
    $ticketsQuery->close();
    
    // Query return flight booking details if exists
    $returnBookingDetails = null;
    if ($returnBookingId) {
        $returnBookingDetails = [];
        $returnBookingDetails['booking_id'] = $returnBookingId;
        $returnTicketsQuery = $conn->prepare("
            SELECT 
                fb.flight_booking_id,
                fb.flight_id,
                fb.total_price,
                f.origin,
                f.destination,
                f.departure_date,
                f.arrival_date,
                TIME_FORMAT(f.departure_time, '%H:%i') as departure_time,
                TIME_FORMAT(f.arrival_time, '%H:%i') as arrival_time
            FROM flight_booking fb
            JOIN flights f ON fb.flight_id = f.flight_id
            WHERE fb.flight_booking_id = ?
        ");
        $returnTicketsQuery->bind_param("i", $returnBookingId);
        $returnTicketsQuery->execute();
        $returnResult = $returnTicketsQuery->get_result();
        if ($returnRow = $returnResult->fetch_assoc()) {
            $returnBookingDetails['flight_id'] = $returnRow['flight_id'];
            $returnBookingDetails['origin'] = $returnRow['origin'];
            $returnBookingDetails['destination'] = $returnRow['destination'];
            $returnBookingDetails['departure_date'] = $returnRow['departure_date'];
            $returnBookingDetails['arrival_date'] = $returnRow['arrival_date'];
            $returnBookingDetails['departure_time'] = $returnRow['departure_time'];
            $returnBookingDetails['arrival_time'] = $returnRow['arrival_time'];
            $returnBookingDetails['total_price'] = floatval($returnRow['total_price']);
        }
        $returnTicketsQuery->close();
        
        // Query tickets for return flight
        $returnTickets = [];
        $returnTicketsQuery2 = $conn->prepare("
            SELECT 
                t.ticket_id,
                t.flight_booking_id,
                t.SSN,
                t.price,
                p.first_name,
                p.last_name,
                p.date_of_birth
            FROM tickets t
            JOIN passenger p ON t.SSN = p.SSN
            WHERE t.flight_booking_id = ?
        ");
        $returnTicketsQuery2->bind_param("i", $returnBookingId);
        $returnTicketsQuery2->execute();
        $returnTicketsResult = $returnTicketsQuery2->get_result();
        while ($returnTicketRow = $returnTicketsResult->fetch_assoc()) {
            $returnTickets[] = [
                'ticket_id' => $returnTicketRow['ticket_id'],
                'flight_booking_id' => $returnTicketRow['flight_booking_id'],
                'SSN' => $returnTicketRow['SSN'],
                'first_name' => $returnTicketRow['first_name'],
                'last_name' => $returnTicketRow['last_name'],
                'date_of_birth' => $returnTicketRow['date_of_birth'],
                'price' => floatval($returnTicketRow['price'])
            ];
        }
        $returnBookingDetails['tickets'] = $returnTickets;
        $returnTicketsQuery2->close();
    }
    
    // Return success response with detailed booking information
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Flight booked successfully',
        'booking_number' => $bookingNumber,
        'outbound_booking' => $outboundBookingDetails,
        'return_booking' => $returnBookingDetails,
        'total_price' => $totalPrice
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => 'Booking failed: ' . $e->getMessage()]);
}

$conn->close();
?>