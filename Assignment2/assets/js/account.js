document.addEventListener("DOMContentLoaded", function() {
    initAccountPage();
    setupAdminVisibility();
    setupButtons();
});

/**
 * Initialize account page
 */
function initAccountPage() {
    // Check login status (temporary)
    if (!checkLoginStatus()) {
        showLoginRequired();
        return;
    }
    
    // Check admin status (temporary: check phone === "222-222-2222")    
    // Show/hide admin functions
    if (checkAdminStatus()) {
        showAdminFunctions();
    } else {
        hideAdminFunctions();
    }
}

// Temporary: Check login status
function checkLoginStatus() {
    const userName = localStorage.getItem("user_name");
    return userName !== null && userName !== "";
}

//Temporary: Check admin status
function checkAdminStatus() {
    const userPhone = localStorage.getItem("user_phone");
    return userPhone === "222-222-2222";
}

// Show admin functions section
function showAdminFunctions() {
    const adminSection = document.getElementById("adminFunctions");
    if (adminSection) {
        adminSection.style.display = "block";
    }
}

// Hide admin functions section
function hideAdminFunctions() {
    const adminSection = document.getElementById("adminFunctions");
    if (adminSection) {
        adminSection.style.display = "none";
    }
}

// Show login required message
function showLoginRequired() {
    // TODO: Show login required message
    alert("Please log in to access your account.");
    window.location.href = "login.html";
}

function setupAdminVisibility() {
    const admin = localStorage.getItem("is_admin") === "1";
    const adminElements = document.getElementsByClassName("requires-admin");
    for (let el of adminElements) {
        el.style.display = admin ? "block" : "none";
    }
}

/* ---------------- BUTTON -> QUERY SETUP ----------------*/
function setupButtons() {
    const btns = {
        "queryFlightBtn": queryFlightBooking,
        "queryHotelBtn": queryHotelBooking,
        "queryPassengersBtn": queryPassengers,
        "querySepBookingsBtn": querySeptemberBookings,
        "queryBySSNBtn": queryBySSN,

        // ADMIN
        "adminTexasFlightsBtn": adminFlightsFromTexasSepOct,
        "adminTexasNoInfantsBtn": adminFlightsFromTexasNoInfant,
        "adminTexasHotelsBtn": adminHotelsInTexasSepOct,
        "adminMostExpensiveHotelsBtn": adminMostExpensiveHotels,
        "adminMostExpensiveFlightsBtn": adminMostExpensiveFlights,
        "adminInfantFlightsBtn": adminFlightsWithInfant,
        "adminInfantFiveKidsBtn": adminFlightsWithInfantAnd5Children,
        "adminCAArrivalsBtn": adminFlightsArrivingCaliforniaSepOct
    };

    for (let id in btns) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", btns[id]);
    }
}

// Import flights data (Admin function)
function importFlights() {
    // TODO: Call import_flights.php API
    fetch('import_flights.php', {
        method: 'POST'
    })
}

// Import hotels data (Admin function)
function importHotels() {
    // TODO: Call import_hotels.php API
    fetch('import_hotels.php', {
        method: 'POST'
    })
}

/* ---------------- GENERIC AJAX HELPER ----------------*/
function sendQuery(url, params = {}) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    }).then(r => r.text());
}

/* 
Query functions (Regular users) 
*/
function queryFlightBooking() {
    // TODO: Query by flight-booking-id
    const id = document.getElementById("flightBookingId").value;
    if (!id) {
        alert("Enter a booking ID.");
        return;
    }
    sendQuery("account_queries.php", { 
        action: "flight_by_id",
        flight_booking_id: id 
    })
    .then(data => displayResult(data));
}

function queryHotelBooking() {
    // TODO: Query by hotel-booking-id
    const id = document.getElementById("hotelBookingId").value;
    if (!id) {
        alert("Enter a booking ID.");
        return;
    }
    sendQuery("account_queries.php", { 
        action: "hotel_by_id",
        hotel_booking_id: id 
    })
    .then(data => displayResult(data));
}

function queryPassengers() {
    // TODO: Query passengers by flight-booking-id
    const id = document.getElementById("flightBookingIdPassengers").value;
    if (!id) {
        alert("Enter a booking ID.");
        return;
    }
    sendQuery("account_queries.php", { 
        action: "passengers_by_flight",
        flight_booking_id: id 
    })
    .then(data => displayResult(data));
}

function querySeptemberBookings() {
    // TODO: Query all bookings in September 2024
    sendQuery("account_queries.php", { 
        action: "september_2024",
    })
    .then(data => displayResult(data));
}

function queryBySSN() {
    // TODO: Query bookings by SSN
    const ssn = document.getElementById("ssnQuery").value;
    if (!ssn) {
        alert("Enter a SSN.");
        return;
    }
    sendQuery("account_queries.php", { 
        action: "bookings_by_ssn",
        ssn: ssn 
    })
    .then(data => displayResult(data));
}

/*
 Admin query functions
*/
function adminFlightsFromTexasSepOct() {
    // TODO: Query all booked flights departure from Texas in Sep to Oct 2024
    sendQuery("account_queries.php", { 
        action: "admin_texas_flights",
    })
    .then(data => displayResult(data));
}

function adminFlightsFromTexasNoInfant() {
    // TODO: Query all booked flights from Texas in Sep to Oct 2024 without infants
    sendQuery("account_queries.php", { 
        action: "admin_texas_flights_no_infants",
    })
    .then(data => displayResult(data));
}

function adminHotelsInTexasSepOct() {
    // TODO: Query all booked hotels in Texas in Sep to Oct 2024
    sendQuery("account_queries.php", { 
        action: "admin_texas_hotels",
    })
    .then(data => displayResult(data));
}

function adminMostExpensiveHotels() {
    // TODO: Query all information about most expensive booked hotels
    sendQuery("account_queries.php", { 
        action: "admin_most_expensive_hotels",
    })
    .then(data => displayResult(data));
}

function adminMostExpensiveFlights() {
    // TODO: Query all information about most expensive booked flights
    sendQuery("account_queries.php", { 
        action: "admin_most_expensive_flights",
    })
    .then(data => displayResult(data));
}

function adminFlightsWithInfant() {
    // TODO: Query all booked flights with infants
    sendQuery("account_queries.php", { 
        action: "admin_flights_with_infant",
    })
    .then(data => displayResult(data));
}

function adminFlightsWithInfantAnd5Children() {
    // TODO: Query all booked flights with infants and atleast 5 children
    sendQuery("account_queries.php", { 
        action: "admin_flights_with_infant_and_5_children",
    })
    .then(data => displayResult(data));
}

function adminFlightsArrivingCaliforniaSepOct() {
    // TODO: Query all booked flights arriving in California in Sep to Oct 2024
    sendQuery("account_queries.php", { 
        action: "admin_california_arrivals",
    })
    .then(data => displayResult(data));
}


/* ---------------- OUTPUT RESULT ----------------*/
function displayResult(data) {
    let dataObj = JSON.parse(data);
    console.log(dataObj);

    document.getElementById("result").textContent = JSON.stringify(dataObj, null, 2);
}

document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem("is_admin") !== "1") {
        const adminElements = document.getElementsByClassName("requires-admin");
        for(let i = 0; i < adminElements.length; i++) {
            adminElements[i].style.display = "none";
        }
    } else {
        const adminElements = document.getElementsByClassName("requires-admin");
        for(let i = 0; i < adminElements.length; i++) {
            adminElements[i].style.display = "block";
        }
    }
});