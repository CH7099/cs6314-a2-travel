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


    text = "All your inputs are valid! <br>" + 
            "Trip type: " + (tripType === "roundtrip" ? "Round-trip" : "One-way") + "<br>";
            
    if (tripType === "roundtrip") {
        text += "Depart Date: " + departueDate + "<br> Return Date: " + returnDate + "<br>";
    } else {
        text += "Depart Date: " + departueDate + "<br>";
        }         
            
            
    text += "From " + originCity + " To " + destination + "<br>" +
            "Passengers: <br> Adults: " + numberAdults + "; Children: " + numberChildren +
            "; Infants: " + numberInfants + "<br>";
            out.innerHTML = text;



}