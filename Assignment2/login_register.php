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

<!DOCTYPE html>
<html>
    <head>
        <title>Register</title>
        <link rel="stylesheet" type="text/css" href="assets/css/mystyle.css">
        <script type="text/javascript" src="assets/js/travel.js"></script>
    </head>
    <body id="home">
        <div class="header">
        <h1>Register</h1>
    </div>

    <div class="row">
        <div class="topnav">
            <a href="home.html">Home</a>
            <a href="login_register.php">Register</a>
            <a href="stays.html">Stays</a>
            <a href="flights.html">Flights</a>
            <a href="cars.html">Cars</a>
            <a href="cruises.html">Cruises</a>
            <a href="contact-us.html">Contact us</a>
            <a href="cart.html">Cart</a>
        </div>
    </div>

    <div class="row">
        <div class="column side">
            <h2>Left Side</h2>
            <p class="prefselector">Choose background color: </p>
            <select id="colorpicker" onchange="colorChange()">
                <option value="white" selected="true">White</option>
                <option value="lightgray">Light Gray</option>
                <option value="darkgray">Dark Gray</option>
            </select>
            <br>
            <p class="prefselector">Choose font size: </p>
            <select id="sizepicker" onchange="fontChange()">
                <option value="12px" >12</option>
                <option value="16px" selected="true">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
            </select>
            <br>
        </div>
        <div class="column middle">
            <div class="login-register-container">
                <div>
                    <h2>Login</h2>
                    <form method="post" action="login_register.php" onsubmit="return validateLoginForm();">
                        <input type="hidden" name="action" value="login">
                        Phone Number:<br>
                        <input type="text" name="phone" id="login_phone" onfocus="myFocus(this)" onblur="myBlur(this)" required placeholder="ddd-ddd-dddd"><br><br>
                        Password:<br>
                        <input type="password" name="password" id="login_password" required><br><br>
                        <button type="submit">Login</button>
                    </form>
                    <p style="color: red;"><?php echo $login_message; ?></p>    
                </div>
                <div>
                    <h2>Register Form</h2>
                    <form method="post" action="login_register.php" id="registerForm">
                        <input type="hidden" name="action" value="register">
                        <input type="text" name="first_name" placeholder="First Name" required><br>
                        <input type="text" name="last_name" placeholder="Last Name" required><br>
                        <input type="date" name="dob" placeholder="Date of Birth" required><br>
                        <input type="radio" name="gender" value="male"> Male <input type="radio" name="gender" value="female"> Female<br>
                        <input type="text" name="phone" placeholder="Phone" required placeholder="ddd-ddd-dddd"><br>
                        <input type="email" name="email" placeholder="Email" required><br>
                        <input type="password" name="password" placeholder="Password" required><br>
                        <input type="password" name="confirm_password" placeholder="Confirm Password" required><br>
                        <button type="submit" name="register">Register</button>
                    </form>
                    <p style="color: red;"><?php echo $register_message; ?></p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="footer">
            <h3 id="Names">Nicholas Aminzadeh, NHA190001 | Changhui Sun, CXS240024 | Thi Vu, TAV180002</h3>
        </div>
    </div>

    </body>
</html>
