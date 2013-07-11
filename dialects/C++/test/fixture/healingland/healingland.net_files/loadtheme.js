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

function loadTheme(url, select, id, destiny, query) {

	var url = url;
	var select = select;
	var id = id;

	switch ( select ) {
		case 'country_id':
			var fillSelect = 'state_id';
			var nextSelects = 'state_id,region_id,city_id,area_id';
			var prevSelects = 'country_id';
			break;
		case 'state_id':
			var fillSelect = 'region_id';
			var nextSelects = 'region_id,city_id,area_id';
			var prevSelects = 'country_id,state_id';
			break;
		case 'region_id':
			var fillSelect = 'city_id';
			var nextSelects = 'city_id,area_id';
			var prevSelects = 'country_id,state_id,region_id';
			break;
		case 'city_id':
			var fillSelect = 'area_id';
			var nextSelects = 'area_id';
			var prevSelects = 'country_id,state_id,region_id,city_id';
			break;
	}
	if (id) {
		// displaying loading image
		$('#div_country_id').css('display', 'none');
		$('#div_state_id').css('display', 'none');
		$('#div_region_id').css('display', 'none');
		$('#div_city_id').css('display', 'none');
		$('#div_area_id').css('display', 'none');
		$('#div_img_loading').css('display', '');

		//$.getJSON(url+'/location.php?'+select+'='+id, function(res) {
		//alert(destiny+" "+query);
		$.getJSON(url+'/settheme.php?theme='+id+"&destiny="+destiny+"&query="+query, function(res) {
			prevs = prevSelects.split(',');
			if (res == 'empty') {
				$('#div_img_loading').css('display', 'none');
				$.each(prevs, function(i, prev) {
					$('#div_'+prev).css('display', '');
				});
				$('#div_'+fillSelect).css('display', 'none');
			} else {
				//$('#div_'+fillSelect).css('display', '');
				var items = res.split(',');
				var id = 0;
				var option = new Array();
				$.each(items, function(i, item) {
					if ( id > 0 ) option[id] = item;
					id = item;
				});
				$('#'+fillSelect).empty();
				$('#'+fillSelect).addOption('', message);
				$('#'+fillSelect).addOption(option);
				$('#'+fillSelect+' option[value=]').attr('selected',true);
				$('#div_img_loading').css('display', 'none');
				$.each(prevs, function(i, prev) {
					$('#div_'+prev).css('display', '');
				});
				$('#div_'+fillSelect).css('display', '');
				$('#'+fillSelect).focus();
				nexts = nextSelects.split(',');

				$.each(nexts, function(i, next) {
					if (i > 0) {
						$('#'+next).empty();
						$('#'+next+' option[value=]').attr('selected',true);
						$('#div_'+next).css('display', 'none');
					}
				});
			}
		});
	} else {
		nexts = nextSelects.split(',');
		$.each(nexts, function(i, next) {
			$('#'+next+' option[value=]').attr('selected',true);
			$('#div_'+next).css('display', 'none');
		});
	}

	hideNewCity();
	containerReload();
}

function showNewCity(toHide) {
	$('#'+toHide+' option[value=]').attr('selected',true);
	$('#div_'+toHide).css('display', 'none');
	$('#addNewCity').css('display', '');
}

function hideNewCity(toShow) {
	$('#'+toShow+' option[value=]').attr('selected',true);
	$('#div_'+toShow).css('display', '');
	$('#addNewCity').css('display', 'none');
}