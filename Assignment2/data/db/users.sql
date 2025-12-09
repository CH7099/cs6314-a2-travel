USE travel_db;

CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(12) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    email VARCHAR(100) NOT NULL,
    isadmin BOOLEAN DEFAULT FALSE
);

-- Sample Users
-- Note: All passwords are set to match their phone numbers
INSERT INTO users (phone, password_hash, first_name, last_name, dob, gender, email, isadmin) VALUES
('222-222-2222',
 '$2y$10$8QC4nbZLLut45odpZTJs2OSebJC2W821A9rc4XrjAoroqYitaHyW2',
 'Alice', 'Admin', '1990-01-01', 'female', 'admin@example.com', '1'),

('333-333-3333',
 '$2y$10$GYT7/5LGNuBKVNZcuwG73uygyoPFCozBvb2lQwgZvyKNASAMnuPam',
 'John', 'Miller', '1998-06-16', 'male', 'john.miller@example.com', '0'),

('444-444-4444',
 '$2y$10$OFncTTRKmolfY9uD5e/bfOm76R9fvTkW2iMGoRihT7ZJhy0BfQb/K',
 'Emma', 'Brown', '2000-09-22', 'female', 'emma.brown@example.com', '0'),

('555-555-5555',
 '$2y$10$rU6rutX/hdpi.RGb4m3gm.JzLBapM7PNslrP9TnvKIjmYewh4GDBS',
 'Michael', 'Clark', '1995-12-03', 'male', 'michael.clark@example.com', '0'),

('666-666-6666',
 '$2y$10$kYXs/cok7aWQqst22la9we9Z.Gbvf2aF1R1hgLtUdKi1l/nFS4Jwi',
 'Sarah', 'Walker', '1999-03-18', 'female', 'sarah.walker@example.com', '0');
