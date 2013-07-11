var currentSlide = 0;
var mytime = 0;
var numberOfSlider = 4;

function scrollBanner(slideId) {

$("#slide-id-"+currentSlide).hide();

clearTimeout(mytime);
	mytime = setTimeout("scrollBanner('next')", 5000 );

if(slideId == 'next') {
slideId = (currentSlide+1)%numberOfSlider;
}

if(slideId == 'back') {
if(currentSlide == 0) slideId = 3;
else slideId = currentSlide-1;
}

$('#slide-link-'+currentSlide).toggleClass('selected');

currentSlide = slideId;
myPosition = 625*(currentSlide);

//$("#slides-scroller").animate({"left": "-"+myPosition+"px"}, "slow");

$("#slide-id-"+currentSlide).show();
	
$('#slide-link-'+currentSlide).toggleClass('selected');

return false;
	
}


$(document).ready(function() {


	$('.region-slide').hide();
	$('#slide-id-0').show();
	

	mytime = setTimeout("scrollBanner('next')", 8000 );

	$('.slider-control a').click(function() {
		scrollBanner($(this).attr('rel'));
		return false;
	});

	$('#slide-link-'+currentSlide).toggleClass('selected');
	
	
	
	$("#slides-holder").hover(
  function () {
  clearTimeout(mytime);
  
  }, 
  function () {
  	mytime = setTimeout("scrollBanner('next')", 8000 );
  
  }
);
	var maxHeight = 0;
	
	$('.region-slide').each(function(index) {
    
    if($(this).height() > maxHeight) maxHeight = $(this).height();
    
  });
		
	$("#slides-holder").css("height",maxHeight+"px");
	
});
