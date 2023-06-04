let isLogged;

localStorage.log;
localStorage.user;

/* ------------------------------- pagecreate ------------------------------- */
var backendUrl = "http://localhost:3000";

var selectedNewEventImage = [];
var formDataOfNewEvent = new FormData();

$(document).on('pagecreate', function() {
	if (localStorage.log == null) {setLog(false);}
	if (localStorage.user == null) {setUser('');}
	if (isLogged) {processLog();}

	// sync external widgets and initialise widgets
	$('[data-role="header"], [data-role="footer"]').toolbar({theme:'c', position: 'fixed', tapToggle: false});
	$('[data-role="popup"]').popup();
	$('[data-role="listview"]').listview();
	$("#newEventImage").change(function(e) {
		e.stopImmediatePropagation();
		selectedNewEventImage = [];
		formDataOfNewEvent.delete("newEventImage");
		for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
			var file = e.originalEvent.srcElement.files[i];
			formDataOfNewEvent.append('newEventImage', file);
			selectedNewEventImage.push(file);
			$(".newEventPreviewImage"+i).remove();
			var img = document.createElement("img");
			var reader = new FileReader();
			reader.onloadend = function() {
				 img.src = reader.result;
				 img.style = "max-width: 37.5em;";
			}
			img.classList.add("newEventPreviewImage"+i);
			reader.readAsDataURL(file);
			$("#newEventImage").after(img);
		}
		
	});
	$("#newEventPublish").on("click",function(e){
		e.stopImmediatePropagation();
		uploadEventList = [];
		alertMessage = "";
		var id;
		getNewEventID(backendUrl+"/getLatestEventData").then(response => 
			id=response)
		.then(data => {
		  // Handle the response data
		  console.log(data);
		  var newEventTitle = $("#newEventTitle").val();
			var newEventImageExtension = ( $("#newEventImage").val()!=null ? $("#newEventImage").val().split('.')[1] : null);
			var newEventDescription = $("#newEventDescription").val();
			var newEventDate = $("#newEventDate").val();
			var newEventStatus = $("#newEventStatus").val();
			
			//const formData = new FormData();
			for(var i=0; i<selectedNewEventImage.length; i++){
				formDataOfNewEvent.append('fileName',id+"."+newEventImageExtension);
			}
			
			if(!newEventTitle){
				alertMessage += "Please fill in the title \n";
			}
			else if(newEventTitle.length < 1){
				alertMessage += "Please fill in the title \n";
			}
			if(!newEventDescription){
				alertMessage += "Please fill in the description \n";
			}
			else if(newEventTitle.length < 1){
				alertMessage += "Please fill in the description \n";
			}
			
			if(!newEventDate){
				alertMessage += "Please select an event date \n";
			}
			else if(newEventDate.length < 1){
				alertMessage += "Please select an event date \n";
			}
			if(!newEventStatus){
				alertMessage += "Please select an event status \n";
			}
			else if(newEventStatus.length < 1){
				alertMessage += "Please select an event status \n";
			}
			var user =getUser();
			var username = (user==""? "" : user.name);
			if(alertMessage==""){
				if(newEventImageExtension!=null){
					var newEventJSON = "{\"id\":"+id+",\"title\":\""+newEventTitle+"\",\"image\":\""+id+"."+newEventImageExtension+"\",\"description\":\""+newEventDescription+"\",\"status\":\""+newEventStatus+"\",\"draft\":0,"+"\"author\":\""+username+"\",\"Date\":\""+newEventDate+"\"}";
					uploadEventList.push(newEventJSON);
					uploadNewEventImage(backendUrl+"/uploadNewEventImage",formDataOfNewEvent, uploadEventList)
				}
				else{
					var newEventJSON = "{\"id\":"+id+",\"title\":\""+newEventTitle+"\",\"image\":null,\"description\":\""+newEventDescription+"\",\"status\":\""+newEventStatus+"\",\"draft\":0,"+"\"author\":\""+username+"\",\"Date\":\""+newEventDate+"\"}";
					console.log(JSON.stringify(newEventJSON));
					uploadEventList.push(newEventJSON);
					setNewEventData(backendUrl+"/setNewEventData",uploadEventList);
					
				}
			}
			else{
				alert(alertMessage);
			}
		});
		
	});
	$("#newEventSaveAsDraft").on("click",function(e){
		e.stopImmediatePropagation();
		uploadEventList = [];
		alertMessage = "";
		var id;
		getNewEventID(backendUrl+"/getAllEventData").then(response => 
			id=response)
		.then(data => {
		  // Handle the response data
		  console.log(data);
		  var newEventTitle = $("#newEventTitle").val();
			var newEventImageExtension = ( $("#newEventImage").val()!=null ? $("#newEventImage").val().split('.')[1] : null);
			var newEventDescription = $("#newEventDescription").val();
			var newEventDate = $("#newEventDate").val();
			var newEventStatus = $("#newEventStatus").val();
			var user =getUser();
			var username = (user==""? "" : user.name);
			for(var i=0; i<selectedNewEventImage.length; i++){
				formDataOfNewEvent.append('fileName',id+"."+newEventImageExtension);
			}
			if(newEventImageExtension!=null){
				var newEventJSON = "{\"id\":"+id+",\"title\":\""+newEventTitle+"\",\"image\":\""+id+"."+newEventImageExtension+"\",\"description\":\""+newEventDescription+"\",\"status\":\""+newEventStatus+"\",\"draft\":1,"+"\"author\":\""+username+"\",\"Date\":\""+newEventDate+"\"}";
				uploadEventList.push(newEventJSON);
				uploadNewEventImage(backendUrl+"/uploadNewEventImage",formDataOfNewEvent, uploadEventList)
				
			}
			else{
				var newEventJSON = "{\"id\":"+id+",\"title\":\""+newEventTitle+"\",\"image\":null,\"description\":\""+newEventDescription+"\",\"status\":\""+newEventStatus+"\",\"draft\":1,"+"\"author\":\""+username+"\",\"Date\":\""+newEventDate+"\"}";
				console.log(JSON.stringify(newEventJSON));
				uploadEventList.push(newEventJSON);
				setNewEventData(backendUrl+"/setNewEventData",uploadEventList);
				
			}

		});
		
	});
});// end all pagecreate

