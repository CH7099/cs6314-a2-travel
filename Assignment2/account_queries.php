<?php
header('Content-Type: application/json');
include "db.php";

$action = $_POST['action'] ?? '';

switch ($action) {

    case 'flight_by_id':
        $id = $_POST['flight_booking_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM flight_bookings WHERE booking_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'hotel_by_id':
        $id = $_POST['hotel_booking_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM hotel_bookings WHERE booking_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'passengers_by_flight':
        $id = $_POST['flight_booking_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM passengers WHERE flight_booking_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'september_2024':
        $stmt = $conn->prepare("
            SELECT * FROM flight_bookings 
            WHERE MONTH(departure_date) = 9 AND YEAR(departure_date) = 2024
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'bookings_by_ssn':
        $ssn = $_POST['ssn'] ?? '';
        $stmt = $conn->prepare("
            SELECT * FROM flight_bookings fb 
            JOIN passengers p ON fb.booking_id = p.flight_booking_id
            WHERE p.ssn = ?
        ");
        $stmt->bind_param("s", $ssn);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_texas_flights':
        $city = "%" . strtolower($_POST['city'] ?? '') . "%";
        $stmt = $conn->prepare("
            SELECT * FROM flights 
            WHERE LOWER(origin) LIKE ?
            AND departure_date BETWEEN '2024-09-01' AND '2024-10-31'
        ");
        $stmt->bind_param("s", $city);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    // Add the rest...
}

$conn->close();

?>