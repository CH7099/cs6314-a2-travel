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
    
    if (!locaRange.test(originCity)) {
        text = "Origin city must be a city in Texas or California."
        out.innerHTML = text;
        return
    }

    if (!locaRange.test(destination)) {
        text = "Destination city must be a city in Texas or California."
        out.innerHTML = text;
        return
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