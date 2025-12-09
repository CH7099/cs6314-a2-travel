function loadCart(){
    
    loadFlight();   // Load flight info
    loadCar();      // Load car info
    loadHotel();    // Load hotel info
}

// Function to get user ID
function getUserID() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "data/user.json", false);
    xhttp.send();

    return JSON.parse(xhttp.responseText).User["user-id"];
}

//Function to load/display hotel booking information
function loadHotel(){
    //Retrieve user information from json file
    const xhttp1 = new XMLHttpRequest();
    xhttp1.open("GET", "data/hotel.json", true);
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

// Function to load/display car rental booking information
function loadCar() {
    console.log("Loading car booking information...");
    // Retrieve user information from xml file
    const user = getUserID();
    console.log("User ID:", user);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "data/carsBooked.xml", true);
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const xml = xhttp.responseXML;
            const carsBooked = xml.getElementsByTagName("Booking");
            

            for (let i = 0; i < carsBooked.length; i++) {
                const userID = carsBooked[i].getElementsByTagName("User-id")[0].textContent;
                console.log("Current user id: " + user + " VS Looking up user id: " + userID);
                // Get user data
                if (userID == user) {
                    console.log("Got user data");
                    const bookID = carsBooked[i].getElementsByTagName("BookingID")[0].textContent;
                    const carID = carsBooked[i].getElementsByTagName("CarID")[0].textContent;
                    const city = carsBooked[i].getElementsByTagName("City")[0].textContent;
                    const type = carsBooked[i].getElementsByTagName("Type")[0].textContent;
                    const checkIn = carsBooked[i].getElementsByTagName("CheckinDate")[0].textContent;
                    const checkOut = carsBooked[i].getElementsByTagName("CheckoutDate")[0].textContent;
                    const price = carsBooked[i].getElementsByTagName("PricePerDay")[0].textContent;
                    const total = carsBooked[i].getElementsByTagName("TotalPrice")[0].textContent;

                    document.getElementById("carinfo").innerHTML =
                    "User-ID: " + userID + "<br>"+
                    "Booking Number: " + bookID + "<br>"+
                    "Car-ID: " + carID + "<br>"+
                    "City: " + city + "<br>" +
                    "Car Type: " + type + "<br>" +
                    "Check-In Date: " + checkIn + "<br>" +
                    "Check-Out Date: " + checkOut + "<br>" + 
                    "Price per Day: $" + price + "<br>"+
                    "Total Price: $" + total + "<br>";
                }
            }
        }
    };
    xhttp.send();
}

