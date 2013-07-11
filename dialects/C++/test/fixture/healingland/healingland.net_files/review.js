function review_formPost(postUrl) {
 	
 	postData = new Object();
 	postData.postType			= 'ajax';
 	postData.submit				= 'submit';
 	postData.item_type			= $('#item_type').attr('value');
 	postData.item_id			= $('#item_id').attr('value');
 	postData.reviewer_name 		= $('#reviewer_name').attr('value');
 	postData.review_title 		= $('#review_title').attr('value');
 	postData.reviewer_email 	= $('#reviewer_email').attr('value');
 	postData.review 			= $('#review').attr('value');
 	postData.reviewer_location 	= $('#reviewer_location').attr('value');
 	postData.captchatext 		= $('#captchatext').attr('value');
 	postData.rating      		= $('#rating').attr('value');
 	
 	$("#TB_ajaxContent").html("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");
 	$("#TB_load").show();
 	
 	$.post(postUrl, postData, function(html) { $("#TB_ajaxContent").html(html); }, 'html');
 		
}