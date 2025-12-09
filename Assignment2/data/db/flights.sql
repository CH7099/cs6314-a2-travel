USE travel_db;

CREATE TABLE IF NOT EXISTS flights (
    flight_id VARCHAR(50) PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    INDEX idx_origin (origin),
    INDEX idx_destination (destination),
    INDEX idx_departure_date (departure_date),
    INDEX idx_available_seats (available_seats)
);

-- Query to check the flights table --
/*
USE travel_db;
SELECT * FROM flights LIMIT 10;
*/
