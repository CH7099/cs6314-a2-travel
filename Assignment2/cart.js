window.addEventListener("DOMContentLoaded", function() {
    const cartData = localStorage.getItem("cart");
    const flightInfo = document.getElementById("flightinfo");
    const passInfo = document.getElementById("passinfo");
    const totalPriceInfo = document.getElementById("totalpriceinfo");
    if (!cartData) {
        flightInfo.innerHTML = "No flights in cart.";
        return;
    }
    const cart = JSON.parse(cartData);
    const { flight, passengers, tripType, selectedFlightReturn, addedDate } = cart;

    flightInfo.innerHTML = `
        <p>Trip Type: ${tripType}</p>
        <p>Flight: ${flight.flight_id}</p>
        <p>From: ${flight.origin}</p>
        <p>To: ${flight.destination}</p>
        <p>Depart at: ${flight.depart_date} ${flight.depart_time}</p>
        <p>Arrive at: ${flight.arrive_date} ${flight.arrive_time}</p>
        <p>Price per ticket: $${flight.price}</p>
    `;
    
    if (selectedFlightReturn) {
       flightInfo.innerHTML += `
        <p>Return Flight: ${selectedFlightReturn.flight_id}</p>
        <p>From : ${selectedFlightReturn.origin}</p>
        <p>To: ${selectedFlightReturn.destination}</p>
        <p>Depart at: ${selectedFlightReturn.depart_date} ${selectedFlightReturn.depart_time}</p>
        <p>Arrive at: ${selectedFlightReturn.arrive_date} ${selectedFlightReturn.arrive_time}</p>
        <p>Price per ticket: $${selectedFlightReturn.price}</p>
       `;
    }

    passInfo.innerHTML = `
        <p>Adults: ${passengers.adults}</p> 
        <p>Children: ${passengers.children}</p>
        <p>Infants: ${passengers.infants}</p>
    `;

    const price = flight.price;
    const totalPrice = 
        price * passengers.adults +
        price * passengers.children * 0.7 +
        price * passengers.infants * 0.1; 
    totalPriceInfo.innerHTML = `
    <p>Total Price: $${totalPrice}</p>
    `;
    if (selectedFlightReturn) {
        totalPrice += (selectedFlightReturn.price * passengers.adults
        + selectedFlightReturn.price * passengers.children * 0.7
        + selectedFlightReturn.price * passengers.infants * 0.1);
        totalPriceInfo.innerHTML += `
        <p>Total Price: $${totalPrice}</p>
        `;
    }
});