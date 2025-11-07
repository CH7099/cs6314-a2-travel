function loadCart(){
    
    //loadFlight(); //Load flight info
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

document.addEventListener("DOMContentLoaded", ()=>{
    loadCart();
});