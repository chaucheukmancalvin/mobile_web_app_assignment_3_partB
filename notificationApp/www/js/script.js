let isSuccess;

localStorage.log;
localStorage.user;

/* ------------------------------- pagecreate ------------------------------- */
var backendUrl = "http://localhost:3000";

var selectedNewEventImage = [];
var formDataOfNewEvent = new FormData();

var selectedEditEventID=null;

$(document).on('pagecreate', function() {
	if (localStorage.log == null) {setLog(false);}
	if (localStorage.user == null) {setUser('');}
	if (getLog()) {processLog(getUser());}

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
			id=response+1)
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
	$('#form-log').submit(function(e) {processLogin(e)});
});

$(document).on('pagecreate', '#signup', function() {
	$('#form-res').submit(function(e) {processRes(e)});
});

$(document).on('pagecreate', '#user', function() {
	displayUser();
	$('#logout').on('click', function() {processUnLog()});
});

$(document).on('click', '#eventBoardLink', function() {
	$(".card").remove();
	getAllPublishedEventData(backendUrl+"/getAllPublishedEventData");
	
});
$(document).on('click', '#eventBoardLink2', function() {
	$(".card").remove();
	getAllPublishedEventData(backendUrl+"/getAllPublishedEventData");
	
});
$(document).on('click', '#newEventLink', function() {
	var user =getUser();
	if(user==""){
		document.location.href="#login";
	}
	else{
		$("#newEventTitle").val(null);
		$("#newEventImage").val(null);
		$("#newEventDescription").val(null);
		$("#newEventDate").val(null);
		$("#newEventStatus").val(null);
		document.location.href="#newEvent";
	}
  });
  $(document).on('click', '#newEventLink2', function() {
	var user =getUser();
	if(user==""){
		document.location.href="#login";
	}
	else{
		$("#newEventTitle").val(null);
		$("#newEventImage").val(null);
		$("#newEventDescription").val(null);
		$("#newEventDate").val(null);
		$("#newEventStatus").val(null);
		document.location.href="#newEvent";
	}
  });
$(document).on('click', '#myDraftLink', function() {
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(user==""){
		document.location.href="#login";
	}
	else{
		$('#container2'+' ul'+' li').remove();
		$('#container2'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 1);
	}
});
$(document).on('click', '#myDraftLink2', function() {
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(user==""){
		document.location.href="#login";
	}
	else{
		$('#container2'+' ul'+' li').remove();
		$('#container2'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 1);
	}
});
$(document).on('click', '#myEventLink', function() {
	selectedEditEventID = null;
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(user==""){
		document.location.href="#login";
	}
	else{
		$('#container1'+' ul'+' li').remove();
		$('#container1'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 0);
	}
});
$(document).on('click', '#myEventLink2', function() {
	selectedEditEventID = null;
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(user==""){
		document.location.href="#login";
	}
	else{
		$('#container1'+' ul'+' li').remove();
		$('#container1'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 0);
	}
});

$(document).on('click', '.eventEdit', function() {
	selectedEditEventID = this.id.replace("edit","").replace("event","");
	getEventDataByID(backendUrl+"/getEventDataByID",selectedEditEventID,0);
	
});

$(document).on('click', '.draftEdit', function() {
	selectedEditEventID = this.id.replace("edit","").replace("draft","");
	getEventDataByID(backendUrl+"/getEventDataByID",selectedEditEventID,1);
	
});

$(document).on('click', '#editEventSave', function() {
	
	var editEventTitle = $("#editEventTitle").val();
	var editEventDescription = $("#editEventDescription").val();
	var editEventDate = $("#editEventDate").val();
	var editEventStatus = $("#editEventStatus").val();
	var data = "{\"title\":\""+editEventTitle+"\",\"description\":\""+editEventDescription+"\",\"date\":\""+editEventDate+"\",\"status\":\""+editEventStatus+"\"}";
	editEventDataByID(backendUrl+"/editEventDataByID",selectedEditEventID,data,0);
	
});

$(document).on('click', '#editDraftSaveDraft', function() {
	
	var editDraftTitle = $("#editDraftTitle").val();
	var editDraftDescription = $("#editDraftDescription").val();
	var editDraftDate = $("#editDraftDate").val();
	var editDraftStatus = $("#editDraftStatus").val();
	var data = "{\"title\":\""+editDraftTitle+"\",\"description\":\""+editDraftDescription+"\",\"date\":\""+editDraftDate+"\",\"status\":\""+editDraftStatus+"\"}";
	editEventDataByID(backendUrl+"/editEventDataByID",selectedEditEventID,data,1);
	
});

