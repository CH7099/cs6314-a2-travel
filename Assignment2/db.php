<?php
$servername = "localhost";
$username = "travel_user1";     
$password = "Travel123!";         
$database = "travel_db"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
