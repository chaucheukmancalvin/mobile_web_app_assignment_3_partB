

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {    
	var confirmCallback = function(buttonIndex) {
		if(buttonIndex==1){
			document.location.href="/";
		}
	};
    $("#newEventCancel").on("click",function(){
		navigator.notification.confirm('Do you really want to cancel the new event (all the inputs will be deleted)', confirmCallback,'Cancel', ['Yes', 'No']);
	});

	
}

// add password confirmation
const pw = document.getElementById("resPW");
const rpw = document.getElementById("resRpw");
pw.onchange = validatePW;
rpw.onkeyup = validatePW;

function validatePW() {
    if(pw.value != rpw.value) {rpw.setCustomValidity("Passwords don't match");}
    else {rpw.setCustomValidity('');}
}
