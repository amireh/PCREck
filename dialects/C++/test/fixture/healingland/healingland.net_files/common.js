var isInternetExplorer = (navigator.appName.indexOf("Microsoft") != -1);

function countSpaces(obj){
	var iLength = obj.value.length;
	var strSpaces = obj.value.match(new RegExp("( )", "g"));
	var countSpaces = strSpaces ? strSpaces.length : 0;
	return countSpaces;
}

function countLineBreaks(obj){

	var iLength = obj.value.length;
	var strLineBreaks = obj.value.match(new RegExp("(\\n)", "g"));
	var countLineBreaks = strLineBreaks ? strLineBreaks.length : 0;
	return countLineBreaks;
}

function textCounter(field, counter_field, maxlimit) {
	var lineBreaks = countLineBreaks(field);
	var adjust = isInternetExplorer ? 1 : 0;
	if (field.value.length - lineBreaks * adjust > maxlimit){
		field.value = field.value.substring(0, maxlimit + lineBreaks * adjust);
		field.focus();
	} else {
		counter_field.value = maxlimit - field.value.length + lineBreaks * adjust;
	}
}

function backToSection(backToURL, forceBackToURL){
	if(forceBackToURL == null) forceBackToURL = false;
	if(history.length > 1 && !forceBackToURL) history.back(); else window.location.href = backToURL;
}

function hideStatus() {
	window.defaultStatus='';
	window.status='';
	return true;
}

function searchReset() {
	tot = document.search_form.elements.length;
	for(i=0;i<tot;i++) {
		if (document.search_form.elements[i].type == 'text') {
			document.search_form.elements[i].value = "";
		} else if (document.search_form.elements[i].type == 'checkbox' || document.search_form.elements[i].type == 'radio') {
			document.search_form.elements[i].checked = false;
		} else if (document.search_form.elements[i].type == 'select-one') {
			document.search_form.elements[i].selectedIndex = 0;
		}
	}
	if ((document.search_form.country_id) || (document.search_form.state_id) || (document.search_form.region_id) || (document.search_form.city_id) || (document.search_form.area_id)) {
		searchLocationReset();
	}
}

function easyFriendlyUrl(name2friendlyurl, target, validchars, separator) {
	var str = "";
	var i;
	var exp_reg = new RegExp("[" + validchars + separator + "]");
	var exp_reg_space = new RegExp("[ ]");
	name2friendlyurl.toString();	
	name2friendlyurl = name2friendlyurl.replace(/^ +/, "");

	for (i=0 ; i<name2friendlyurl.length; i++) {
		if (exp_reg.test(name2friendlyurl.charAt(i))) {			
			str = str+name2friendlyurl.charAt(i);
		} else {
			if (exp_reg_space.test(name2friendlyurl.charAt(i))) {
				if (str.charAt(str.length-1) != separator) {					
					str = str + separator;
				}
			}
		}
	}
	
	if (str.charAt(str.length-1) == separator) str = str.substr(0, str.length-1);
	if (document.getElementById(target))
	document.getElementById(target).value = str.toLowerCase();
}

