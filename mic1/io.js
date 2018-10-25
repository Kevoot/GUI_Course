window.inputReadyFlag = false;

var inputCallback = function() {
    if(window.inputReadyFlag) {
        window.inputReadyFlag = false;
        var input = document.getElementById("inputData").value;
        document.getElementById("inputData").value = "";
        return input;
    }
    else {
        // Lock it in a loop and wait for the button to be pressed.
        while(!window.inputReadyFlag) {
            alert("Awaiting input");
        }
    }
}

var inputClicked = function() {
    window.inputReadyFlag = true;
}