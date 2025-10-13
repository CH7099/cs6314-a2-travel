var dateInterval; //Interval variable (for date refresh)

//HOME PAGE FUNCTIONS
//----------------------------------------------------------------------------------------------------------------------------------------------------------

//Set current datetime
function dateTimeNow(){
    var date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const localDateTime = date.toLocaleString(undefined, options);
    document.getElementById("datetimenow").innerHTML = localDateTime;
}

//Start live datetime (refresh every second)
function startInterval(){
    dateInterval = setInterval(dateTimeNow, 1000);
}

//Pause datetime (clear active interval)
function stopInterval(){
    clearInterval(dateInterval);
}

//Change BG of page
function colorChange(){
    var color = document.getElementById("colorpicker").value;
    document.body.style.backgroundColor = color;
}

//Change font size of paragraphs (limited selection)
function fontChange(){
    var size = document.getElementById("sizepicker").value;
    var paragraphs = document.getElementsByTagName("p");
    for (var i = 0; i < paragraphs.length; i++){
        paragraphs[i].style.fontSize = size;
    }
}

// Validate selected radio button value
function validateSelectedRadioValue(radioGroupName) {
    // Use querySelector to find the checked radio button within the specified group
    const selectedRadio = document.querySelector(`input[name="${radioGroupName}"]:checked`);

    // Check if a radio button was actually selected
    if (selectedRadio) {
        console.log("Selected radio: " + selectedRadio.value);
        return true; // Return the value of the selected radio button
    } else {
        console.log("Displayed Contact: ERROR, RADIO IS NOT SELECTED");
        return null; // No radio button was selected
    }
}

// Validate alphabetic characters only
function validateAlpha(name) {
    for (let i = 0; i < name.length; ++i) {
        let ch = name.charCodeAt(i);
        if (!(ch >= 65 && ch <= 90) && !(ch >= 97 && ch <= 122)) { // A-Z, a-z
            return false;
        }
    }
    return true;
}

// Validate first letter is capitalized
function validateFirstCap(name) {
    let ch = name.charCodeAt(0);
    if (ch >= 65 && ch <= 90) { // A-Z
        return true;
    } else {
        return false;
    }
}

// Validate date in between Sep 1, 2024 to Dec 1, 2024
function validateDate(dateString) {
    const date = new Date(dateString);
    const minDate = new Date('2024-09-01');
    const maxDate = new Date('2024-12-01');
    if (date < minDate || date > maxDate) {
        return false;
    }
    return true;
}

/***** Validate Contact Us Form *****/
function validateInfoContact() {
    var f, l, p, e, c;
    // Get the value of the input field
    f = document.getElementById("firstname").value;
    l = document.getElementById("lastname").value;
    p = document.getElementById("phone").value;
    e = document.getElementById("email").value;
    c = document.getElementById("comment").value;

    var valid = true;

    // Check first name and last name should be alphabetic characters only
    if (validateAlpha(f) && validateAlpha(l) && f.length != 0 && l.length != 0) {
        // Check first letter of first name and last name should be capitalized
        if (validateFirstCap(f) && validateFirstCap(l)) {
            // Check first name and last name can not be the same
            if (f === l) {
                alert("ERROR, FIRST NAME AND LAST NAME CAN NOT BE THE SAME");
                console.log("ERROR, FIRST NAME AND LAST NAME CAN NOT BE THE SAME");
                valid = false;
            }
        } else {
            alert("ERROR, FIRST LETTER OF NAME NOT CAPITALIZED");
            console.log("ERROR, FIRST LETTER OF NAME NOT CAPITALIZED");
            valid = false;
        }
    } else {
        alert("ERROR, NAME IS NOT ALPHABETIC");
        console.log("ERROR, NAME IS NOT ALPHABETIC");
        valid = false;
    }

    // Check valid phone number
    const phoneRegex = /^\( \d{3}\) \d{3}- \d{4}$/;
    if (!phoneRegex.test(p)) {
        alert("ERROR, PHONE NUMBER IS NOT VALID");
        console.log("ERROR, PHONE NUMBER IS NOT VALID");
        valid = false;
    }

    // Check if email address contains @ and .
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e)) {
        alert("ERROR, EMAIL IS NOT VALID");
        console.log("ERROR, EMAIL IS NOT VALID");
        valid = false;
    }

    // Check if gender is selected
    if (!validateSelectedRadioValue("gender")) {
        alert("ERROR, GENDER IS NOT SELECTED");
        console.log("ERROR, GENDER IS NOT SELECTED");
        valid = false;
    }

    // Check if comment is at least 10 characters long
    if (c.length < 10) {
        alert("ERROR, COMMENT MUST BE AT LEAST 10 CHARACTERS LONG");
        console.log("ERROR, COMMENT MUST BE AT LEAST 10 CHARACTERS LONG");
        valid = false;
    }

    if (valid == true) {
        document.getElementById("contactInfo").innerHTML = 
            "Submitted Successfully! Here is the information you provided:<br><br>" +
            "First Name: " + f + "<br>" +
            "Last Name: " + l + "<br>" +
            "Phone: " + p + "<br>" +
            "Email: " + e + "<br>" +
            "Comment: " + c + "<br>";
    }
    
}

