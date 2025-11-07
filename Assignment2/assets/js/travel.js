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
    var all = document.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++){
        all[i].style.fontSize = size;
    }
}

//STAYS PAGE FUNCTIONS
//----------------------------------------------------------------------------------------------------------------------------------------------------------
function staySubmitHandler(event){
    event.preventDefault(); //Necessary to prevent immediate refresh

    //Default response
    const p = "City Name: <br>Check-In Date: <br>Check-Out Date: <br>Number of Adults: "+
    "<br>Number of Children: <br>Number of Infants: <br>Number of Rooms: <br></br>"

    //List of acceptable Texas cities
    const citiesTX = [
        "Houston", "Dallas", "Austin", "San Antonio", "El Paso", "Fort Worth", "Arlington", "Corpus Christi",
        "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville",
        "Pasadena", "Frisco", "McKinney", "Killeen", "McAllen", "Waco", "Carrollton", "Denton", "Midland"
    ];
    const citiesCA = [
        "Adelanto", "Agoura Hills", "Alameda", "Albany", "Alhambra",
        "Anaheim", "Antioch", "Apple Valley", "Arcadia", "Artesia",
        "Bakersfield", "Baldwin Park", "Banning", "Beaumont", "Bell",
        "Berkeley", "Beverly Hills", "Brentwood", "Burbank", "Calabasas",
        "Carlsbad", "Carson", "Cathedral City", "Cerritos", "Chico",
        "Chino", "Chula Vista", "Clovis", "Colton", "Compton",
        "Concord", "Corona", "Costa Mesa", "Culver City", "Cupertino",
        "Daly City", "Davis", "Delano", "Diamond Bar", "Downey",
        "Dublin", "Eastvale", "El Cajon", "El Monte", "El Segundo",
        "Fairfield", "Folsom", "Fontana", "Fountain Valley", "Fremont",
        "Fresno", "Fullerton", "Garden Grove", "Gardena", "Glendale",
        "Glendora", "Goleta", "Hacienda Heights", "Hawaiian Gardens", "Hawthorne",
        "Hayward", "Hemet", "Hesperia", "Huntington Beach", "Indio",
        "Irvine", "La Habra", "Laguna Niguel", "Lake Elsinore", "Lakewood",
        "Lancaster", "Lodi", "Lomita", "Long Beach", "Los Angeles",
        "Lynwood", "Madera", "Manhattan Beach", "Manteca", "Menlo Park",
        "Merced", "Milpitas", "Mission Viejo", "Modesto", "Montebello",
        "Monterey Park", "Moreno Valley", "Mountain View", "Napa", "National City",
        "Newark", "Norwalk", "Novato", "Oakland", "Oceanside",
        "Ontario", "Orange", "Oxnard", "Palm Desert", "Palm Springs",
        "Palmdale", "Palo Alto", "Paramount", "Pasadena", "Petaluma",
        "Pico Rivera", "Piedmont", "Pinole", "Placentia", "Pomona",
        "Port Hueneme", "Rancho Cordova", "Rancho Cucamonga", "Redding", "Redlands",
        "Redondo Beach", "Redwood City", "Rialto", "Richmond", "Riverside",
        "Rocklin", "Roseville", "Sacramento", "Salinas", "San Bernardino",
        "San Bruno", "San Diego", "San Francisco", "San Jose", "San Leandro",
        "San Marcos", "San Mateo", "San Pablo", "San Rafael", "Santa Ana",
        "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria",
        "Santa Monica", "Santa Rosa", "Santee", "Signal Hill", "Simi Valley",
        "South Gate", "South San Francisco", "Stockton", "Sunnyvale", "Temecula",
        "Thousand Oaks", "Torrance", "Tracy", "Tustin", "Union City",
        "Upland", "Vacaville", "Vallejo", "Ventura", "Victorville",
        "Visalia", "Vista", "Walnut Creek", "West Covina", "West Hollywood",
        "West Sacramento", "Westminster", "Whittier", "Woodland", "Yorba Linda",
        "Yuba City"
    ];

    const allowedCities = citiesTX.concat(citiesCA); //Concatenated list of cities

    //User-entered values
    var city = document.getElementById("city").value;
    var checkin = document.getElementById("check-in").value;
    var checkout = document.getElementById("check-out").value;
    var adults = Number(document.getElementById("adults").value);
    var children = Number(document.getElementById("children").value);
    var infants = Number(document.getElementById("infants").value);
    var rooms = 0; //Initialization

    var result = document.getElementById("validationresult"); //Result

    //Case-insensitive comparison for city validation
    const isValid = allowedCities.some(c => c.toUpperCase() === city.toUpperCase());
    if(!isValid){
        alert("ERROR: You must choose a city in either Texas or California.");
        result.innerHTML = p;
        return;
    }

    //Date validation
    //Split dates
    var splitCheckIn = checkin.split("-");
    var splitCheckOut = checkout.split("-");
    //Parse fields into usable dates (for comparison)
    var arr = new Date(splitCheckIn[0], splitCheckIn[1]-1, splitCheckIn[2]);
    var dep = new Date(splitCheckOut[0], splitCheckOut[1]-1, splitCheckOut[2]);
    if(arr >= dep){
        alert("ERROR: Your chosen check-in date must come before your chosen check-out date.");
        result.innerHTML = p;
        return;
    }

    //Guest validation
    if (isNaN(adults) || adults <= 0){
        alert("ERROR: Invalid number of adults entered.");
        result.innerHTML = p;
        return;
    } else if (isNaN(children) || children < 0){
        alert("ERROR: Invalid number of children entered.");
        result.innerHTML = p;
        return;
    } else if (isNaN(infants) || infants < 0){
        alert("ERROR: Invalid number of infants entered.");
        result.innerHTML = p;
        return;
    }

    //Room determination
    rooms = Math.ceil((adults + children)/2);

    //Return validated data
    result.innerHTML = "City Name: <p id='cityname' class='no-indent'>" + city + "</p><br>Check-In Date: <p id='checkindate' class='no-indent'>" + checkin + 
    "</p><br>Check-Out Date: <p id='checkoutdate' class='no-indent'>" + checkout + "</p><br>Number of Adults: <p id='numadults' class='no-indent'>" + adults + 
    "</p><br>Number of Children: <p id='numchildren' class='no-indent'>" + children + "</p><br>Number of Infants: <p id='numinfants' class='no-indent'>" + infants + 
    "</p><br>Number of Rooms: <p id='numrooms' class='no-indent'>" + rooms + "</p>";

    //Load available hotels based on user criteria
    loadHotels(city, checkin, checkout, rooms);
}

