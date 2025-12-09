USE travel_db;

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_booking_id INT NOT NULL,
    SSN VARCHAR(11) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_booking_id) REFERENCES flight_booking(flight_booking_id),
    FOREIGN KEY (SSN) REFERENCES passenger(SSN)
);

-- Query to check the tickets table --
/*
USE travel_db;
SELECT * FROM tickets LIMIT 10;
*/  