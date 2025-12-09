USE travel_db;

CREATE TABLE IF NOT EXISTS passenger (
    SSN             CHAR(9)     PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    date_of_birth   DATE        NOT NULL,
    category        ENUM('adult','child','infant') NOT NULL
);

-- Query to check the passenger table --
/*
USE travel_db;
SELECT * FROM passenger LIMIT 10;
*/