//Function used to load available hotels from hotels.xml following search
function loadHotels(city, checkin, checkout, roomsNeeded) {
    //Establish XMLHttpRequest
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "data/hotels.xml", true);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const xml = xhttp.responseXML;
            const hotels = xml.getElementsByTagName("Hotel");//Pull hotels from hotels.xml
            let resultHTML = "<h3>Available Hotels:</h3>"; //Result header

            let found = false;
            for (let i = 0; i < hotels.length; i++) {
                //Extract details
                const cityName = hotels[i].getElementsByTagName("City")[0].textContent;
                const availableRooms = parseInt(hotels[i].getElementsByTagName("AvailableRooms")[0].textContent);
                const inDate = hotels[i].getElementsByTagName("InDate")[0].textContent;
                const outDate = hotels[i].getElementsByTagName("OutDate")[0].textContent;

                //Check if hotel matches the search criteria (city, rooms needed, check-in/check-out dates)
                if (cityName.toUpperCase() === city.toUpperCase() &&
                    availableRooms >= roomsNeeded &&
                    checkin >= inDate &&
                    checkout <= outDate) {

                    found = true;
                    const hotelId = hotels[i].getElementsByTagName("HotelID")[0].textContent;
                    const name = hotels[i].getElementsByTagName("Name")[0].textContent;
                    const price = hotels[i].getElementsByTagName("PricePerNight")[0].textContent;

                    //Create hotel option and append it to the divider
                    resultHTML += `
                        <div class="hotel-option">
                            <input type="radio" name="selectedHotel" value="${hotelId}" data-name="${name}" data-price="${price}">
                            <strong>${name}</strong> — $${price}/night<br>
                            Available Rooms: ${availableRooms}
                        </div><br>
                    `;
                }
            }

            //If no hotels are found based on the search, return the following message
            if (!found) {
                resultHTML += "<p>No hotels found for your criteria.</p>";
            }

            document.getElementById("hotelResults").innerHTML = resultHTML; //Return results
        }
    };
    xhttp.send();
}

