<?php
header('Content-Type: application/json');
include 'db.php';

// Read JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON input"]);
    exit;
}

// Extract booking data
$hotel_id = trim($data['hotel_id'] ?? '');
$checkin = trim($data['checkin'] ?? '');
$checkout = trim($data['checkout'] ?? '');
$rooms = (int)($data['rooms'] ?? 0);
$price_per_night = (float)($data['price_per_night'] ?? 0);
$total_price = (float)($data['total_price'] ?? 0);
$guests = $data['guests'] ?? [];

if (empty($hotel_id) || empty($checkin) || empty($checkout) || $rooms <= 0) {
    echo json_encode(["success" => false, "error" => "Missing booking data"]);
    exit;
}

// Format dates
$checkin = date('Y-m-d', strtotime($checkin));
$checkout = date('Y-m-d', strtotime($checkout));

// Check if any guest SSN already exists
$ssns = array_map(fn($g) => trim($g['ssn']), $guests);
$ssn_placeholders = implode(',', array_fill(0, count($ssns), '?'));

if (!empty($ssns)) {
    $types = str_repeat('s', count($ssns));
    $check_stmt = $conn->prepare("SELECT SSN FROM Guests WHERE SSN IN ($ssn_placeholders)");
    $check_stmt->bind_param($types, ...$ssns);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    if ($result->num_rows > 0) {
        $existing_ssns = [];
        while ($row = $result->fetch_assoc()) {
            $existing_ssns[] = $row['SSN'];
        }
        echo json_encode([
            "success" => false,
            "error" => "The following SSNs already have bookings: " . implode(', ', $existing_ssns)
        ]);
        $check_stmt->close();
        $conn->close();
        exit;
    }
    $check_stmt->close();
}

// Generate booking ID
$hotel_booking_id = "BKG" . time();

// Insert booking
$stmt = $conn->prepare("INSERT INTO Hotel_Booking 
    (hotel_booking_id, hotel_id, check_in_date, check_out_date, number_of_rooms, price_per_night, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssidd", $hotel_booking_id, $hotel_id, $checkin, $checkout, $rooms, $price_per_night, $total_price);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => "Booking failed: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

// Insert guests
$guest_stmt = $conn->prepare("INSERT INTO Guests 
    (hotel_booking_id, first_name, last_name, date_of_birth, SSN, category) 
    VALUES (?, ?, ?, ?, ?, ?)");
$guest_stmt->bind_param("ssssss", $hotel_booking_id, $first_name, $last_name, $dob, $ssn, $category);

foreach ($guests as $guest) {
    $first_name = trim($guest['first_name']);
    $last_name = trim($guest['last_name']);
    $dob = date('Y-m-d', strtotime(trim($guest['dob'])));
    $ssn = trim($guest['ssn']);
    $category = trim($guest['category']);

    if (!$guest_stmt->execute()) {
        echo json_encode(["success" => false, "error" => "Guest insert failed: " . $guest_stmt->error]);
        $guest_stmt->close();
        $conn->close();
        exit;
    }
}

$guest_stmt->close();
$conn->close();

// Return success
echo json_encode(["success" => true, "booking_number" => $hotel_booking_id]);
exit;
?>