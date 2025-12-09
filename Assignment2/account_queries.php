<?php
header('Content-Type: application/json');
include "db.php";

// Support JSON POST input
$raw = file_get_contents("php://input");
if ($raw) {
    $json = json_decode($raw, true);
    if (is_array($json)) {
        foreach ($json as $k => $v) {
            $_POST[$k] = $v; // merge JSON into $_POST
        }
    }
}

$action = $_POST['action'] ?? '';

switch ($action) {

    case 'flight_by_id':
        $id = $_POST['flight_booking_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM flight_booking WHERE flight_booking_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'hotel_by_id':
        $id = $_POST['hotel_booking_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM Hotel_Booking WHERE hotel_booking_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'passengers_by_flight':
        $id = $_POST['flight_booking_id'] ?? '';
        $stmt = $conn->prepare("
            SELECT p.SSN, p.first_name, p.last_name, p.date_of_birth, p.category, 
                   t.ticket_id, t.price, fb.flight_booking_id, fb.total_price
            FROM passenger p
            JOIN tickets t ON p.SSN = t.SSN
            JOIN flight_booking fb ON t.flight_booking_id = fb.flight_booking_id
            WHERE fb.flight_booking_id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'hotels_september_2024':
        $stmt = $conn->prepare("
            SELECT * FROM hotel_booking 
            WHERE MONTH(check_in_date) = 9 AND YEAR(check_in_date) = 2024
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'flights_september_2024':
        $stmt = $conn->prepare("
            SELECT * FROM flight_booking 
            JOIN flights f ON flight_booking.flight_id = f.flight_id
            WHERE MONTH(f.departure_date) = 9 AND YEAR(f.departure_date) = 2024
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'bookings_by_ssn':
        $ssn = $_POST['ssn'] ?? '';
        $stmt = $conn->prepare("
            SELECT * 
            FROM flight_booking fb
            JOIN tickets t ON t.flight_booking_id = fb.flight_booking_id
            JOIN passenger p ON p.SSN = t.SSN
            WHERE p.ssn = ?
        ");
        $stmt->bind_param("s", $ssn);
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_texas_flights':
        $stmt = $conn->prepare("
            SELECT * FROM flight_booking fb
            JOIN flights f ON fb.flight_id = f.flight_id
            WHERE LOWER(f.origin) LIKE '%tx%'
            AND f.departure_date BETWEEN '2024-09-01' AND '2024-10-31'
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    
    case 'admin_texas_flights_no_infants':
        $stmt = $conn->prepare("
            SELECT fb.*, f.*, COUNT(p.SSN) as passenger_count FROM flight_booking fb
            JOIN flights f ON fb.flight_id = f.flight_id
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            JOIN passenger p ON t.SSN = p.SSN
            WHERE LOWER(f.origin) LIKE '%tx%'
            AND f.departure_date BETWEEN '2024-09-01' AND '2024-10-31'
            GROUP BY fb.flight_booking_id
            HAVING SUM(CASE WHEN LOWER(p.category) = 'infant' THEN 1 ELSE 0 END) = 0
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_texas_hotels':
        $stmt = $conn->prepare("
            SELECT * FROM hotel_booking
            JOIN hotel h ON hotel_booking.hotel_id = h.hotel_id
            WHERE LOWER(h.city) LIKE '%dallas%'
            AND check_in_date BETWEEN '2024-09-01' AND '2024-10-31'
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_most_expensive_hotels':
        $stmt = $conn->prepare("
            SELECT * FROM hotel_booking
            ORDER BY total_price DESC
            LIMIT 1
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_most_expensive_flights':
        $stmt = $conn->prepare("
            SELECT * FROM flight_booking
            ORDER BY total_price DESC
            LIMIT 1
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_flights_with_infant':
        $stmt = $conn->prepare("
            SELECT DISTINCT fb.* FROM flight_booking fb
            JOIN tickets t ON t.flight_booking_id = fb.flight_booking_id
            JOIN passenger p ON p.SSN = t.SSN
            WHERE LOWER(p.category) = 'infant'
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;
    
    case 'admin_flights_with_infant_and_5_children':
        $stmt = $conn->prepare("
            SELECT DISTINCT fb.* FROM flight_booking fb
            JOIN tickets t ON t.flight_booking_id = fb.flight_booking_id
            JOIN passenger p ON p.SSN = t.SSN
            GROUP BY fb.flight_booking_id
            HAVING SUM(CASE WHEN LOWER(p.category) = 'infant' THEN 1 ELSE 0 END) >= 1
            AND SUM(CASE WHEN LOWER(p.category) = 'child' THEN 1 ELSE 0 END) >= 5
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'admin_california_arrivals':
        $stmt = $conn->prepare("
            SELECT COUNT(*) as count FROM flight_booking fb
            JOIN flights f ON fb.flight_id = f.flight_id
            WHERE LOWER(f.destination) LIKE '%ca%'
            AND f.departure_date BETWEEN '2024-09-01' AND '2024-10-31'
        ");
        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

$conn->close();

?>