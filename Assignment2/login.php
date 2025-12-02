<?php 
include "db.php"; 
session_start();
$login_message = "";

/* Login */
if ($_SERVER["REQUEST_METHOD"] == "POST" && $_POST["action"] == "login") {
    $phone = $_POST["phone"];
    $password = $_POST["password"];

    /* Check if the phone number and password are correct */
    if (!$phone || !$password) {
        $login_message = "Please enter both phone and password.";
    }
    /* If the phone number and password are not correct, display an error message */
    else {
        /* Check if the phone number exists in the database */
        $stmt = $conn->prepare(
            "SELECT phone, password_hash, first_name, last_name 
             FROM users 
             WHERE phone = ?"
        );
        $stmt->bind_param("s", $phone);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();

       
            if (password_verify($password, $row["password_hash"])) {

            /* Write session */
            $_SESSION["phone"]      = $row["phone"];
            $_SESSION["first_name"] = $row["first_name"];
            $_SESSION["last_name"]  = $row["last_name"];

            /* Check if the user is an admin */
            if ($row["phone"] === "222-222-2222") {
                $_SESSION["is_admin"] = true;
            } else {
                $_SESSION["is_admin"] = false;
            }
        }

            echo "<h2 style='color: green;'>Login Success!</h2>";
            echo "<p>Welcome, " . $_SESSION['first_name'] . " " . $_SESSION['last_name'] . "</p>";
            echo "<p>Need show this in all pages</p>";
        
            exit();
        } else {
            $login_message = "Invalid phone or password.";
        }
    }
    $stmt->close();
}
?>