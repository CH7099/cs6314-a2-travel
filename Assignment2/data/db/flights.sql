USE travel_db;

-- Create flights table (9 fields)
-- flight-id is a unique number (VARCHAR to support format like FL-LAX-DAL-20241010-01)
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

-- Create passenger table (5 fields)
-- SSN is a unique number
CREATE TABLE IF NOT EXISTS passenger (
    SSN VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    category ENUM('adults', 'children', 'infants') NOT NULL
);

-- Create flight-booking table (3 fields)
-- flight-booking-id is a unique number
CREATE TABLE IF NOT EXISTS flight_booking (
    flight_booking_id VARCHAR(50) PRIMARY KEY,
    flight_id VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- Create tickets table (4 fields)
-- ticket-id is a unique number
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    flight_booking_id VARCHAR(50) NOT NULL,
    SSN VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (flight_booking_id) REFERENCES flight_booking(flight_booking_id) ON DELETE CASCADE,
    FOREIGN KEY (SSN) REFERENCES passenger(SSN) ON DELETE CASCADE
);

