
$(document).on('pagecreate', function() {
	// sync external widgets and initialise widgets
	$('[data-role="header"], [data-role="footer"]').toolbar({theme:'c', position: 'fixed', tapToggle: false});
	$('[data-role="popup"]').popup();
	$('[data-role="listview"]').listview();
}); // end all pagecreate