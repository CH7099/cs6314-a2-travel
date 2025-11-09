<?php
//Origin bypass
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Get the raw POST data
$jsonData = file_get_contents("php://input");

// Save it to a JSON file in the same directory
$file = __DIR__ .'/data/user.json';
if(file_put_contents($file, $jsonData)) {
    echo "User data saved successfully!";
} else {
    echo "Error saving data!";
}
?>