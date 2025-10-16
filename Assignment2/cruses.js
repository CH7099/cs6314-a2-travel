$(function () {
    const destin = new Set(["alaska", "bahamas", "europe", "mexico"]);
    const minDate = new Date("2024-09-01")
    const maxDate = new Date("2024-12-01")

    $("#btn").on("click", function(e) {
        e.preventDefault();
        var dest = $.trim($("#destination").val()).toLowerCase();
        var from = $("#departFrom").val();
        var to = $("#departTo").val();
        var minDays = $.trim($("#minDays").val());
        var maxDays = $.trim($("#maxDays").val());
        var adults = parseInt($("#adults").val(), 10) || 0;
        var children = parseInt($("#children").val(), 10) || 0;
        var infants = parseInt($("#infants").val(), 10) || 0;
        var rooms = parseInt($("#rooms").val(), 10) || 0;
        
        // validate destination
        if (!destin.has(dest)) {
            $("#out").text("Destination must be Alaska, Bahamas, Europe, or Mexico.");
            return;
        }
      
        var departDate = new Date(from);
        var reDate = new Date(to);

        // validate date
        if (isNaN(departDate) || isNaN(reDate)) {
            $("#out").text("Departing must be between Sep 1, 2024 and Dec 1, 2024.");
            return;
        }

        if (departDate < minDate || departDate > maxDate) {
            $("#out").text("Departing must be between Sep 1, 2024 and Dec 1, 2024.");
            return;
        }
        if (reDate < minDate || reDate > maxDate) {
            $("#out").text("Departing must be between Sep 1, 2024 and Dec 1, 2024.");
            return;
        }

        if (reDate <= departDate) {
            $("#out").text("Return date must be after departure date.");
            return;
        }

        // validate duration
        if (minDays === "" || maxDays === "") {
            $("#out").text("Please enter both minimum and maximum duration days.");
            return;
        }

        if (minDays < 3) {
            $("#out").text("Minimum duration days cannot be less than 3.");
            return;
        }

        if (maxDays > 10) {
            $("#out").text("Maximum duration days cannot be more than 10.");
            return;
        }

        if (parseInt(minDays) > parseInt(maxDays)) {
            $("#out").text("Minimum duration cannot be greater than maximum duration.");
            return;
        }

        // validate guests
        var total = adults + children;
        

        if (total === 0) {
            $("#out").text("At least one adult or child is required.");
            return;
        }

        if (rooms <= 0) {
            $("#out").text("At least one room is required.");
            return;
        }

        var perRoom = total / rooms;

        if (perRoom > 2) {
             $("#out").text("No more than 2 guests in a room except infants.");
             return;
        }



        // Format dates for display
        var departDateStr = departDate.toLocaleDateString();
        var returnDateStr = reDate.toLocaleDateString();

        $("#out").html("All your inputs are valid! <br>" + 
                        "Destination: " + dest + "<br>" +
                        "Departing between " + departDateStr + " and " + returnDateStr + "<br>" +
                        "Duration Days: Min " + minDays + " days, Max " + maxDays + " days<br>" +
                        "Number of guests: Adults (" + adults + "), Children (" + children + 
                        "), Infants (" + infants + ")" + "<br>" +
                        "Number of rooms: " + rooms
                    );
    })
})


