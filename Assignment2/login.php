<?php
session_start();
include "db.php";

// Only run login processing if POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $phone = $_POST["phone"];
    $password = $_POST["password"];

    if (!$phone || !$password) {
        echo "<script>alert('Please enter both phone and password.'); window.location='login.html';</script>";
        exit();
    }

    // Check if the phone number exists in the database
    $stmt = $conn->prepare(
        "SELECT userid, phone, password_hash, first_name, last_name, isadmin 
         FROM users 
         WHERE phone = ?"
    );
    $stmt->bind_param("s", $phone);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows !== 1) {
        echo "<script>alert('Invalid phone or password.'); window.location='login.html';</script>";
        exit();
    }

    $row = $result->fetch_assoc();

    if (!password_verify($password, $row["password_hash"])) {
        echo "<script>alert('Invalid phone or password.'); window.location='login.html';</script>";
        exit();
    }

    // SUCCESS – store login session
    $_SESSION["phone"]      = $row["phone"];
    $_SESSION["first_name"] = $row["first_name"];
    $_SESSION["last_name"]  = $row["last_name"];
    $_SESSION["userid"]     = $row["userid"];
    $_SESSION["isadmin"]    = $row["isadmin"];

    // Save user name and userid to browser local storage and redirect
    echo "
    <script>
        localStorage.setItem('user_name', '" . $row['first_name'] . " " . $row['last_name'] . "');
        localStorage.setItem('user_id', '" . $row['userid'] . "');
        localStorage.setItem('is_admin', '" . $row['isadmin'] . "');
        window.location = 'home.html';
    </script>";
    exit();
}

// Optional: if the page is loaded without POST
if (isset($_SESSION["login_message"])) {
    echo "<script>alert('" . $_SESSION["login_message"] . "');</script>";
    unset($_SESSION["login_message"]);
}
?>
