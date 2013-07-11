
function showPhone(listingid, default_url) {
	try {
		xmlhttp = new XMLHttpRequest();
	} catch (exc) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (ex) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				xmlhttp = false;
			}
		}
	}
	if (xmlhttp) {
		xmlhttp.open("GET", default_url+'/countphoneclick.php?listing_id='+listingid, true);
		xmlhttp.send(null);
	}
	document.getElementById("phoneLink"+listingid).className = "controlPhoneHide";
	document.getElementById("phoneNumber"+listingid).className = "controlPhoneShow";
}

function showFax(listingid, default_url) {
	try {
		xmlhttp = new XMLHttpRequest();
	} catch (exc) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (ex) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				xmlhttp = false;
			}
		}
	}
	if (xmlhttp) {
		xmlhttp.open("GET", default_url+'/countfaxclick.php?listing_id='+listingid, true);
		xmlhttp.send(null);
	}
	document.getElementById("faxLink"+listingid).className = "controlFaxHide";
	document.getElementById("faxNumber"+listingid).className = "controlFaxShow";
}