/***** Validate Cars Form *****/
function validateInfoCars() {
    var city, carType, checkIn, checkOut;       
    // Get the value of the input field
    city = document.getElementById("city").value;
    carType = document.getElementById("carType").value;
    checkIn = document.getElementById("checkIn").value;         
    checkOut = document.getElementById("checkOut").value;

    var valid = true;

    // Check city should be alphabetic characters only
    if (!validateAlpha(city) || city.length == 0) {
        alert("ERROR, CITY IS NOT ALPHABETIC");
        console.log("ERROR, CITY IS NOT ALPHABETIC");
        valid = false;
    }

    // Check if car type is correctly selected
    carsType = ["Economy", "SUV", "Compact", "Midsize"];
    if (!carsType.includes(carType)) {
        alert("ERROR, CAR TYPE IS INVALID. Valid types are: Economy, SUV, Compact, Midsize");
        console.log("ERROR, CAR TYPE IS INVALID");
        valid = false;
    }

    // Check if check-in date is selected and valid 
    if (checkIn === "" || !validateDate(checkIn)) {
        alert("ERROR, CHECK-IN DATE IS NOT SELECTED OR NOT VALID (MUST BE BETWEEN SEP 1, 2024 AND DEC 1, 2024)");
        console.log("ERROR, CHECK-IN DATE IS NOT SELECTED OR NOT VALID");
        valid = false;
    }

    // Check if check-out date is selected and valid
    if (checkOut === "" || !validateDate(checkOut)) {
        alert("ERROR, CHECK-OUT DATE IS NOT SELECTED OR NOT VALID (MUST BE BETWEEN SEP 1, 2024 AND DEC 1, 2024)");
        console.log("ERROR, CHECK-OUT DATE IS NOT SELECTED OR NOT VALID");
        valid = false;
    }

    // Check if check-out date is after check-in date
    if (checkIn !== "" && checkOut !== "" && new Date(checkOut) <= new Date(checkIn)) {
        alert("ERROR, CHECK-OUT DATE MUST BE AFTER CHECK-IN DATE");
        console.log("ERROR, CHECK-OUT DATE MUST BE AFTER CHECK-IN DATE");
        valid = false;
    }

    if (valid == true) {
        document.getElementById("carInfo").innerHTML = 
            "Submitted Successfully! Here is the information you provided:<br><br>" +
            "City: " + city + "<br>" +
            "Car Type: " + carType + "<br>" +
            "Check In: " + checkIn + "<br>" +
            "Check Out: " + checkOut + "<br>";
    }
}

/***** Style Page *****/
//Change BG of input field on focus/blur
function myFocus(x) {
    x.style.background = "#eeececff";
}

function myBlur(x) {
    x.style.background = "#ffffff";
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------
//DOM listener (at the end for ease-of-access)
document.addEventListener("DOMContentLoaded", ()=>{
    //Check if home page is active; if yes, load live datetime, else clear interval
    if(document.body.id === "home"){
        startInterval();
    } else {
        stopInterval();
    }
    
    //Check if stays page is active; if yes, create listener
    if (document.body.id === "stays"){
        document.getElementById("staysform").addEventListener("submit", staySubmitHandler); //REQUIRED to prevent immediate page refresh
    }
});