$(document).on('pagecreate', '#login', function() {
	$('#showpw').on('click', function() {showPW()});
});

$(document).on('pagecreate', '#signup', function() {
	$('#form-res').submit(function(e) {processRes(e)});
});

$(document).on('pagecreate', '#user', function() {
	displayUser();
	$('#logout').on('click', function() {processUnLog()});
});
$(document).on('click', '#newEventLink', function() {
	
	$("#newEventTitle").val(null);
	$("#newEventImage").val(null);
	$("#newEventDescription").val(null);
	$("#newEventDate").val(null);
	$("#newEventStatus").val(null);
	document.location.href="#newEvent";
  });
$(document).on('click', '#myDraftLink', function() {
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	$('#container2'+' ul'+' li').remove();
  	$('#container2'+' ul'+' hr').remove();
	getEventDataByUser(backendUrl+"/getEventDataByUser",username, 1);
});
$(document).on('click', '#myEventLink', function() {
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	$('#container1'+' ul'+' li').remove();
  	$('#container1'+' ul'+' hr').remove();
	getEventDataByUser(backendUrl+"/getEventDataByUser",username, 0);
});

/* ------------------------------- function ------------------------------- */
function setUser(user) {localStorage.user = JSON.stringify(user);}

function getUser() {return JSON.parse(localStorage.user);}

function setLog(status) {localStorage.log = JSON.stringify(status);}

function getLog() {return JSON.parse(localStorage.log);}

function goToPage(pageID) {$("body").pagecontainer("change", pageID);}

