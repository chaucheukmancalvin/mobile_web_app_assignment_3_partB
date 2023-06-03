let isLogged;

localStorage.log;
localStorage.user;

/* ------------------------------- pagecreate ------------------------------- */
$(document).on('pagecreate', function() {
	if (localStorage.log == null) {setLog(false);}
	if (localStorage.user == null) {setUser('');}
	if (isLogged) {processLog();}

	// sync external widgets and initialise widgets
	$('[data-role="header"], [data-role="footer"]').toolbar({theme:'c', position: 'fixed', tapToggle: false});
	$('[data-role="popup"]').popup();
	$('[data-role="listview"]').listview();
});

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