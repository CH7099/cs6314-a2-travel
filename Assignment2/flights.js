const tripSelect = document.getElementById("trip");
const reDate = document.querySelector(".returnLabel");


// Hide return date by default
reDate.style.display = "none";

// Show return date when round-trip is selected
tripSelect.addEventListener("change", function() {
    if (tripSelect.value === "roundtrip") {
        reDate.style.display = "block";
    } else {
        reDate.style.display = "none";
    }
});

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
    var departueDate = document.getElementById("departDate").value;
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
    if (!dateRange.test(departueDate)){
        text = "Departure date must be between Sep 1, 2024 and Dec 1, 2024."
        out.innerHTML = text;
        return
    }

    if (tripType === "roundtrip") {
        if (new Date(returnDate) <= new Date(departueDate)) {
            text = "Return date must be after the departure date."
            out.innerHTML = text;
            return
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
        text = "The number of adults must be an integer from 0 to 4."
        out.innerHTML = text;
        return
    }

    if (!numberRange.test(numberChildren)) {
        text = "The number of children must be an integer from 0 to 4."
        out.innerHTML = text;
        return
    }

    if (!numberRange.test(numberInfants)) {
        text = "The number of infants must be an integer from 0 to 4."
        out.innerHTML = text;
        return
    }

    text = `<h4>All your inputs are valid!</h4>
        <p>Trip type: ${tripType === "roundtrip" ? "Round-trip" : "One-way"}</p>`;

     if (tripType === "roundtrip") {
            text += `<p>Depart Date: ${departueDate}</p>
               <p>Return Date: ${returnDate}</p>`
        } else {
            text += `<p>Depart Date: ${departueDate}</p>`
        }
    text += `<p>From ${originCity} To ${destination}</p>
            <p>Passengers: </p>
            <p>Adults: ${numberAdults}</p>
            <p>Children: ${numberChildren}</p>
            <p>Infants: ${numberInfants}</p>
            `;

    out.innerHTML += text;

    fetch("flights.json")
        .then(response => response.json())
        .then(data => {
            const userOrigin = originCity.trim();
            const userDestination = destination.trim();
            const userDateDepart = departueDate;
            const userDateReturn = returnDate;

            const result = data.filter(flight =>
                flight.origin.toLowerCase() === userOrigin.toLowerCase() &&
                flight.destination.toLowerCase() === userDestination.toLowerCase() &&
                flight.depart_date === userDateDepart
            );

            let displayFlights = result;
            if (result.length === 0) {
                const userDepartDate = new Date(userDateDepart);
                displayFlights = data.filter(flight => {
                    const depDate = new Date(flight.depart_date);
                    const diffTime = Math.abs(depDate - userDepartDate) / (1000 * 60 * 60 * 24);
                    return (
                        flight.origin.toLowerCase() === userOrigin.toLowerCase() &&
                        flight.destination.toLowerCase() === userDestination.toLowerCase() &&
                        diffTime <= 3
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
            const returnDateObj = new Date(userDateReturn);
            const returnFlights = data.filter(flight => {
                const depDate = new Date(flight.depart_date);
                const diffDays = Math.abs(depDate - returnDateObj) / (1000 * 60 * 60 * 24);
                return (
                    flight.origin.toLowerCase() === userDestination.toLowerCase() &&
                    flight.destination.toLowerCase() === userOrigin.toLowerCase() &&
                    diffDays <= 3
                );
            });

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

function addToCart(selectedFlight, passengers, tripType, selectedFlightReturn = null) {
    const cart = {
        flight: selectedFlight,
        passengers: passengers,
        tripType: tripType,
        selectedFlightReturn: selectedFlightReturn,
        addedDate: Date.now()
    };
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Flight added to cart successfully!");
    window.location.href = "cart.html";
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
            const tripType = document.getElementById("trip").value;

            // if oneway, add to cart directly
            if (tripType === "oneway") {
                const passengers = {
                    adults: parseInt(document.getElementById("adults").value),
                    children: parseInt(document.getElementById("children").value),
                    infants: parseInt(document.getElementById("infants").value) ,  
                };
                addToCart(outboundFlight, passengers, tripType, null);
            } else {
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
            addToCart(outboundFlight, passengers, tripType, returnFlight);
        }
    });
});