$(document).on('click', '#editDraftPublish', function() {
	
	var editDraftTitle = $("#editDraftTitle").val();
	var editDraftDescription = $("#editDraftDescription").val();
	var editDraftDate = $("#editDraftDate").val();
	var editDraftStatus = $("#editDraftStatus").val();
	var data = "{\"title\":\""+editDraftTitle+"\",\"description\":\""+editDraftDescription+"\",\"date\":\""+editDraftDate+"\",\"status\":\""+editDraftStatus+"\",\"draft\":0"+"}";
	editEventDataByID(backendUrl+"/editEventDataByID",selectedEditEventID,data,1);
	
});

$(document).on('click', '#editEventDelete', function() {
	if($(".editEventPreviewImage")!==null){
		if($(".editEventPreviewImage").length > 0){
			deleteImageInFolderByID(backendUrl+"/deleteImageInFolderByID",$(".editEventPreviewImage").attr('src').replace("img/",""),0);
		}
		else{
			deleteEventDataByID(backendUrl+"/deleteEventDataByID",selectedEditEventID,0);
		}
	}
	else{
		deleteEventDataByID(backendUrl+"/deleteEventDataByID",selectedEditEventID,0);
	}
	
	
});

$(document).on('click', '#editDraftDelete', function() {
	if($(".editDraftPreviewImage")!==null){
		if($(".editDraftPreviewImage").length > 0){
			deleteImageInFolderByID(backendUrl+"/deleteImageInFolderByID",$(".editDraftPreviewImage").attr('src').replace("img/",""),1);
		}
		else{
			deleteEventDataByID(backendUrl+"/deleteEventDataByID",selectedEditEventID,1);
		}
	}
	else{
		deleteEventDataByID(backendUrl+"/deleteEventDataByID",selectedEditEventID,1);
	}
	
	
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
	let type = $('#logPW').attr('type');
	if (type === "password") {$('#logPW').attr('type', 'text');}
	else {$('#logPW').attr('type', 'password');}
}

// process sign-up form
async function processRes(e) {
	e.preventDefault();
	let tName = $.trim($('#resName').val());
	let tAddr = $.trim($('#resAddr').val());
	let tTel = $('#resTel').val();
	let tMail = $('#resMail').val();
	let tID = $('#resID').val();
	let tPw = $('#resPW').val();
	let tDate = toStringDate(new Date());
	const user = {name: tName, address: tAddr, tel: tTel, email: tMail, uid: tID, pw: tPw, date: tDate};
	await sendUser(user);
	if (isSuccess) {
		document.getElementById("form-res").reset();
		login(user);
	}
	else {alert('Cannot create the account. User ID is already used.');}	
} // end processRes()

async function sendUser(user) {
	const req = await fetch(backendUrl + '/saveUser', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(user)
	});
	isSuccess = await req.json();
} // end sendUser()

// process sign-in form
async function processLogin(e) {
	e.preventDefault();
	let tID = $('#logID').val();
	let tPW = $('#logPW').val();
	await fetchUser(tID, tPW);
	const user = getUser();
	if (user !== null) {
		document.getElementById("form-log").reset();
		login(user);
	}
	else {alert('User ID or password is incorrect.');}
} // end processLogin()

async function fetchUser(uid, pw) {
	const res = await fetch(backendUrl + '/getUser' + `/user?uid=${uid}&pw=${pw}`, {
		method: 'GET'
	});
	const user = await res.json();
	setUser(user);
} // end getUser()

function displayUser() {
	let box = $('#user-content');
	if (getLog()) {
		let user = getUser();
		let content = `
			<h2>User Detail</h2>
			<p><span class="ulabel">Name</span>${user.name}</p>
			<p><span class="ulabel">Address</span>${user.address}</p>
			<p><span class="ulabel">Phone</span>${user.tel}</p>
			<p><span class="ulabel">Email</span>${user.email}</p>
			<p><span class="ulabel">Join Date</span>${user.date}</p>
			<div class="utools margin-top margin-bottom">
				<a id="newEventLink2" href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline">New Event</a>
				<a id="myDraftLink2" href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My Drafts</a>
				<a id="myEventLink2" href="#" class="ui-btn ui-btn-a ui-corner-all ui-icon-bullets ui-btn-icon-notext ui-btn-inline">My Events</a>
			</div>
			<button type="button" id="logout" class="ui-btn ui-shadow ui-btn-b ui-corner-all ui-icon-action ui-btn-icon-right ui-btn-inline">Log Out</button>
		`;
		box.html(content);
	}
	else {box.text('ERROR: Invalid proceed.');}
} // end displayUser()

