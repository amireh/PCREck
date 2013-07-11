function checkUsername(username, path, option) {

	expression = /(&\B)|(^&)|(#\B)|(^#)/;
	if (expression.exec(username)) {
		username = 'erro';
	}
	try {
		xmlhttp = new XMLHttpRequest();
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				xmlhttp = false;
			}
		}
	}
	if (xmlhttp) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					document.getElementById("checkUsername").innerHTML = xmlhttp.responseText;
				}
			}
		}
		xmlhttp.open('GET', path + '/search_username.php?option=' + option + '&username=' + username, true);
		xmlhttp.send(null);
    }
}