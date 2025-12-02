<?php 
include "db.php"; 
session_start();

$register_message = "";

/* Register */
if ($_SERVER["REQUEST_METHOD"] == "POST" && $_POST["action"] == "register") {
    $phone    = $_POST["phone"];
    $password = $_POST["password"];
    $confirm  = $_POST["confirm_password"];
    $first    = $_POST["first_name"];
    $last     = $_POST["last_name"];
    $dob      = $_POST["dob"];
    $gender   = $_POST["gender"] ?? "";
    $email    = $_POST["email"];

    /* Validate the form */
    /* All required fields must be filled */
    if (!$phone || !$password || !$confirm || !$first || !$last || !$dob || !$email) {
        $register_message = "All required fields must be filled.";
    }
    /* Phone must be formatted as ddd-ddd-dddd */
    elseif (!preg_match("/^\d{3}-\d{3}-\d{4}$/", $phone)) {
        $register_message = "Phone must be formatted as ddd-ddd-dddd.";
    }
    /* Password must be at least 8 characters */
    elseif (strlen($password) < 8) {
        $register_message = "Password must be at least 8 characters.";
    }
    /* Passwords must match */
    elseif ($password !== $confirm) {
        $register_message = "Passwords do not match.";
    }
    /* Email must contain @ and .com */
    elseif (strpos($email, "@") === false || strpos($email, ".com") === false) {
        $register_message = "Email must contain @ and .com";
    }
    else {
        /* Check if phone number is already registered */
        $check = $conn->prepare("SELECT phone FROM users WHERE phone = ?");
        $check->bind_param("s", $phone);
        $check->execute();
        $result = $check->get_result();

        /* If phone number is already registered, display an error message */
        if ($result->num_rows > 0) {
            $register_message = "This phone number is already registered.";
        } else {
            /* Hash the password */
            $hash = password_hash($password, PASSWORD_DEFAULT);

            /* Insert the user's information into the database */
            $stmt = $conn->prepare(
                "INSERT INTO users (phone, password_hash, first_name, last_name, dob, gender, email)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            $stmt->bind_param("sssssss", $phone, $hash, $first, $last, $dob, $gender, $email);

            /* If the user's information is inserted into the database, display a success message */
            if ($stmt->execute()) {
                $register_message = "Registration successful! Now you can log in.";
            } else {
                $register_message = "Database error: " . $conn->error;
            }
        }
    }
}
?>