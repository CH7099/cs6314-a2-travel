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
    result.innerHTML = "City Name: " + city + "<br>Check-In Date: " + checkin + 
    "<br>Check-Out Date: " + checkout + "<br>Number of Adults: " + adults + "<br>Number of Children: " + children +
    "<br>Number of Infants: " + infants + "<br>Number of Rooms: " + rooms;
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
