CREATE DATABASE IF NOT EXISTS travel_db;
USE travel_db;
CREATE USER 'travel_user'@'localhost' IDENTIFIED BY 'Travel123!';
GRANT ALL PRIVILEGES ON travel_db.* TO 'travel_user'@'%';
FLUSH PRIVILEGES;