function login(user) {
	setLog(true);
	processLog(user);
	goToPage('#home');
	refresh();
} // end login()

// execute when login
function processLog(user) {
	setUser(user);
	$('#btn-log').attr('href', '#user');
} // end processLog()

// execute when logout
function processUnLog() {
	setLog(false);
	setUser('');
	$('#btn-log').attr('href', '#login');
	goToPage('#home');
	refresh();
} // end processUnLog()

async function getAllPublishedEventData(url){
	try{
	  const response = await fetch(url,{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
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
	  document.location.href="#eventBoard";
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

  async function getEventDataByID(url,id,draft){
	
	try{
		var bodyData = "{\"id\":"+id+"}"; 
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
	  if(draft==0){
	  $(".editEventPreviewImage").remove();
	  $("#editEventTitle").val(null);
	  $("#editEventDescription").val(null);
	  $("#editEventDate").val(null);
	  $("#editEventStatus").val(null);
	  for(var i=0; i<data.length;i++){
		for(const [key, value] of Object.entries(data[i])){
			console.log(key,value);
			if(key=="title"){
				console.log(value);
				$("#editEventTitle").val(value);
			}
			else if(key=="image"&&value!=null&&value!=""){
				var img = document.createElement("img");
				img.src = "img/"+value;
				img.style = "max-width: 37.5em;";
				img.classList.add("editEventPreviewImage");
				$("#editEventTitle").after(img);
			}
			else if(key=="description"){
				$("#editEventDescription").val(value);
			}
			else if(key=="date"){
				$("#editEventDate").val(value);
			}
			else if(key=="status"){
				$("#editEventStatus").val(value);
			}
		}
	  }
	  $('#editEventPopUp').popup('open');
	}
	else if(draft==1){
		$(".editDraftPreviewImage").remove();
		$("#editDraftTitle").val(null);
		$("#editDraftDescription").val(null);
		$("#editDraftDate").val(null);
		$("#editDraftStatus").val(null);
		for(var i=0; i<data.length;i++){
			for(const [key, value] of Object.entries(data[i])){
				console.log(key,value);
				if(key=="title"){
					console.log(value);
					$("#editDraftTitle").val(value);
				}
				else if(key=="image"&&value!=null&&value!=""){
					var img = document.createElement("img");
					img.src = "img/"+value;
					img.style = "max-width: 37.5em;";
					img.classList.add("editDraftPreviewImage");
					$("#editDraftTitle").after(img);
				}
				else if(key=="description"){
					$("#editDraftDescription").val(value);
				}
				else if(key=="date"){
					$("#editDraftDate").val(value);
				}
				else if(key=="status"){
					$("#editDraftStatus").val(value);
				}
			}
		}
		$('#editDraftPopUp').popup('open');
	}
	  
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
		for(const [key, value] of Object.entries(data[i])){
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

  async function editEventDataByID(url,id,data,draft){
	try{
	var bodyList = [];
	bodyList.push("{\"id\":"+id+"}");
	bodyList.push(data);
	var bodyinput = JSON.stringify(bodyList);
	const response = await fetch(url,{
	 method: "POST", // *GET, POST, PUT, DELETE, etc.
	 
	 //mode: "no-cors", // no-cors, *cors, same-origin
	 headers: {
	   "Content-Type": "application/json",
	 },
	 body: bodyinput
	 
   })
   console.log(response);
	alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	selectedEditEventID = null;
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(draft==0){
		$('#container1'+' ul'+' li').remove();
		$('#container1'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 0);
	}
	else if(draft==1){
		$('#container2'+' ul'+' li').remove();
		$('#container2'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 1);
	}
  }
  catch(error){
	alert("connection error");
  }
  }

  async function deleteImageInFolderByID(url,image,draft){
	try{
	const response = await fetch(url,{
	 method: "POST", // *GET, POST, PUT, DELETE, etc.
	 
	 //mode: "no-cors", // no-cors, *cors, same-origin
	 headers: {
	   "Content-Type": "application/json",
	 },
	 body: "{\"image\":\""+image+"\"}"
	 
   }).then(response=>{}).then(data=>{
	deleteEventDataByID(backendUrl+"/deleteEventDataByID",selectedEditEventID,draft);
   })
   
  }
  catch(error){
	alert("connection error");
  }
  }

  async function deleteEventDataByID(url,id,draft){
	try{
	const response = await fetch(url,{
	 method: "POST", // *GET, POST, PUT, DELETE, etc.
	 
	 //mode: "no-cors", // no-cors, *cors, same-origin
	 headers: {
	   "Content-Type": "application/json",
	 },
	 body: "{\"id\":"+id+"}"
	 
   })
   console.log(response);
	alert("connection status:"+ response.status+"\n"+"connection status text:"+ response.statusText);
	selectedEditEventID = null;
	var user=getUser();
	var username = (user=="" ? "" : user.name);
	if(draft==0){
		$('#container1'+' ul'+' li').remove();
		$('#container1'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 0);
	}
	else if(draft==1){
		$('#container2'+' ul'+' li').remove();
		$('#container2'+' ul'+' hr').remove();
		getEventDataByUser(backendUrl+"/getEventDataByUser",username, 1);
	}
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
				htmlSegmentStatus += key + " : <select disabled>" ;
				if(value == 1){
					htmlSegmentStatus += '<option value="1" selected>occurring</option>';
				}
				else if(value == 2){
					htmlSegmentStatus += '<option value="2" selected>done</option>';
				}
				else if(value == 3){
					htmlSegmentStatus += '<option value="3" seledted>cancelled</option>';
				}
				htmlSegmentStatus += '</select>';
				htmlSegmentStatus += '</p>';
			}

		}
	  }
	  
	};
	htmlSegment+= htmlSegmentImage+htmlSegmentTitle+htmlSegmentDescription+htmlSegmentDate+htmlSegmentStatus;
	htmlSegment+="</a>";
	if(draft==0){
		htmlSegment += "<a id='event"+id+"edit' class='eventEdit' data-rel='popup' data-position-to='window' data-transition='pop'>Edit</a>";
		
	}
	else if(draft==1){
		htmlSegment += "<a id='draft"+id+"edit' class='draftEdit' data-rel='popup' data-position-to='window' data-transition='pop'>Edit</a>";
		
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

  function outputToEventBoard(data) {
	//$("#showCloudNoData").css("display","none");
	//console.log(localStorage.qrcode);
	var html = "";    
	let htmlSegment = "";
	let htmlSegmentTitle = "";
	let htmlSegmentImage = "";
	let htmlSegmentDescription = "";
	let htmlSegmentDate = "";
	let htmlSegmentStatus = "";
	let htmlSegmentAuthor = "";
	console.log(data);
	
	var decodeddata= data;
	htmlSegment += "<div class='card'>";
	var id = -1;
	for(const [key, value] of Object.entries(decodeddata)){
	  console.log(key);
	  if(key=="id"){
		id = value;
	  }
	  
	  if(key=="image"){
		if(value!=null){
			htmlSegmentImage+= "<img src='img/"+value+"' style='width:100%' alt='"+value+"'/> <br>";
	  	}
	  }      
	  else{
		if(key!="draft"&&key!="author"&&key!="_id"){
			if(key=="title"){
				htmlSegmentTitle += '<h4><b>';
				htmlSegmentTitle += key + " : " + value ;
				htmlSegmentTitle += '</b></h4>';
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
				htmlSegmentStatus += key + " : ";
				if(value == 1){
					htmlSegmentStatus +='occurring'
				}
				else if(value == 2){
					htmlSegmentStatus +='done';
				}
				else if(value == 3){
					htmlSegmentStatus += 'cancelled';
				}
				
				htmlSegmentStatus += '</p>';
			}
			else if(key=="author"){
				htmlSegmentAuthor += '<p>';
				htmlSegmentAuthor += key + " : " + value ;
				htmlSegmentAuthor += '</p>';
			}
		}
	  }
	  
	};
	htmlSegment+= htmlSegmentImage+"<div class='card-container'>"+htmlSegmentTitle+htmlSegmentDescription+htmlSegmentDate+htmlSegmentStatus+htmlSegmentAuthor+ "</div>";
	htmlSegment+= "</div>";
	html += htmlSegment 
	var newElement = $(html);
	newElement.appendTo('#cards');
  }


