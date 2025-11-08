function loadCart(){
    
    loadFlight(); //Load flight info
    loadHotel(); //Load hotel info
}

//Function to load/display hotel booking information
function loadHotel(){
    //Retrieve user information from json file
    const xhttp1 = new XMLHttpRequest();
    xhttp1.open("GET", "hotel.json", true);
    xhttp1.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const hotel = JSON.parse(this.responseText);
                    console.log("Loaded hotel data:", hotel); //Log loaded hotel data (debugging)
                    document.getElementById("hotelinfo").innerHTML =
                        "User-ID: " + hotel.Hotel["user-id"] + "<br>" +
                        "Booking Number: " + hotel.Hotel["booking-number"] + "<br>" +
                        "Hotel Name: " + hotel.Hotel["hotel-name"] + "<br>" +
                        "City: " + hotel.Hotel["city"] + "<br>" +
                        "Check-In Date: " + hotel.Hotel["check-in"] + "<br>" +
                        "Check-Out Date: " + hotel.Hotel["check-out"] + "<br>" +
                        "Number of Rooms: " + hotel.Hotel["rooms"] + "<br>" +
                        "Price per Night: $" + hotel.Hotel["price-per-night"] + "<br>" +
                        "Total Price: $" + hotel.Hotel["total-price"];
        }
    };
    xhttp1.send();
}


function loadFlight(){
    const flightInfo = document.getElementById("flightinfo");
    const passInfo = document.getElementById("passinfo");
    const totalPriceInfo = document.getElementById("totalpriceinfo");

    if (!flightInfo || !passInfo || !totalPriceInfo) {
        console.error("Required DOM elements not found in cart page");
        return;
    }

    const cartFlights = localStorage.getItem("cart");
    if (!cartFlights) {
        flightInfo.innerHTML = "No flights in cart.";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        return;
    }

    // Parse cart data with error handling
    let cartFlightsData;
    try {
        cartFlightsData = JSON.parse(cartFlights);
    } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        flightInfo.innerHTML = "Error loading cart data. Please try again.";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        return;
    }

    // Validate required cart data
    if (!cartFlightsData || !cartFlightsData.flight || !cartFlightsData.passengers) {
        console.error("Invalid cart data structure:", cartFlightsData);
        flightInfo.innerHTML = "Cart data is incomplete. Please add flights again.";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        return;
    }

    const flight = cartFlightsData.flight;
    const passengers = cartFlightsData.passengers;
    const tripType = cartFlightsData.tripType || "oneway";
    const selectedFlightReturn = cartFlightsData.selectedFlightReturn || null;

    // Validate flight object
    if (!flight.flight_id || !flight.price || !flight.origin || !flight.destination) {
        console.error("Flight data is incomplete:", flight);
        flightInfo.innerHTML = "Flight information is incomplete.";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        return;
    }

    // Validate passengers object
    if (typeof passengers.adults === 'undefined' || 
        typeof passengers.children === 'undefined' || 
        typeof passengers.infants === 'undefined') {
        console.error("Passenger data is incomplete:", passengers);
        flightInfo.innerHTML = "Passenger information is incomplete.";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        return;
    }

    // Get user_id 
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        console.error("User ID not found in localStorage. Make sure you've visited the flights page first.");
    } else {
        console.log("Retrieved user_id from localStorage:", user_id);
    }

    // Get booking_number(s)
    let booking_number = null;
    if (cartFlightsData.bookingNumbers && cartFlightsData.bookingNumbers.length > 0) {
        // Multiple booking numbers for roundtrip
        booking_number = cartFlightsData.bookingNumbers.join(", ");
        console.log("Retrieved booking numbers from cart:", cartFlightsData.bookingNumbers);
    } else if (cartFlightsData.bookingNumber) {
        // Single booking number
        booking_number = cartFlightsData.bookingNumber;
        console.log("Retrieved bookingNumber from cart:", booking_number);
    } else {
        console.log("Booking number not found.");
        booking_number = "Pending";
    }
    
    //Display outbound flight information
    flightInfo.innerHTML = `
        <p>User-ID: ${user_id || "Not available"}</p>
        <p>Booking Number: ${booking_number || "Not available"}</p>
        <p>Trip Type: ${tripType === "roundtrip" ? "Round-trip" : "One-way"}</p>
        <p>Flight Number: ${flight.flight_id}</p>
        <p>From: ${flight.origin}</p>
        <p>To: ${flight.destination}</p>
        <p>Depart at: ${flight.depart_date} ${flight.depart_time}</p>
        <p>Arrive at: ${flight.arrive_date} ${flight.arrive_time}</p>
        <p>Price per ticket: $${flight.price}</p>
    `;
    
    //Display return flight information if available
    if (selectedFlightReturn && selectedFlightReturn.flight_id) {
       flightInfo.innerHTML += ` <br>
        <p>Return Flight: ${selectedFlightReturn.flight_id}</p>
        <p>From: ${selectedFlightReturn.origin}</p>
        <p>To: ${selectedFlightReturn.destination}</p>
        <p>Depart at: ${selectedFlightReturn.depart_date} ${selectedFlightReturn.depart_time}</p>
        <p>Arrive at: ${selectedFlightReturn.arrive_date} ${selectedFlightReturn.arrive_time}</p>
        <p>Price per ticket: $${selectedFlightReturn.price}</p>
       `;
    }

    //Display passenger information
    passInfo.innerHTML = `
        <p>Adults: ${passengers.adults}</p> 
        <p>Children: ${passengers.children}</p>
        <p>Infants: ${passengers.infants}</p>
    `;
    if (cartFlightsData.passengersDetails && cartFlightsData.passengersDetails.length > 0) {
        let detailsHTML = "<h4>Passenger Details:</h4><ol>";
        cartFlightsData.passengersDetails.forEach(p => {
            const dob = p.date_of_birth || "N/A";
            detailsHTML += `<li>${p.first_name} ${p.last_name} (SSN: ${p.ssn}, Date of Birth: ${dob})</li>`;
        });
        detailsHTML += "</ol>";
        passInfo.innerHTML += detailsHTML;       
    }

    //Calculate total price for outbound flight
    const outboundPrice = parseFloat(flight.price) || 0;
    const adults = parseInt(passengers.adults) || 0;
    const children = parseInt(passengers.children) || 0;
    const infants = parseInt(passengers.infants) || 0;
    
    let totalPrice = 
        outboundPrice * adults +
        outboundPrice * children * 0.7 +
        outboundPrice * infants * 0.1; 

    //Add return flight price if available
    if (selectedFlightReturn && selectedFlightReturn.price) {
        const returnPrice = parseFloat(selectedFlightReturn.price) || 0;
        totalPrice += (
            returnPrice * adults +
            returnPrice * children * 0.7 +
            returnPrice * infants * 0.1
        );
    }
    
    //Display total price
    totalPriceInfo.innerHTML = `<p>Total Price: $${totalPrice.toFixed(2)}</p>`;
}

document.addEventListener("DOMContentLoaded", ()=>{
    loadCart();
});