function refresh() {window.location.reload();}

// format a date
function toStringDate(date) {
	let d = date.getDate();
	let dd;
	if (d < 10) {dd = '0' + d;}
	else {dd = d;}
	let m = date.getMonth() + 1;
	let mm;
	if (m < 10) {mm = '0' + m;}
	else {mm = m;}
	let y = date.getFullYear();
	return dd + "/" + mm + "/" + y;
} // end toStringDate()

// display passwords in text
function showPW() {
	let type = $('#log-pw').attr('type');
	if (type === "password") {$('#log-pw').attr('type', 'text');}
	else {$('#log-pw').attr('type', 'password');}
}

// process sign-up form
function processRes(e) {
	e.preventDefault();
	let tName = $('#resName').val();
	let tAddr = $('#resAddr').val();
	let tTel = $('#resTel').val();
	let tMail = $('#resMail').val();
	let tID = $('#resID').val();
	let tPw = $('#resPW').val();
	let tDate = toStringDate(new Date());
	let user = {name: tName, address: tAddr, tel: tTel, email: tMail, uid: tID, pw: tPw, date: tDate};
	setUser(user);
	document.getElementById("form-res").reset();
	setLog(true);
	goToPage('#user');
	setTimeout(function() {refresh();}, 100);
} // end processRes()

function displayUser() {
	let box = $('#user-content');
	isLogged = getLog();
	if (isLogged) {
		let user = getUser();
		let content = `
			<h2>User Detail</h2>
			<p><span class="ulabel">Name</span>${user.name}</p>
			<p><span class="ulabel">Address</span>${user.address}</p>
			<p><span class="ulabel">Phone</span>${user.tel}</p>
			<p><span class="ulabel">Email</span>${user.email}</p>
			<p><span class="ulabel">Join Date</span>${user.date}</p>
			<div class="utools margin-top margin-bottom">
				<a href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline">New Event</a>
				<a href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My Drafts</a>
				<a href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-bullets ui-btn-icon-notext ui-btn-inline">My Events</a>
			</div>
			<button type="button" id="logout" class="ui-btn ui-shadow ui-btn-b ui-corner-all ui-icon-action ui-btn-icon-right ui-btn-inline">Log Out</button>
		`;
		box.html(content);
	}
	else {box.text('ERROR: Invalid proceed.');}
} // end displayUser()

// execute when login
function processLog() {
	$('#btn-log').attr('href', '#user');
}

// execute when logout
function processUnLog() {
	setLog(false);
	$('#btn-log').attr('href', '#login');
	goToPage('#home');
	refresh();
}

