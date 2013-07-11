var advancedSearchShow = false;
function showAdvancedSearch(item, template_id, path) {
	var xmlhttp;
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
	document.getElementById("advancedSearchID").className = "isVisible";
	document.getElementById("advancedSearchID").innerHTML = "<p class=\"loading\">Loading...</p>";
	if (xmlhttp) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					document.getElementById("advancedSearchID").className   = "isHidden";
					document.getElementById("advancedSearchID").innerHTML   = xmlhttp.responseText;
					document.getElementById("advancedSearchID").className   = "isVisible";
					document.getElementById("switchAdvancedSearch").className = "switchClose";
					document.getElementById("switchAdvancedSearch").innerHTML = "-";
					document.getElementById("linkAdvancedSearch").onclick = function() {
						closeAdvancedSearch(item, template_id, path);
					}
					advancedSearchShow = true;
				}
			}
		}
		xmlhttp.open("GET", path + "/search.php?template_id=" + template_id, true);
		xmlhttp.send(null);
	}
}

function closeAdvancedSearch(item, template_id, path) {
	document.getElementById("switchAdvancedSearch").className = "switchOpen";
	document.getElementById("switchAdvancedSearch").innerHTML = "+";
	document.getElementById("advancedSearchID").className = "isHidden";
	document.getElementById("advancedSearchID").innerHTML = "";
	document.getElementById("linkAdvancedSearch").onclick = function() {
		showAdvancedSearch(item, template_id, path);
	}
}


function showAdvancedTemplateSearch(template_id, path) {
	var xmlhttp;
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
	for (i=0; i<document.getElementById("templateSearchTabs").childNodes.length; i++) {
		if (document.getElementById("templateSearchTabs").childNodes[i].id.indexOf("templateActiveID") >= 0) {
			document.getElementById(document.getElementById("templateSearchTabs").childNodes[i].id).className = "templateSearchTab";
		}
	}
	document.getElementById("advancedTemplateSearchID").className = "templateTabContent isVisible";
	document.getElementById("advancedTemplateSearchID").innerHTML = "<p class=\"loading\">Loading...</p>";
	if (xmlhttp) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					document.getElementById("templateIDID").value = template_id;
					document.getElementById("templateActiveID"+template_id).className = "templateActive";
					document.getElementById("advancedTemplateSearchID").className = "templateTabContent isHidden";
					document.getElementById("advancedTemplateSearchID").innerHTML = xmlhttp.responseText;
					document.getElementById("advancedTemplateSearchID").className = "templateTabContent isVisible";
				}
			}
		}
		xmlhttp.open("GET", path + "/search_template.php?template_id=" + template_id, true);
		xmlhttp.send(null);
	}
}