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
INSERT INTO users (phone, password_hash, first_name, last_name, dob, gender, email) VALUES
('222-222-2222',
 '$2y$10$vgF7eA10P89eT7daEEnbOuZT7I5N5f5m0C0fiILgZz3nEQzDAu1h2',
 'Alice', 'Admin', '1990-01-01', 'female', 'admin@example.com'),

('333-333-3333',
 '$2y$10$4FaVjjnJabceVZ8QFJEXEurH/MBvPkfm4nrD.dNyNhI9i8ZtQc.5y',
 'John', 'Miller', '1998-06-16', 'male', 'john.miller@example.com'),

('444-444-4444',
 '$2y$10$4FaVjjnJabceVZ8QFJEXEurH/MBvPkfm4nrD.dNyNhI9i8ZtQc.5y',
 'Emma', 'Brown', '2000-09-22', 'female', 'emma.brown@example.com'),

('555-555-5555',
 '$2y$10$4FaVjjnJabceVZ8QFJEXEurH/MBvPkfm4nrD.dNyNhI9i8ZtQc.5y',
 'Michael', 'Clark', '1995-12-03', 'male', 'michael.clark@example.com'),

('666-666-6666',
 '$2y$10$4FaVjjnJabceVZ8QFJEXEurH/MBvPkfm4nrD.dNyNhI9i8ZtQc.5y',
 'Sarah', 'Walker', '1999-03-18', 'female', 'sarah.walker@example.com');
