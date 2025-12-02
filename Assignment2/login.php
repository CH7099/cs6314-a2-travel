<?php
session_start();
include "db.php";

// Only run login processing if POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $phone = $_POST["phone"];
    $password = $_POST["password"];

    if (!$phone || !$password) {
        $_SESSION["login_message"] = "Please enter both phone and password.";
        header("Location: login.html");
        exit();
    }

    // Check if the phone number exists in the database
    $stmt = $conn->prepare(
        "SELECT phone, password_hash, first_name, last_name 
         FROM users 
         WHERE phone = ?"
    );
    $stmt->bind_param("s", $phone);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows !== 1) {
        $_SESSION["login_message"] = "Invalid phone or password.";
        header("Location: login.html");
        exit();
    }

    $row = $result->fetch_assoc();

    if (!password_verify($password, $row["password_hash"])) {
        $_SESSION["login_message"] = "Invalid phone or password.";
        header("Location: login.html");
        exit();
    }

    // SUCCESS – store login session
    $_SESSION["phone"]      = $row["phone"];
    $_SESSION["first_name"] = $row["first_name"];
    $_SESSION["last_name"]  = $row["last_name"];

    // Save user name to browser storage
    echo "
    <script>
        localStorage.setItem('user_name', '" . $row['first_name'] . " " . $row['last_name'] . "');
        window.location = 'home.html';
    </script>";
    exit();
}

// If not POST, only show the message
if (isset($_SESSION["login_message"])) {
    echo "<p style='color:red'>" . $_SESSION["login_message"] . "</p>";
    unset($_SESSION["login_message"]);
}

?>
