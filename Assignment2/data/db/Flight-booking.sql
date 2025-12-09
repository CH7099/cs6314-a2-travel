USE travel_db;

CREATE TABLE IF NOT EXISTS flight_booking (
    flight_booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id VARCHAR(50) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Query to check the flight_booking table --
/*
USE travel_db;
SELECT * FROM flight_booking LIMIT 10;
*/  