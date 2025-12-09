<?php
header("Content-Type: application/json");
include 'db.php';

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input["hotel_booking_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "hotel_booking_id missing"
    ]);
    exit;
}

$bookingID = $input["hotel_booking_id"];

// DB connection
$conn = new mysqli("localhost", "travel_user", "Travel123!", "travel_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Query hotel + booking info
$sql = "
    SELECT 
        hb.hotel_booking_id,
        hb.hotel_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.price_per_night,
        hb.total_price,
        h.name AS hotel_name,
        h.city AS city
    FROM Hotel_Booking hb
    JOIN Hotel h ON hb.hotel_id = h.hotel_id
    WHERE hb.hotel_booking_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $bookingID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Booking not found"]);
    exit;
}

$hotel = $result->fetch_assoc();

// Get guests
$sqlGuests = "
    SELECT SSN, first_name, last_name, date_of_birth, category
    FROM Guests
    WHERE hotel_booking_id = ?
";

$stmt2 = $conn->prepare($sqlGuests);
$stmt2->bind_param("s", $bookingID);
$stmt2->execute();
$resultGuests = $stmt2->get_result();

$guests = [];
while ($row = $resultGuests->fetch_assoc()) {
    $guests[] = $row;
}

// Return JSON
echo json_encode([
    "success" => true,
    "hotel" => $hotel,
    "guests" => $guests
]);
?>