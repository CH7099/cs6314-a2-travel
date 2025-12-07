<?php
include "db.php";
session_start();

// Display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $_POST["action"] == "register") {
    $first    = $_POST["first_name"];
    $last     = $_POST["last_name"];
    $dob      = $_POST["dob"];
    $gender   = $_POST["gender"] ?? "";
    $phone    = $_POST["phone"];
    $email    = $_POST["email"];
    $password = $_POST["password"];
    $confirm  = $_POST["confirm_password"];

    $register_message = "";

    if (!$phone || !$password || !$confirm || !$first || !$last || !$dob || !$email) {
        $register_message = "All required fields must be filled.";
    } elseif (!preg_match("/^\d{3}-\d{3}-\d{4}$/", $phone)) {
        $register_message = "Phone must be formatted as ddd-ddd-dddd.";
    } elseif (strlen($password) < 8) {
        $register_message = "Password must be at least 8 characters.";
    } elseif ($password !== $confirm) {
        $register_message = "Passwords do not match.";
    } elseif (strpos($email, "@") === false || (strpos($email, ".com") === false && strpos($email, ".edu") === false)) {
        $register_message = "Email must contain @ and .com or .edu.";
    }

    if ($register_message != "") {
        echo "<script>alert('$register_message'); window.location='register.html';</script>";
        exit();
    }

    // Check if phone already exists
    $check = $conn->prepare("SELECT phone FROM users WHERE phone = ?");
    $check->bind_param("s", $phone);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('This phone number is already registered.'); window.location='register.html';</script>";
        exit();
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare(
        "INSERT INTO users (phone, password_hash, first_name, last_name, dob, gender, email)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssssss", $phone, $hash, $first, $last, $dob, $gender, $email);

    if ($stmt->execute()) {
        echo "<script>alert('Registration successful! Now you can log in.'); window.location='login.html';</script>";
        exit();
    } else {
        die("Database error: " . $stmt->error);
    }
}
?>