//Book stays
function bookStays() {
    const selected = document.querySelector('input[name="selectedHotel"]:checked'); //Find selected hotel
    //Check if a hotel was selected; if not, throw error (alert)
    if (!selected) {
        alert("Please select a hotel to book.");
        return;
    }
    //Hotel details (pulled directly)
    const hotelId = selected.value;
    const hotelName = selected.getAttribute("data-name");
    const price = parseFloat(selected.getAttribute("data-price"));
    const city = document.getElementById("cityname").textContent;
    const checkin = document.getElementById("checkindate").textContent;
    const checkout = document.getElementById("checkoutdate").textContent;
    const adults = parseInt(document.getElementById("numadults").textContent);
    const children = parseInt(document.getElementById("numchildren").textContent);
    const infants = parseInt(document.getElementById("numinfants").textContent);
    const rooms = parseInt(document.getElementById("numrooms").textContent);

    //Hotel details (calculated)
    const nights = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24); //Number of nights
    const totalPrice = price * rooms * nights; //Total price (number of rooms * price per night * number of nights)
    const bookingNumber = "BKG-" + Math.floor(Math.random() * 90000 + 10000);

    //Load user JSON first
    const xhttp1 = new XMLHttpRequest();
    xhttp1.open("GET", "data/user.json", true); //GET request for user.json
    xhttp1.onreadystatechange = function() {
        if (xhttp1.readyState === 4) {
            if (xhttp1.status === 200) {
                const userData = JSON.parse(xhttp1.responseText);
                const userId = userData.User["user-id"]; //Pull user-id value from user.json

                //Booking object for hotel.json (selected hotel information)
                const booking = {
                    "Booking": {
                        "user-id": userId,
                        "booking-number": bookingNumber,
                        "hotel-id": hotelId,
                        "hotel-name": hotelName,
                        "city": city,
                        "check-in": checkin,
                        "check-out": checkout,
                        "adults": adults,
                        "children": children,
                        "infants": infants,
                        "rooms": rooms,
                        "price-per-night": price,
                        "total-price": totalPrice
                    }
                };

                console.log("Booking confirmed:", booking); //Log booking (debugging)

                //Send booking to server
                const xhttp2 = new XMLHttpRequest();
                xhttp2.open("POST", "http://localhost:8000/hotels.php", true); //POST request to hotels.php (may need to change URL if different port used during setup)
                xhttp2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                //Server response handler (runs when connected)
                xhttp2.onreadystatechange = function() {
                    if (xhttp2.readyState === 4) {
                        if (xhttp2.status === 200) {
                            const response = JSON.parse(xhttp2.responseText); //XML response converted to JSON response
                            if (response.success) { 
                                alert("Booking confirmed! Your booking number: " + response.bookingNumber);
                            } else {
                                alert("Booking failed: " + JSON.stringify(response.error));
                            }
                        } else {
                            alert("Error contacting server: " + xhttp2.status);
                        }
                    }
                };
                xhttp2.send(JSON.stringify(booking)); //Send booking object as JSON string

            } else {
                console.error("Failed to read user.json", xhttp1.status); //Error reading user.json (if user is missing or file is corrupted)
            }
        }
    };
    xhttp1.send();
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

// Validate if a radio button is selected and return its value
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
//----------------------------------------------------------------------------------------------------------------------------------------------------------
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
    const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
    if (!phoneRegex.test(p)) {
        alert("ERROR, PHONE NUMBER IS NOT VALID. Format: (xxx)xxx-xxxx");
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
            "Gender: " + document.querySelector('input[name="gender"]:checked').value + "<br>" +
            "Email: " + e + "<br>" +
            "Comment: " + c + "<br>";

        // Store data in a JSON file
        let userData = {
            User: {
                "user-id": Math.floor(Math.random() * 1000000), // Random user ID
                "firstName": f,
                "lastName": l,
                "phoneNumber": p,
                "gender": document.querySelector('input[name="gender"]:checked').value,
                "email": e,
                "comment": c
            } 
        };

        // Convert to JSON string (for saving or sending to server)
        let userJSON = JSON.stringify(userData, null, 2);
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Server response:", this.responseText);
            }
        };

        xhttp.open("POST", "http://localhost:8000/saveUser.php", true); // Need to change URL based on server setup
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(userJSON);
        console.log("User data sent to server:", userJSON);
    }
    
}

/***** Validate Cars Form *****/
//----------------------------------------------------------------------------------------------------------------------------------------------------------
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
    var carsTypes = ["Economy", "SUV", "Compact", "Midsize"];
    if (!carsTypes.includes(carType)) {
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

    /* 
    Create a XML file for all the avaiable cars. The XML file should include information about available cars
    including car-id, the name of city, type of car, the check in date, check out date, and price per day for 
    at least 20 cars.
    */
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