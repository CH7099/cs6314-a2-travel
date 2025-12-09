USE travel_db;
-- Hotel table
CREATE TABLE IF NOT EXISTS Hotel (
    hotel_id VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    city VARCHAR(100),
    price_per_night DECIMAL(10,2)
);

-- Hotel_Booking table
CREATE TABLE IF NOT EXISTS Hotel_Booking (
    hotel_booking_id varchar(20) NOT NULL PRIMARY KEY,
    hotel_id VARCHAR(10) NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    number_of_rooms INT,
    price_per_night DECIMAL(10,2),
    total_price DECIMAL(10,2)
);

-- Guests table
CREATE TABLE IF NOT EXISTS Guests (
    guestid INT AUTO_INCREMENT PRIMARY KEY,
    SSN VARCHAR(20) UNIQUE,
    hotel_booking_id varchar(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    category VARCHAR(20)
);