async function getEventData(url,user){
	try{
	  const response = await fetch(url,{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		body:user,
		//mode: "no-cors", // no-cors, *cors, same-origin
		headers: {
		  "Content-Type": "application/json",
		}
	  })
	  alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	  const data = await response.json();
	  console.log(data,data.length);
	  for(var i=0; i<data.length;i++){
		outputToEventBoard(data[i]);
	  }
	}
	catch(error){
	  alert("connection error :"+ error);
	}
  }

  async function getEventDataByUser(url,username, draft){
	try{
		var bodyData = "{\"author\":\""+username+"\",\"draft\":"+draft+"}"; 
	  const response = await fetch(url,{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		body: JSON.stringify(JSON.parse(bodyData)),
		//mode: "no-cors", // no-cors, *cors, same-origin
		headers: {
		  "Content-Type": "application/json",
		}
	  })
	  alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	  const data = await response.json();
	  console.log(data,data.length);
	  for(var i=0; i<data.length;i++){
		outputToMyEventBoard(data[i],draft);
	  }
	  document.location.href="#myEvent";
	}
	catch(error){
	  alert("connection error :"+ error);
	}
  }
  async function uploadNewEventImage(url,formdata,uploadEventList){
	try{
	  await fetch(url,{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		body: formdata,
		//mode: "no-cors", // no-cors, *cors, same-origin
		
	  }).then(res=>{res.json()}).then(data=>
		{
			setNewEventData(backendUrl+"/setNewEventData",uploadEventList);
		});
	}
	catch(error){
	  alert("connection error :"+ error);
	}
  }

  async function getNewEventID(url){
	try{
	  const response = await fetch(url,{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		
		//mode: "no-cors", // no-cors, *cors, same-origin
		headers: {
		  "Content-Type": "application/json",
		}
	  })
	  //alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	  const data = await response.json();
	  var id=-1;
	  for(var i=0; i<data.length;i++){
		for(const [key, value] of Object.entries(data)){
			if(key=="id"){
				id=value;
			}
		}
	  }
	  
	  return id;
	}
	catch(error){
	  alert("connection error :"+ error);
	}
  }

  async function setNewEventData(url,data){
	try{
	const response = await fetch(url,{
	 method: "POST", // *GET, POST, PUT, DELETE, etc.
	 
	 //mode: "no-cors", // no-cors, *cors, same-origin
	 headers: {
	   "Content-Type": "application/json",
	 },
	 body: JSON.stringify(data)
	 
   })
   console.log(response);
	alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	document.location.href="/";
  }
  catch(error){
	alert("connection error");
  }
  }

  function outputToMyEventBoard(data,draft) {
	//$("#showCloudNoData").css("display","none");
	//console.log(localStorage.qrcode);
	var html = "";    
	let htmlSegment = "";
	let htmlSegmentTitle = "";
	let htmlSegmentImage = "";
	let htmlSegmentDescription = "";
	let htmlSegmentDate = "";
	let htmlSegmentStatus = "";
	console.log(data);
	
	var decodeddata= data;
	htmlSegment += "<li>";
	htmlSegment += "<a>";
	var id = -1;
	for(const [key, value] of Object.entries(decodeddata)){
	  console.log(key);
	  if(key=="id"){
		id = value;
	  }
	  
	  if(key=="image"){
		if(value!=null){
			htmlSegmentImage+= "<img src='img/"+value+"' alt='"+value+"'/> <br>";
	  	}
	  }      
	  else{
		if(key!="draft"&&key!="author"&&key!="_id"){
			if(key=="title"){
				htmlSegmentTitle += '<h2>';
				htmlSegmentTitle += key + " : " + value ;
				htmlSegmentTitle += '</h2>';
			}
			else if(key=="description"){
				htmlSegmentDescription += '<p>';
				htmlSegmentDescription += key + " : " + value ;
				htmlSegmentDescription += '</p>';
			}
			else if(key=="date"){
				htmlSegmentDate += '<p>';
				htmlSegmentDate += key + " : " + value ;
				htmlSegmentDate += '</p>';
			}
			else if(key=="status"){
				htmlSegmentStatus += '<p>';
				htmlSegmentStatus += key + " : " + value ;
				htmlSegmentStatus += '</p>';
			}

		}
	  }
	  
	};
	htmlSegment+= htmlSegmentImage+htmlSegmentTitle+htmlSegmentDescription+htmlSegmentDate+htmlSegmentStatus;
	htmlSegment+="</a>";
	if(draft==0){
		htmlSegment += "<a id='event"+id+"edit' href='#edit' data-rel='popup' data-position-to='window' data-transition='pop'>Edit</a>";
		
	}
	else if(draft==1){
		htmlSegment += "<a id='draft"+id+"edit' href='#edit' data-rel='popup' data-position-to='window' data-transition='pop'>Edit</a>";
		
	}
	htmlSegment += '</li>';
	html += htmlSegment + "<hr>";
	if(draft==0){
		$('#container1'+' ul').append(html);
		
		$('#container1'+' ul').listview().listview('refresh');
	}
	else if(draft==1){
		$('#container2'+' ul').append(html);
		
		$('#container2'+' ul').listview().listview('refresh');
	}
		
  }