function loadFlight(){
    const flightInfo = document.getElementById("flightinfo");
    const passInfo = document.getElementById("passinfo");
    const totalPriceInfo = document.getElementById("totalpriceinfo");
    const bookingInfo = document.getElementById("bookinginfo");

    if (!flightInfo || !passInfo || !totalPriceInfo) {
        console.error("Required DOM elements not found in cart page");
        return;
    }

    // First, check if there are flights in cart (priority: show cart first)
    const cartFlights = localStorage.getItem("cart");
    if (cartFlights) {
        // Clear booking info if cart exists
        if (bookingInfo) bookingInfo.innerHTML = "";
        // Continue to display cart information below
    } else {
        // No cart, check if there are booked flights (from previous booking)
        const bookedFlights = localStorage.getItem("booked_flights");
        if (bookedFlights) {
            try {
                const bookingData = JSON.parse(bookedFlights);
                displayBookingInfo(bookingData);
                // Hide Book button since already booked
                const bookBtnContainer = document.getElementById("bookFlightBtnContainer");
                if (bookBtnContainer) {
                    bookBtnContainer.style.display = "none";
                }
                return;
            } catch (error) {
                console.error("Error parsing booked flights:", error);
            }
        }
        
        // No cart and no booked flights
        flightInfo.innerHTML = "No flights in cart.";
        // Hide Book button if no flights
        const bookBtnContainer = document.getElementById("bookFlightBtnContainer");
        if (bookBtnContainer) {
            bookBtnContainer.style.display = "none";
        }
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        if (bookingInfo) bookingInfo.innerHTML = "";
        
        // Show "Selected Flights:", "Total Price:", and "Passenger Information:" container when cart is empty
        const selectedFlightsTitle = document.getElementById("selectedFlightsTitle");
        const totalPriceTitle = document.getElementById("totalPriceTitle");
        const passengerInfoContainer = document.getElementById("passengerInfoContainer");
        if (selectedFlightsTitle) selectedFlightsTitle.style.display = "block";
        if (totalPriceTitle) totalPriceTitle.style.display = "block";
        if (passengerInfoContainer) passengerInfoContainer.style.display = "block";
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
    
    // Show Book button if flight is in cart
    const bookBtnContainer = document.getElementById("bookFlightBtnContainer");
    if (bookBtnContainer) {
        bookBtnContainer.style.display = "block";
    }
    
    // Show "Selected Flights:", "Total Price:", and "Passenger Information:" container when cart has items
    const selectedFlightsTitle = document.getElementById("selectedFlightsTitle");
    const totalPriceTitle = document.getElementById("totalPriceTitle");
    const passengerInfoContainer = document.getElementById("passengerInfoContainer");
    if (selectedFlightsTitle) selectedFlightsTitle.style.display = "block";
    if (totalPriceTitle) totalPriceTitle.style.display = "block";
    if (passengerInfoContainer) passengerInfoContainer.style.display = "block";
    
    // Clear booking info when showing cart
    if (bookingInfo) bookingInfo.innerHTML = "";
}

// Function to display booking information
function displayBookingInfo(bookingData) {
    const flightInfo = document.getElementById("flightinfo");
    const passInfo = document.getElementById("passinfo");
    const totalPriceInfo = document.getElementById("totalpriceinfo");
    const bookingInfo = document.getElementById("bookinginfo");
    
    if (!flightInfo || !passInfo || !totalPriceInfo) {
        console.error("Required DOM elements not found");
        return;
    }
    
    let html = `<h3>Booking Confirmed</h3>`;
    html += `<p><strong>Booking Number:</strong> ${bookingData.booking_number}</p>`;
    
    // Display outbound flight booking
    if (bookingData.outbound_booking) {
        const ob = bookingData.outbound_booking;
        html += `<h4>Outbound Flight:</h4>`;
        html += `<p><strong>Flight Booking ID:</strong> ${ob.booking_id}</p>`;
        html += `<p><strong>Flight ID:</strong> ${ob.flight_id}</p>`;
        html += `<p><strong>Route:</strong> ${ob.origin} → ${ob.destination}</p>`;
        html += `<p><strong>Departure:</strong> ${ob.departure_date} ${ob.departure_time}</p>`;
        html += `<p><strong>Arrival:</strong> ${ob.arrival_date} ${ob.arrival_time}</p>`;
        html += `<p><strong>Total Price:</strong> $${ob.total_price.toFixed(2)}</p>`;
        
        // Display tickets for outbound flight
        if (ob.tickets && ob.tickets.length > 0) {
            html += `<h4>Tickets:</h4>`;
            ob.tickets.forEach((ticket, index) => {
                html += `<div style="margin-left: 20px; margin-bottom: 10px; padding-left: 10px;">`;
                html += `<p><strong>Ticket ${index + 1}:</strong></p>`;
                html += `<p>Ticket ID: ${ticket.ticket_id}</p>`;
                html += `<p>Flight Booking ID: ${ticket.flight_booking_id}</p>`;
                html += `<p>SSN: ${ticket.SSN}</p>`;
                html += `<p>Passenger: ${ticket.first_name} ${ticket.last_name}</p>`;
                html += `<p>Date of Birth: ${ticket.date_of_birth}</p>`;
                html += `<p>Ticket Price: $${ticket.price.toFixed(2)}</p>`;
                html += `</div>`;
            });
        }
    }
    
    // Display return flight booking if exists
    if (bookingData.return_booking) {
        const rb = bookingData.return_booking;
        html += `<h4>Return Flight Booking:</h4>`;
        html += `<p><strong>Flight Booking ID:</strong> ${rb.booking_id}</p>`;
        html += `<p><strong>Flight ID:</strong> ${rb.flight_id}</p>`;
        html += `<p><strong>Route:</strong> ${rb.origin} → ${rb.destination}</p>`;
        html += `<p><strong>Departure:</strong> ${rb.departure_date} ${rb.departure_time}</p>`;
        html += `<p><strong>Arrival:</strong> ${rb.arrival_date} ${rb.arrival_time}</p>`;
        html += `<p><strong>Total Price:</strong> $${rb.total_price.toFixed(2)}</p>`;
        
        // Display tickets for return flight
        if (rb.tickets && rb.tickets.length > 0) {
            html += `<h4>Tickets:</h4>`;
            rb.tickets.forEach((ticket, index) => {
                html += `<div style="margin-left: 20px; margin-bottom: 10px; padding-left: 10px;">`;
                html += `<p><strong>Ticket ${index + 1}:</strong></p>`;
                html += `<p>Ticket ID: ${ticket.ticket_id}</p>`;
                html += `<p>Flight Booking ID: ${ticket.flight_booking_id}</p>`;
                html += `<p>SSN: ${ticket.SSN}</p>`;
                html += `<p>Passenger: ${ticket.first_name} ${ticket.last_name}</p>`;
                html += `<p>Date of Birth: ${ticket.date_of_birth}</p>`;
                html += `<p>Ticket Price: $${ticket.price.toFixed(2)}</p>`;
                html += `</div>`;
            });
        }
    }
    
    // Display total price
    html += `<h4>Total Booking Price: $${bookingData.total_price.toFixed(2)}</h4>`;
    
    // Display in bookinginfo div if exists, otherwise in flightinfo
    if (bookingInfo) {
        bookingInfo.innerHTML = html;
        flightInfo.innerHTML = "";
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        
        // Hide "Selected Flights:" and "Total Price:" titles when booking is confirmed
        const selectedFlightsTitle = document.getElementById("selectedFlightsTitle");
        const totalPriceTitle = document.getElementById("totalPriceTitle");
        if (selectedFlightsTitle) selectedFlightsTitle.style.display = "none";
        if (totalPriceTitle) totalPriceTitle.style.display = "none";
        
        // Hide the entire "Passenger Information:" container to avoid blank space
        const passengerInfoContainer = document.getElementById("passengerInfoContainer");
        if (passengerInfoContainer) passengerInfoContainer.style.display = "none";
    } else {
        flightInfo.innerHTML = html;
        passInfo.innerHTML = "";
        totalPriceInfo.innerHTML = "";
        
        // Hide "Selected Flights:" and "Total Price:" titles when booking is confirmed
        const selectedFlightsTitle = document.getElementById("selectedFlightsTitle");
        const totalPriceTitle = document.getElementById("totalPriceTitle");
        if (selectedFlightsTitle) selectedFlightsTitle.style.display = "none";
        if (totalPriceTitle) totalPriceTitle.style.display = "none";
        
        // Hide the entire "Passenger Information:" container to avoid blank space
        const passengerInfoContainer = document.getElementById("passengerInfoContainer");
        if (passengerInfoContainer) passengerInfoContainer.style.display = "none";
    }
}
/*
document.addEventListener("DOMContentLoaded", ()=>{
    loadCart();
    
    // Add event listener for Book Flight button
    const bookFlightBtn = document.getElementById("bookFlightBtn");
    if (bookFlightBtn) {
        bookFlightBtn.addEventListener("click", function() {
            bookFlight();
        });
    }
});

function bookFlight() {
    const cartFlights = localStorage.getItem("cart");
    if (!cartFlights) {
        alert("No flights in cart to book.");
        return;
    }

    let cartFlightsData;
    try {
        cartFlightsData = JSON.parse(cartFlights);
    } catch (error) {
        console.error("Error parsing cart data:", error);
        alert("Error loading cart data. Please try again.");
        return;
    }

    // Validate cart data
    if (!cartFlightsData || !cartFlightsData.flight || !cartFlightsData.passengers || !cartFlightsData.passengersDetails) {
        alert("Cart data is incomplete. Please add flights again.");
        return;
    }

    // Get user_id
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("User ID not found. Please log in again.");
        return;
    }

    // Get user phone (if available, otherwise will be fetched from backend)
    const user_phone = localStorage.getItem("user_phone");

    // Prepare booking data
    const flight = cartFlightsData.flight;
    const selectedFlightReturn = cartFlightsData.selectedFlightReturn || null;
    const passengers = cartFlightsData.passengers;
    const passengersDetails = cartFlightsData.passengersDetails;

    // Calculate total price
    const outboundPrice = parseFloat(flight.price) || 0;
    const adults = parseInt(passengers.adults) || 0;
    const children = parseInt(passengers.children) || 0;
    const infants = parseInt(passengers.infants) || 0;
    
    let totalPrice = 
        outboundPrice * adults +
        outboundPrice * children * 0.7 +
        outboundPrice * infants * 0.1;

    if (selectedFlightReturn && selectedFlightReturn.price) {
        const returnPrice = parseFloat(selectedFlightReturn.price) || 0;
        totalPrice += (
            returnPrice * adults +
            returnPrice * children * 0.7 +
            returnPrice * infants * 0.1
        );
    }

    // Prepare booking request
    const bookingData = {
        action: "book",
        user_id: user_id,
        user_phone: user_phone,
        flight: flight,
        return_flight: selectedFlightReturn,
        passengers: passengers,
        passengers_details: passengersDetails,
        total_price: totalPrice.toFixed(2)
    };

    // Send booking request to backend
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "flights.php", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    const response = JSON.parse(xhttp.responseText);
                    if (response.success) {
                        // Save booking information to localStorage
                        const bookingData = {
                            booking_number: response.booking_number,
                            outbound_booking: response.outbound_booking,
                            return_booking: response.return_booking,
                            total_price: response.total_price
                        };
                        localStorage.setItem("booked_flights", JSON.stringify(bookingData));
                        
                        // Clear cart after successful booking
                        localStorage.removeItem("cart");
                        
                        alert("Flight booked successfully! Booking Number: " + response.booking_number);
                        
                        // Reload cart page to show booking information
                        window.location.reload();
                    } else {
                        alert("Booking failed: " + (response.error || "Unknown error"));
                    }
                } catch (error) {
                    console.error("Error parsing response:", error);
                    alert("Error processing booking response. Please try again.");
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhttp.responseText);
                    alert("Booking failed: " + (errorResponse.error || "Server error"));
                } catch (error) {
                    alert("Error contacting server. Status: " + xhttp.status);
                }
});
*/

document.addEventListener("DOMContentLoaded", () => {
    loadHotelMySQL();
});

function loadHotelMySQL() {
    const hotelBookingID = localStorage.getItem("hotel_booking_id");

    if (!hotelBookingID) {
        document.getElementById("hotelinfo").innerHTML = "No hotel booking found.";
        return;
    }

    console.log("Loading hotel info with booking ID:", hotelBookingID);

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "hotel_cart.php", true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    const response = JSON.parse(this.responseText);

                    if (!response.success) {
                        document.getElementById("hotelinfo").innerHTML =
                            "Error: " + (response.message || "Unknown error.");
                        return;
                    }

                    // Hotel Data
                    const hotel = response.hotel;
                    const guests = response.guests;

                    let html = `
                        <strong>Booking Number:</strong> ${hotel.hotel_booking_id}<br>
                        <strong>Hotel ID:</strong> ${hotel.hotel_id}<br>
                        <strong>Hotel Name:</strong> ${hotel.hotel_name}<br>
                        <strong>City:</strong> ${hotel.city}<br>
                        <strong>Price per Night:</strong> $${hotel.price_per_night}<br>
                        <strong>Number of Rooms:</strong> ${hotel.number_of_rooms}<br>
                        <strong>Check-In:</strong> ${hotel.check_in_date}<br>
                        <strong>Check-Out:</strong> ${hotel.check_out_date}<br>
                        <strong>Total Price:</strong> $${hotel.total_price}<br><br>
                        <h4>Guests:</h4>
                    `;

                    if (guests.length === 0) {
                        html += "<p>No guests found for this booking.</p>";
                    } else {
                        html += "<ul>";
                        guests.forEach(g => {
                            html += `
                                <li>
                                    ${g.first_name} ${g.last_name}<br>
                                    SSN: ${g.SSN}<br>
                                    DOB: ${g.date_of_birth}<br>
                                    Category: ${g.category}
                                </li><br>
                            `;
                        });
                        html += "</ul>";
                    }

                    document.getElementById("hotelinfo").innerHTML = html;

                } catch (err) {
                    console.error("JSON parsing error:", err);
                    document.getElementById("hotelinfo").innerHTML =
                        "Error loading hotel data.";
                }
            } else {
                document.getElementById("hotelinfo").innerHTML =
                    "Server Error: Unable to load hotel booking.";
            }
        }
    };

    xhttp.send(JSON.stringify(bookingData));
    // Send JSON request
    xhttp.send(JSON.stringify({
        hotel_booking_id: hotelBookingID
    }));
}