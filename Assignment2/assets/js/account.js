document.addEventListener("DOMContentLoaded", function() {
    initAccountPage();
});

/**
 * Initialize account page
 */
function initAccountPage() {
    // Temporary: Assume user is logged in (login system not ready yet)
    // Check admin status (temporary: hardcoded check)
    const isAdmin = checkAdminStatus();
    
    // Show/hide admin functions
    if (isAdmin) {
        showAdminFunctions();
    } else {
        hideAdminFunctions();
    }
}

// Temporary: Check admin status
// For testing: You can manually set localStorage.setItem("is_admin", "true") in browser console
function checkAdminStatus() {
    // Option 1: Check localStorage flag (for testing)
    const adminFlag = localStorage.getItem("is_admin");
    if (adminFlag === "true") {
        return true;
    }
    
    // Option 2: Check phone from localStorage (if available)
    const userPhone = localStorage.getItem("user_phone");
    if (userPhone === "222-222-2222") {
        return true;
    }
    
    // Option 3: Hardcoded for testing (remove this later)
    // return true; // Uncomment this line to always show admin functions for testing
    
    return false;
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


// Import flights data (Admin function)
function importFlights() {
    // TODO: Call import_flights.php API
}

// Import hotels data (Admin function)
function importHotels() {
    // TODO: Call import_hotels.php API
}

/* 
Query functions (Regular users) 
*/
function queryFlightBooking() {
    // TODO: Query by flight-booking-id
}

function queryHotelBooking() {
    // TODO: Query by hotel-booking-id
}

function queryPassengers() {
    // TODO: Query passengers by flight-booking-id
}

function querySeptemberBookings() {
    // TODO: Query all bookings in September 2024
}

function queryBySSN() {
    // TODO: Query bookings by SSN
}

/*
 Admin query functions
*/

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
    
    document.getElementById("loadHotelsBtn").addEventListener("click", function() {
        const resultDiv = document.getElementById("result");

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "load_hotels.php", true);

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    resultDiv.innerHTML = xhttp.responseText;
                } else {
                    resultDiv.innerHTML = "Error contacting server: " + xhttp.status;
                }
            }
        };

        xhttp.send();
    });
    document.getElementById("loadFlightsBtn").addEventListener("click", function() {
        const flightsResultDiv = document.getElementById("flightsResult");
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "load_flights.php", true);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    flightsResultDiv.innerHTML = xhttp.responseText;
                } else {
                    flightsResultDiv.innerHTML = "Error contacting server: " + xhttp.status;
                }
            }
        };
        xhttp.send();
    });
});