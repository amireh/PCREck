//================================================================================

//================================================================================

function containerReload(){
	var Content;
	if ($.browser.msie && $.browser.version == 6){
		try{
			xmlhttp = new XMLHttpRequest();
		}
		catch(ee){
			try{
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e){
				try{
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(E){
					xmlhttp = false;
				}
			}
		}
		try{
			Content = document.getElementById('LocationbaseAdvancedSearch').innerHTML;
			document.getElementById('LocationbaseAdvancedSearch').innerHTML = "";
			document.getElementById('LocationbaseAdvancedSearch').innerHTML = Content;
		} catch(e){
			Content = document.getElementById('formsLocation').innerHTML;
			document.getElementById('formsLocation').innerHTML = "";
			document.getElementById('formsLocation').innerHTML = Content;
		}
	}
}

function loadLocation(url, edir_locations, level, childLevel, id) {

	var edir_locations = edir_locations.split(',');
	
	if (!isNaN(id)) {		

		for (i=0; i<edir_locations.length; i++) {
			if (edir_locations[i]>level) {
				text = $("#l_location_"+edir_locations[i]).attr("text");
				$("#location_"+edir_locations[i]).html("<option id=\"l_location_"+edir_locations[i]+"\" value=\"\">"+text+"</option>");
				$('#div_location_'+edir_locations[i]).css('display', 'none');
				$('#new_location'+edir_locations[i]+'_field').attr('value', '');
				$('#div_new_location'+edir_locations[i]+'_field').css('display', 'none');				
			}
		}	

		$("#div_location_"+childLevel).css("display","");
		$('#location_'+childLevel).css('display', 'none');
		$('#div_img_loading_'+childLevel).css('display', '');
		$('#box_no_location_found_'+childLevel).css('display', 'none');
                try{
                    $('#div_select_'+childLevel).css('display', 'none');
                } catch(e){}

		$.get(url+"/location.php",{id: id, level: level, childLevel: childLevel, type:'byId'},function(location){
			
			if (location!="empty"){
				var text = $("#l_location_"+childLevel).attr("text");			
				$("#location_"+childLevel).html(location);
				//$("#div_location_"+childLevel).css("display","");
				$("#l_location_"+childLevel).html(text);
				$('#location_'+childLevel).css('display', '');
                try{
                    $('#div_select_'+childLevel).css('display', '');
                } catch(e){}
				display_level_limit = childLevel;
			} else {
				if (!id) 
					$("#div_location_"+childLevel).css("display", 'none');
				else {
                    try{
                        $('#div_select_'+childLevel).css('display', '');
                    } catch(e){}
					$('#box_no_location_found_'+childLevel).css('display', '');
                }
			}
				
			if (childLevel && id)
				$('#div_new_location'+childLevel+'_link').css('display', '');
			else
				$('#div_new_location'+childLevel+'_link').css('display', 'none');			

			$('#div_img_loading_'+childLevel).css('display', 'none');	
			
		});
	}	
	containerReload();
}


function loadLocationsChildtb (url, level, id, childLevel) {
	if (!isNaN(id)) {
		$.get(url+"/location.php",{id: id, level: level, childLevel: childLevel, type:'byId'},function(location){
			var text = $("#l_location_"+childLevel).attr("text");	
			if (location!="empty"){
				$("#select_L"+childLevel).html(location);
				$("#l_location_"+childLevel).html(text);
			} else
				$("#select_L"+childLevel).html('<option id=\"l_location_'+childLevel+'\" value=\"\">'+text+'</option>');
		});
	} else //{
		//alert ('é NaN!');
	//}
	containerReload();
}


function loadAllLocationstb (url, level) {
	$.get(url+"/location.php",{level: level, type:'All'},function(location){
		if (location!="empty"){
			var text = $("#l_location_"+level).attr("text");
			alert('all text: '+text);
			$("#select_L"+level).html(location);
			$("#l_location_"+level).html(text);
		}
	});
	containerReload();
}


function loadLocationsChild (url, level, id, childLevel) {

	if (!isNaN(id)) {
		$.get(url+"/location.php",{id: id, level: level, childLevel: childLevel, type:'byId'},function(location){
			var text = $("#l_location_"+childLevel).attr("text");			
			if (location!="empty"){
				$("#default_L"+childLevel+"_id").html(location);
				$("#l_location_"+childLevel).html(text);
			} else
				$("#default_L"+childLevel+"_id").html('<option id=\"l_location_'+childLevel+'\" value=\"\">'+text+'</option>');
		});
	} 
	containerReload();
}


function loadAllLocations (url, level) {
	$.get(url+"/location.php",{level: level, type:'All'},function(location){
		if (location!="empty"){
			var text = $("#l_location_"+level).attr("text");			
			$("#default_L"+level+"_id").html(location);
			$("#l_location_"+level).html(text);
		}
	});
	containerReload();
}


function formLocations_submit(level, form) {	
	if (level<=3) {		
		for (i=(level+1); i<=4; i++)
			if ($('#select_location'+i).val())
				$('#select_location'+i).remove();
	}
	form.submit();
}


function showNewLocationField(level, edir_locations, back) {

	var edir_locations = edir_locations.split(',');

	for (i=0; i<edir_locations.length; i++) {
		if (edir_locations[i]>=level) {
			$('#location_'+edir_locations[i]+' option[value=]').attr('selected',true);
			$('#div_location_'+edir_locations[i]).css('display', 'none');
			$('#new_location'+edir_locations[i]+'_field').attr('value', '');
			$('#div_new_location'+edir_locations[i]+'_field').css('display', 'none');
		}
	}		
	$('#div_new_location'+level+'_field').css('display', '');	
	$('#div_new_location'+level+'_link').css('display', 'none');
	if (!back)
		$('#div_new_location'+level+'_back').css('display', 'none');
	else
		$('#div_new_location'+level+'_back').css('display', '');	

}

function hideNewLocationField(level, edir_locations) {

	var edir_locations = edir_locations.split(',');

	for (i=0; i<edir_locations.length; i++) {
		if (edir_locations[i]>=level) {
			$('#location_'+edir_locations[i]+' option[value=]').attr('selected',true);
			$('#new_location'+edir_locations[i]+'_field').attr('value', '');
			$('#div_new_location'+edir_locations[i]+'_field').css('display', 'none');
		}
	}	
	$('#div_location_'+level).css('display', '');
	$('#div_new_location'+level+'_link').css('display', '');
}

