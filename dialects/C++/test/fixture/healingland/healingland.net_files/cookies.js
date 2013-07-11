<!--

function readCookie(name) {
	var eq = name + "=";
	var ca = document.cookie.split(';');
	if (!ca.length) return null;
	for (var i=0;i<ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(eq) == 0) return unescape(c.substring(eq.length,c.length));
	}
	return null;
}

function includeInCookie(property_id, edir_path, type) {
	if (!isNaN(property_id)) {
		var name = "bookmark"+type;
		var d = new Date();
		if (!edir_path) edir_path = "/";
		d.setTime(d.getTime() + (15*24*60*60*1000));
		var expires = '; expires=' + d.toGMTString();
		var bookmark = readCookie("bookmark"+type);
		if (!bookmark) bookmark = "'" + property_id + "'";
		else {
			if (bookmark.indexOf("'" + property_id + "'") == -1) {
				bookmark = bookmark + "," + "'" + property_id + "'";
			}
		}
		document.cookie = name + '=' + escape(bookmark) + expires + '; path=' + edir_path;

		$('#confirmDiv').html("<p class=\"informationMessage\">"+showText(LANG_JS_FAVORITEADD)+"</p>");
		tb_show("", "#TB_inline?width=400&height=110&inlineId=confirmDiv");
	}
}

function removeFromCookie(property_id, edir_path,type) {
	var name = "bookmark"+type;
	var d = new Date();
	if (!edir_path) edir_path = "/";
	d.setTime(d.getTime() + (15*24*60*60*1000));
	var expires = '; expires=' + d.toGMTString();
	if (isNaN(property_id)) {
		if (property_id == "all") {
			var bookmark = "";
			document.cookie = name + '=' + escape(bookmark) + expires + '; path=' + edir_path;
		}
	} else {
		var bookmark = readCookie("bookmark"+type);
		if (bookmark.length > 0) {
			if (bookmark.indexOf("'" + property_id + "'") > -1) {
				finalvar = bookmark.indexOf("'" + property_id + "'") + property_id.length + 3;
				var aux = "";
				aux = bookmark.substr(0, bookmark.indexOf("'" + property_id + "'"));
				aux += bookmark.substr(finalvar);
				bookmark = aux;
			}
		}
		len = bookmark.length;
		len--;
		if (bookmark.lastIndexOf(",") == len) {
			bookmark = bookmark.substr(0, len);
		}
		document.cookie = name + '=' + escape(bookmark) + expires + '; path=' + edir_path;

		$('#confirmDiv').html("<p class=\"successMessage\">"+showText(LANG_JS_FAVORITEDEL)+"</p>");
		tb_show("", "#TB_inline?width=300&height=90&inlineId=confirmDiv");
		
		
	}
	setTimeout("window.location.reload();", 2000);
	
}

//-->
