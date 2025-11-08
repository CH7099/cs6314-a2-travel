//create unique user id
let userId = localStorage.getItem("user_id");
if (!userId) {
    userId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("user_id", userId);
}

const tripSelect = document.getElementById("trip");
const reDate = document.querySelector(".returnLabel");


// Hide return date by default
if (reDate) {
    reDate.style.display = "none";
}

// Show return date when round-trip is selected
if (tripSelect && reDate) {
    tripSelect.addEventListener("change", function() {
        if (tripSelect.value === "roundtrip") {
            reDate.style.display = "block";
        } else {
            reDate.style.display = "none";
        }
    });
}

// click to show the passengers form
function passengerToggle() {
    var form = document.getElementById("passengersForm");
    var btn = document.getElementById("passengersBtn");

    if (form.hasAttribute("hidden")) {
        form.removeAttribute("hidden");
    } else {
        form.setAttribute("hidden", "");
    }
}


function validateInput() {
    var departureDate = document.getElementById("departDate").value;
    var returnDate = document.getElementById("returnDate").value;
    var originCity = document.getElementById("from").value;
    var destination = document.getElementById("to").value;
    var numberAdults = document.getElementById("adults").value;
    var numberChildren = document.getElementById("children").value;
    var numberInfants = document.getElementById("infants").value;
    var tripType = document.getElementById("trip").value;
    var out = document.getElementById("out");
    var text = " ";
    out.innerHTML = " ";

    const TX = [
        "Houston", "Dallas", "Austin", "San Antonio", "El Paso", "Fort Worth", "Arlington", "Corpus Christi",
        "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville",
        "Pasadena", "Frisco", "McKinney", "Killeen", "McAllen", "Waco", "Carrollton", "Denton", "Midland"
    ]

    const CA = [
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
    ]

    const allowedCities = TX.concat(CA);

    //Regex rules
    var dateRange = /^2024-(?:09-(?:0[1-9]|[12][0-9]|30)|10-(?:0[1-9]|[12][0-9]|3[01])|11-(?:0[1-9]|[12][0-9]|30)|12-01)$/;
    var locaRange = /^[A-Za-z .'-]+,\s*(?:TX|Texas|CA|California)$/i;
    var numberRange = /^[0-4]$/;
  

    //Departure data validation
    if (!dateRange.test(departureDate)){
        text = "Departure date must be between Sep 1, 2024 and Dec 1, 2024.";
        out.innerHTML = text;
        return;
    }

    if (tripType === "roundtrip") {
        if (new Date(returnDate) <= new Date(departureDate)) {
            text = "Return date must be after the departure date.";
            out.innerHTML = text;
            return;
        }
    }
    // validate city
    function isValidCity(input) {
        const city = input.split(",")[0].trim().toLowerCase();
        return allowedCities.map(c => c.toLowerCase()).includes(city);
    }

    if (!locaRange.test(originCity) || !isValidCity(originCity)) {
        text = "Origin city must be in Texas or California (e.g., Dallas, TX or San Jose, CA).";
        out.innerHTML = text;
        return;
    }

    if (!locaRange.test(destination) || !isValidCity(destination)) {
        text = "Destination city must be in Texas or California (e.g., Dallas, TX or San Jose, CA).";
        out.innerHTML = text;
        return;
    }

    if (!numberRange.test(numberAdults)) {
        text = "The number of adults must be an integer from 0 to 4.";
        out.innerHTML = text;
        return;
    }

    if (!numberRange.test(numberChildren)) {
        text = "The number of children must be an integer from 0 to 4.";
        out.innerHTML = text;
        return;
    }

    if (!numberRange.test(numberInfants)) {
        text = "The number of infants must be an integer from 0 to 4.";
        out.innerHTML = text;
        return;
    }

    // Validate that at least one passenger is selected
    const totalPassengers = parseInt(numberAdults) + parseInt(numberChildren) + parseInt(numberInfants);
    if (totalPassengers === 0) {
        text = "At least one passenger (adult, child, or infant) is required.";
        out.innerHTML = text;
        return;
    }

    text = `<h4>All your inputs are valid!</h4>
        <p>Trip type: ${tripType === "roundtrip" ? "Round-trip" : "One-way"}</p>`;

     if (tripType === "roundtrip") {
            text += `<p>Depart Date: ${departureDate}</p>
               <p>Return Date: ${returnDate}</p>`;
        } else {
            text += `<p>Depart Date: ${departureDate}</p>`;
        }
    text += `<p>From ${originCity} To ${destination}</p>
            <p>Passengers: </p>
            <p>Adults: ${numberAdults}</p>
            <p>Children: ${numberChildren}</p>
            <p>Infants: ${numberInfants}</p>
            `;

    out.innerHTML += text;

    // normalize city
    function normalizeLocation(location) {
        if (!location) return "";
        const parts = location.split(",").map(p => p.trim());
        if (parts.length !== 2) return location.toLowerCase();
        let city = parts[0].toLowerCase();
        let state = parts[1].toLowerCase();
        // Normalize state abbreviations
        if (state === "texas") state = "tx";
        if (state === "california") state = "ca";
        return `${city}, ${state}`;
    }

    fetch("data/flights.json")
        .then(response => response.json())
        .then(data => {
            const userOrigin = originCity.trim();
            const userDestination = destination.trim();
            const userDateDepart = departureDate;
            const userDateReturn = returnDate;

            const normalizedUserOrigin = normalizeLocation(userOrigin);
            const normalizedUserDestination = normalizeLocation(userDestination);

            const result = data.filter(flight => {  
                const normalizedFlightOrigin = normalizeLocation(flight.origin);
                const normalizedFlightDestination = normalizeLocation(flight.destination);
                return (
                    normalizedFlightOrigin === normalizedUserOrigin &&
                    normalizedFlightDestination === normalizedUserDestination &&
                    flight.depart_date === userDateDepart && flight.available_seats >= totalPassengers
                );
            });

            let displayFlights = result;
            if (result.length === 0) {
                const userDepartDate = new Date(userDateDepart);
                displayFlights = data.filter(flight => {
                    const normalizedFlightOrigin = normalizeLocation(flight.origin);
                    const normalizedFlightDestination = normalizeLocation(flight.destination);
                    const depDate = new Date(flight.depart_date);
                    const diffTime = Math.abs(depDate - userDepartDate) / (1000 * 60 * 60 * 24);
                    return (
                        normalizedFlightOrigin === normalizedUserOrigin &&
                        normalizedFlightDestination === normalizedUserDestination &&
                        diffTime <= 3 && flight.available_seats >= totalPassengers
                    );
                });
            }

            if (displayFlights.length > 0) {
                let html = "<br><h3>Available Flights:</h3><br>";
                displayFlights.forEach(flight => {
                    html += `<div class="flight-item">
                                <h4>Available Flight: ${flight.flight_id}</h4>
                                <p>Origin: ${flight.origin}</p>
                                <p>Destination: ${flight.destination}</p>
                                <p>Depart Date: ${flight.depart_date}</p>
                                <p>Depart Time: ${flight.depart_time}</p>
                                <p>Arrive Date: ${flight.arrive_date}</p>
                                <p>Arrive Time: ${flight.arrive_time}</p>
                                <p>Price: ${flight.price}</p>
                                <p>Available Seats: ${flight.available_seats}</p>
                                <button type="button" class="selectFlight" 
                                    data-id ="${flight.flight_id}">
                                    Select Outbound
                                </button>
                            </div>`;
                });
                window.currentOutboundFlight = displayFlights;
                out.innerHTML += html;
            } else {
                out.innerHTML += "<br><h3>No flights found within ±3 days.</h3>";
            }
        
        // return flights for roundtrip
        if (tripType === "roundtrip") {
            const normalizedReturnOrigin = normalizedUserDestination;
            const normalizedReturnDestination = normalizedUserOrigin;

        let returnFlights = data.filter(flight => {
                const normalizedFlightOrigin = normalizeLocation(flight.origin);
                const normalizedFlightDestination = normalizeLocation(flight.destination);
                return (
                    normalizedFlightOrigin === normalizedReturnOrigin &&
                    normalizedFlightDestination === normalizedReturnDestination &&
                    flight.depart_date === userDateReturn && flight.available_seats >= totalPassengers
                );
            });

        if (returnFlights.length === 0) {
            const returnDateObj = new Date(userDateReturn);
            returnFlights = data.filter(flight => {
            const o = normalizeLocation(flight.origin);
            const d = normalizeLocation(flight.destination);
            const depDate = new Date(flight.depart_date);
            const diffDays = Math.abs(depDate - returnDateObj) / (1000 * 60 * 60 * 24);
            return (
                o === normalizedReturnOrigin &&
                d === normalizedReturnDestination &&
                diffDays <= 3 &&
                flight.available_seats >= totalPassengers
      );
    });
  }

            if (returnFlights.length > 0) {
                let returnHtml = "<br><h3>Available Return Flights:</h3><br>";
                returnFlights.forEach(flight => {
                    returnHtml += `<div class="flight-item">
                                <h4>${flight.flight_id}</h4>
                                <p>Origin: ${flight.origin}</p>
                                <p>Destination: ${flight.destination}</p>
                                <p>Depart Date: ${flight.depart_date}</p>
                                <p>Depart Time: ${flight.depart_time}</p>
                                <p>Arrive Date: ${flight.arrive_date}</p>
                                <p>Arrive Time: ${flight.arrive_time}</p>
                                <p>Price: ${flight.price}</p>
                                <p>Available Seats: ${flight.available_seats}</p>
                                <button type="button" class="selectReturn" 
                                    data-id ="${flight.flight_id}">
                                    Select Return 
                                </button>
                            </div>`;
                });
                window.currentReturnFlight = returnFlights;
                out.innerHTML += returnHtml;
            } else {
                out.innerHTML += "<br><h3>No return flights found within ±3 days.</h3>";
            }
        }
        })
        .catch(error => {
            console.error("Error:", error);
            out.innerHTML += "<br><h3>Failed to load flights.</h3>";
        });
}


function openPassengerModal(totalPassengers, onConfirm) {
  const modal = document.getElementById("passengerModal");
  const container = document.getElementById("passengerFormContainer");
  const confirmBtn = document.getElementById("modalConfirmBtn");
  const cancelBtn = document.getElementById("modalCancelBtn");

  // build dynamic forms
  container.innerHTML = "";
  for (let i = 0; i < totalPassengers; i++) {
    const idx = i + 1;
    const block = document.createElement("div");
    block.classList.add("passenger-block");
    block.innerHTML = `
      <h4>Passenger ${idx}</h4>
      <div class="grid-row">
        <label>
          <span>First Name</span>
          <input type="text" required data-role="first">
        </label>
        <label>
          <span>Last Name</span>
          <input type="text" required data-role="last">
        </label>
      </div>
      <label>
        <span>SSN (###-##-####)</span>
        <input type="text" required data-role="ssn" placeholder="123-45-6789">
      </label>
      <label>
        <span>Date of Birth</span>
        <input type="date" required data-role="date_of_birth">
      </label>
    `;
    container.appendChild(block);
  }

  // show modal
  modal.classList.add("show");

  const cleanup = () => {
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
    modal.classList.remove("show");
  };

  cancelBtn.onclick = () => {
    cleanup();
    alert("Passenger input canceled.");
  };

  confirmBtn.onclick = () => {
    // read & validate
    const blocks = Array.from(container.children);
    const details = [];
    const ssnPattern = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;

    for (const b of blocks) {
      const first = b.querySelector('input[data-role="first"]').value.trim();
      const last  = b.querySelector('input[data-role="last"]').value.trim();
      const ssn   = b.querySelector('input[data-role="ssn"]').value.trim();
      const date_of_birth = b.querySelector('input[data-role="date_of_birth"]').value.trim();

      if (!first || !last || !ssn || !date_of_birth) {
        alert("Please fill out all fields for every passenger.");
        return;
      }
      if (!ssnPattern.test(ssn)) {
        alert("Invalid SSN format. Use ###-##-#### or 9 digits.");
        return;
      }
      details.push({ first_name: first, last_name: last, ssn: ssn, date_of_birth: date_of_birth });
    }

    cleanup();
    onConfirm(details);
  };
}
  
async function addToCart(selectedFlight, passengers, tripType, 
    selectedFlightReturn = null, passengersDetails = null) {
    const totalPassengers = passengers.adults + passengers.children + passengers.infants;
    const seatsNeeded = totalPassengers;
    let bookingNumbers = []

    try {
        // Book outbound
        const bookOutbound = await fetch("flights.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "book",
                user_id: userId,
                flight_id: selectedFlight.flight_id,
                seats: seatsNeeded
            })
        });

        // Read and check outbound booking response
        const outboundResult = await bookOutbound.json();
        
        // Check for errors
        if (!bookOutbound.ok) {
            throw new Error(outboundResult.error || `Outbound flight booking failed with status ${bookOutbound.status}`);
        }
        if (!outboundResult.success) {
            throw new Error(outboundResult.error || "Outbound flight booking failed");
        }

        // Extract booking number
        if (outboundResult.booking && outboundResult.booking.booking_number) {
            bookingNumbers.push(outboundResult.booking.booking_number);
            console.log("Outbound flight booked with booking number:", outboundResult.booking.booking_number);
        } else if (outboundResult.booking_number) {
            // Fallback for direct booking_number in response
            bookingNumbers.push(outboundResult.booking_number);
            console.log("Outbound flight booked with booking number:", outboundResult.booking_number);
        }

        // Roundtrip reservation
        if (selectedFlightReturn && tripType === "roundtrip") {
            const bookReturn = await fetch("flights.php", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "book",
                    user_id: userId,
                    flight_id: selectedFlightReturn.flight_id,
                    seats: seatsNeeded
                })
            });

            // Read and check return booking response
            const returnResult = await bookReturn.json();
            
            // Check for errors
            if (!bookReturn.ok) {
                throw new Error(returnResult.error || `Return flight booking failed with status ${bookReturn.status}`);
            }
            if (!returnResult.success) {
                throw new Error(returnResult.error || "Return flight booking failed");
            }

            // Extract booking number for return flight
            if (returnResult.booking && returnResult.booking.booking_number) {
                bookingNumbers.push(returnResult.booking.booking_number);
                console.log("Return flight booked with booking number:", returnResult.booking.booking_number);
            } else if (returnResult.booking_number) {
                // Fallback for direct booking_number in response
                bookingNumbers.push(returnResult.booking_number);
                console.log("Return flight booked with booking number:", returnResult.booking_number);
            }
        }

            // Store booking numbers in cart
        const cart = {
            flight: selectedFlight,
            passengers: passengers,
            tripType: tripType,
            selectedFlightReturn: selectedFlightReturn,
            bookingNumber: bookingNumbers.length > 0 ? bookingNumbers[0] : null,
            bookingNumbers: bookingNumbers, 
            passengersDetails: passengersDetails,
            addedDate: Date.now()
        };

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Flight added to cart successfully!");
        window.location.href = "cart.html";
        //const totalPassengers = passengers.adults + passengers.children + passengers.infants;

        //openPassengerModal(totalPassengers, (passengersDetails) => {
        //    cart.passengers_details = passengersDetails;
        //    localStorage.setItem("cart", JSON.stringify(cart));
        //    alert("Flight added to cart successfully!");
        //    window.location.href = "cart.html";
        //});


    } catch (error) {
        console.error("Error booking flight:", error);
        alert("Please enter the passenger information");
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const out = document.getElementById("out");
    let outboundFlight = null;
    let returnFlight = null;

    out.addEventListener("click", (e) => {
        // handle outbound flight selection
        if (e.target.classList.contains("selectFlight")) {
            const id = e.target.dataset.id;
            outboundFlight = (window.currentOutboundFlight || []).find(flight => flight.flight_id === id);
            if (!outboundFlight) return;

            const rawTrip = document.getElementById("trip").value.trim().toLowerCase().replace(/[^a-z]/g, "");
            const tripType = rawTrip.trim().toLowerCase().replace(/[^a-z]/g, "");
            
            // debug log
            console.log("Trip type:", tripType, "fight id", outboundFlight.flight_id);


            // if oneway, add to cart directly
            if (tripType === "oneway") {
                const passengers = {
                    adults: parseInt(document.getElementById("adults").value),
                    children: parseInt(document.getElementById("children").value),
                    infants: parseInt(document.getElementById("infants").value) ,  
                };
                const totalPassengers = passengers.adults + passengers.children + passengers.infants;

                openPassengerModal(totalPassengers, (details) => {
                    addToCart(outboundFlight, passengers, tripType, null, details);
                });
            } else {
                // Disable the selected outbound button
                e.target.disabled = true;
                e.target.textContent = "Selected";
                e.target.style.backgroundColor = "#aaa";
                alert("Please select a return flight to complete the roundtrip.");
            }
            return;
        }
        // handle return flight selection
        if (e.target.classList.contains("selectReturn")) {
            const id = e.target.dataset.id;
            returnFlight = (window.currentReturnFlight || []).find(flight => flight.flight_id === id);
            
            const tripType = document.getElementById("trip").value;

            if (!outboundFlight) {
                alert("Please select an outbound flight to complete the roundtrip.");
                return;
            }
            const passengers = {
                adults: parseInt(document.getElementById("adults").value),
                children: parseInt(document.getElementById("children").value),
                infants: parseInt(document.getElementById("infants").value) ,  
            };
            const totalPassengers = passengers.adults + passengers.children + passengers.infants;
            openPassengerModal(totalPassengers, (details) => {
                addToCart(outboundFlight, passengers, tripType, returnFlight, details);
            });
        }
    });
});
