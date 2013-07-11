function enableSocialBookMarking(id) {
	
	var left = document.getElementById('link_social_'+id).offsetLeft;
	var top = document.getElementById('link_social_'+id).offsetTop;
	$('#allSocial_'+id).css('display', '');

}

function disableSocialBookMarking(id) {

	$('#allSocial_'+id).css('display', 'none');
	
}
