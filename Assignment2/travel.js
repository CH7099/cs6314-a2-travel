var dateInterval; //Interval variable (for date refresh)

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

//DOM listener (at the end for ease-of-access)
document.addEventListener("DOMContentLoaded", ()=>{
    //Check if home page is active; if yes, load live datetime, else clear interval
    if(document.body.id === "home"){
        startInterval();
    } else {
        stopInterval();
    }
});
