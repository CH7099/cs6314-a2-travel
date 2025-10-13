function dateTimeNow(){
    var date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const localDateTime = date.toLocaleString(undefined, options);
    document.getElementById("datetimenow").innerHTML = localDateTime;
}
setInterval(dateTimeNow, 1000);