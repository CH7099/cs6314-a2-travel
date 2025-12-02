<?php
include 'db.php';
// Create Flights table
$sql = "CREATE TABLE IF NOT EXISTS Flights (
    flight_id        INT AUTO_INCREMENT PRIMARY KEY,
    origin           VARCHAR(50)  NOT NULL,
    destination      VARCHAR(50)  NOT NULL,
    departure_date   DATE         NOT NULL,
    arrival_date     DATE         NOT NULL,
    departure_time   TIME         NOT NULL,
    arrival_time     TIME         NOT NULL,
    available_seats  INT          NOT NULL,
    price            DECIMAL(10,2) NOT NULL
)";
if ($conn->query($sql)) {
    die('Error creating Flights table: ' . $conn->error);
}
// Create Passengers table
$sql = "CREATE TABLE IF NOT EXISTS Passenger (
    SSN             CHAR(9)     PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    date_of_birth   DATE        NOT NULL,
    category  ENUM('adult','child','infant') NOT NULL,

)";

if ($conn->query($sql)) {
    die('Error creating Passenger table: ' . $conn->error);
}

// Create Flight_Bookings table
$sql = "CREATE TABLE IF NOT EXISTS Flight_booking (
    flight_booking_id           INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    user_phone           VARCHAR(20) NOT NULL,
    total_price          DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
)";

if ($conn->query($sql)) {
    die('Error creating Flight_Bookings table: ' . $conn->error);
}

// Create Tickets table
$sql = "CREATE TABLE IF NOT EXISTS Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_booking_id INT NOT NULL,
    SSN CHAR(9) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_booking_id) REFERENCES Flight_booking(flight_booking_id),
    FOREIGN KEY (SSN) REFERENCES Passenger(SSN)
)";
if ($conn->query($sql)) {
    die('Error creating Tickets table: ' . $conn->error);
}

echo "All flight pages tables created successfully";
?>