function searchLocationReset() {
	if (document.search_form.country_id) {
		if (document.search_form.state_id) {
			while (document.search_form.state_id.options.length>1) {
				deleteIndex=document.search_form.state_id.options.length-1;
				document.search_form.state_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.region_id) {
			while (document.search_form.region_id.options.length>1) {
				deleteIndex=document.search_form.region_id.options.length-1;
				document.search_form.region_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.city_id) {
			while (document.search_form.city_id.options.length>1) {
				deleteIndex=document.search_form.city_id.options.length-1;
				document.search_form.city_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.area_id) {
			while (document.search_form.area_id.options.length>1) {
				deleteIndex=document.search_form.area_id.options.length-1;
				document.search_form.area_id.options[deleteIndex]=null;
			}
		}
	} else if (document.search_form.state_id) {
		if (document.search_form.region_id) {
			while (document.search_form.region_id.options.length>1) {
				deleteIndex=document.search_form.region_id.options.length-1;
				document.search_form.region_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.city_id) {
			while (document.search_form.city_id.options.length>1) {
				deleteIndex=document.search_form.city_id.options.length-1;
				document.search_form.city_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.area_id) {
			while (document.search_form.area_id.options.length>1) {
				deleteIndex=document.search_form.area_id.options.length-1;
				document.search_form.area_id.options[deleteIndex]=null;
			}
		}
	} else if (document.search_form.region_id) {
		if (document.search_form.city_id) {
			while (document.search_form.city_id.options.length>1) {
				deleteIndex=document.search_form.city_id.options.length-1;
				document.search_form.city_id.options[deleteIndex]=null;
			}
		}
		if (document.search_form.area_id) {
			while (document.search_form.area_id.options.length>1) {
				deleteIndex=document.search_form.area_id.options.length-1;
				document.search_form.area_id.options[deleteIndex]=null;
			}
		}
	} else if (document.search_form.city_id) {
		if (document.search_form.area_id) {
			while (document.search_form.area_id.options.length>1) {
				deleteIndex=document.search_form.area_id.options.length-1;
				document.search_form.area_id.options[deleteIndex]=null;
			}
		}
	}
}

function $(id) {
	return document.getElementById(id);
}

function showText(text) {
	return unescape(text);
}

function displayMap() {
	var index, totalamount=10;
	var classname;
	if ($.cookie('showMap') == 1) {
		$('#resultsMap').css('display', '');
		$('#linkDisplayMap').text('' + showText(LANG_JS_LABEL_HIDEMAP) + '');
		for (index=1; index<=totalamount; index++) {
			if (document.getElementById('summaryNumberID'+index)) {
				classname=document.getElementById('summaryNumberID'+index).className;
				if (classname=='summaryNumberSC isHidden')
					document.getElementById('summaryNumberID'+index).className = 'summaryNumberSC isVisible';
				else
					document.getElementById('summaryNumberID'+index).className = 'summaryNumber isVisible';

			}
		}
		$.cookie('showMap', '0', {expires: 7, path: '/'});
		initialize();
	} else {
		$('#resultsMap').css('display', 'none');
		$('#linkDisplayMap').text('' + showText(LANG_JS_LABEL_SHOWMAP) + '');
		for (index=1; index<=totalamount; index++) {
			if (document.getElementById('summaryNumberID'+index)) {
				classname=document.getElementById('summaryNumberID'+index).className;
				if (classname=='summaryNumber isVisible')
					document.getElementById('summaryNumberID'+index).className = 'summaryNumber isHidden';
				else
					document.getElementById('summaryNumberID'+index).className = 'summaryNumberSC isHidden';
			}
		}
		$.cookie('showMap', '1', {expires: 7, path: '/'});
	}
}

function dialogBox(pType, pText, pId, pForm ,pHeight, ok_button, cancel_button) {

	$('document').ready(function() {

		var btns = {};
		var type = pType;
		var text = pText;
		var id = pId;
		var formName = pForm;
		var boxHeight = pHeight;

		var button1 = ok_button;
		var button2 = cancel_button;


		$('#alertMsg').remove();
		$('body').append(" <div id=\"alertMsg\" style=\"display:none\" ></div> ");
		$('#alertMsg').append(" <p class=\"informationMessage\">"+text+"</p> ");
		
		if ( type == 'confirm' ) {


			/**
			 * Prepare labels to buttons of dialog box
			 */
			btns[button1] = function(){
								if ( formName ) {
									$("input[name='hiddenValue']").attr('value', id);
									document.getElementById(formName).submit();
								}
							};
			btns[button2] = function(){
								$(this).dialog('close');
								$('input:checkbox').attr('checked', '');
							};
			/****************************************/
			
			$("form").bind("submit", function(event) {event.preventDefault();});
		   	$('#alertMsg').dialog({
				autoOpen: false,
				bgiframe: true,
				closeOnEscape: false,
				resizable: false,
				height: boxHeight,
				draggable: false,
				modal: true,
				overlay: {
					backgroundColor: '#000',
					opacity: 0.5
				},
				buttons: btns
			});
			$('.ui-dialog-titlebar-close').css('display', 'none');
			$('#alertMsg').dialog('open');
			
		}
		else if ( type == 'alert' ) {
		
			$('#alertMsg').dialog({
				autoOpen: false,
				bgiframe: true,
				closeOnEscape: true,
				resizable: false,
				height: boxHeight,
				modal: true,
				overlay: {
					backgroundColor: '#000',
					opacity: 0.5
				}
			});
			$('#alertMsg').dialog('open');	
		
		}
	
	});

}

function dialogBoxBulk(pType, pText, pId, pForm ,pHeight, ok_button, cancel_button) {

	$('document').ready(function() {

		var btns = {};
		var type = pType;
		var text = pText;
		var id = pId;
		var formName = pForm;
		var boxHeight = pHeight;

		var button1 = ok_button;
		var button2 = cancel_button;


		$('#alertMsg').remove();
		$('body').append(" <div id=\"alertMsg\" style=\"display:none\" ></div> ");
		$('#alertMsg').append(" <p class=\"informationMessage\">"+text+"</p> ");

		if ( type == 'confirm' ) {


			/**
			 * Prepare labels to buttons of dialog box
			 */
			btns[button1] = function(){
								if ( formName ) {
									$("input[name='hiddenValue']").attr('value', id);
									document.getElementById(formName).submit();
								}
							};
			btns[button2] = function(){
								$(this).dialog('close');
								document.getElementById("bulkSubmit").value='';
							};
			/****************************************/

			$("form").bind("submit", function(event) {event.preventDefault();});
		   	$('#alertMsg').dialog({
				autoOpen: false,
				bgiframe: true,
				closeOnEscape: false,
				resizable: false,
				height: boxHeight,
				draggable: false,
				modal: true,
				overlay: {
					backgroundColor: '#000',
					opacity: 0.5
				},
				buttons: btns
			});
			$('.ui-dialog-titlebar-close').css('display', 'none');
			$('#alertMsg').dialog('open');

		}
		else if ( type == 'alert' ) {

			$('#alertMsg').dialog({
				autoOpen: false,
				bgiframe: true,
				closeOnEscape: true,
				resizable: false,
				height: boxHeight,
				modal: true,
				overlay: {
					backgroundColor: '#000',
					opacity: 0.5
				}
			});
			$('#alertMsg').dialog('open');

		}

	});

}

function itemInQuicklist (action, user, item, type) {
	if (user && item && type) {
		$.post(DEFAULT_URL + "/quicklist.php", {
			from: 'Quicklist',
			action: action,
			account_id: user,
			item_id: item,
			item_type: type
		}, function () {
			if (action == "add") {
				$('#confirmDiv').html("<p class=\"informationMessage\">"+showText(LANG_JS_FAVORITEADD)+"</p>");
				tb_show("", "#TB_inline?width=400&height=110&inlineId=confirmDiv");
			} else {
				$('#confirmDiv').html("<p class=\"successMessage\">"+showText(LANG_JS_FAVORITEDEL)+"</p>");
				tb_show("", "#TB_inline?width=300&height=90&inlineId=confirmDiv");
				setTimeout("window.location.reload()", 2000);
			}
		});
	}
}

/*
 * Copy username field value to email field
 */
function populateField(field_value, field_id){
	document.getElementById(field_id).value = field_value;
}

function in_array (x, matriz) {
	var txt = "¬" + matriz.join("¬") + "¬";
	var er = new RegExp ("¬" + x + "¬", "gim");
	return ( (txt.match (er)) ? true : false );
}