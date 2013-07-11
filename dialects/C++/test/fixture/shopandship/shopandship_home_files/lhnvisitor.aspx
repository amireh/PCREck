
var lhnTrack='';
var blhnInstalled=0;
if (typeof lhnInstalled !='undefined'){lhnTrack='f';blhnInstalled=1;}
var lhnInstalled=1;
var InviteRepeats;
var zbrepeat=1;
var bInvited=0;
var bLHNOnline=0;
InviteRepeats=0;

function pausecomp(millis) 
{
zadate = new Date();
var zcurDate = null;

do { var zcurDate = new Date(); } 
while(zcurDate-zadate < millis);
} 

if (blhnInstalled==0)
{
var lhnjava;
var lhnreg = new RegExp('/');
var lhnreferrer = escape(document.referrer);
var lhnwindow='0';

var lhnpagetitle=(document.title.length>500)?escape(document.title.substring(0,500)):escape(document.title);
var srnd;
var lhnsShortPath = escape(window.location.pathname);

var lhnsPath=escape(this.location);

if (lhnsShortPath=='/')
{
	var lhnsPage = escape(window.location.href);
}
else
{
	var lhnsPage = escape(lhnsShortPath.substring(lhnsShortPath.lastIndexOf('/') + 1));
}
if ( !(navigator.javaEnabled()) ) {
  lhnjava="No" ;
} else {
  lhnjava="Yes" ;
}
var lhnrand_no = Math.random();


var lhnsRes;
var lhnsDepth;
if (window.screen) {
lhnsRes=screen.width + 'x' + screen.height;
lhnsDepth=screen.colorDepth;
}

var lhnflashversion = 0;
}

var lhnhaveqt =false;
function lhnqtsupported()
{
	if (navigator.plugins) {
	for (i=0; i < navigator.plugins.length; i++ ) { 
		if (navigator.plugins[i].name.indexOf("QuickTime") >= 0) 
		{ lhnhaveqt = true; } 
		} 
	}
	return lhnhaveqt
}

function WriteLHNMessage(lhnmes,AutoInvite)
{
	var LHpopwhat=(AutoInvite==1)?"OpenLHNChat();":"Invitation();";
	var url=(document.location.protocol=='https:')?"<img style='position:absolute;top:-5000px;left:-5000px;' width='1' height='1' src='https://www.livehelpnow.net/lhn/jsutil/showninvitationmessage.aspx?iplhnid=80.249.213.61|8043|2/13/2012 10:43:24 AM' />":"<img style='position:absolute;top:-5000px;left:-5000px;' width='1' height='1' src='http://www.livehelpnow.net/lhn/jsutil/showninvitationmessage.aspx?iplhnid=80.249.213.61|8043|2/13/2012 10:43:24 AM' />";

	if (zCustomInvitation==''){
		document.getElementById("Zsleft").innerHTML = "<div class=\"LVchat_window_top\"></div><div class=\"LVchat_window_middle\"><div class=\"LVchat_window_middle_inner\" style=\"background: !important;\"><div class=\"LVchat_window_blik\"><div class=\"LVchat_window_message_top\"></div><div class=\"LVchat_window_message_bottom\">"+lhnmes+"</div><div class=\"LVchat_window_buttons\"><a onclick=\"CloseLHNInvite();return false;\" href=\"#\"></a><a onclick=\"" + LHpopwhat + "return false;\" href=\"#\"></a><div style=\"clear:both;width:1px;height:1px;overflow:hidden;\"></div></div></div></div></div><div class=\"LVchat_window_bottom\"></div>"+url;
		}
	else
		{
		document.getElementById("Zsleft").innerHTML = lhnmes+url;
		}
	

	if (Zstepx==-10)
		{
		Zslide();
		if (Zmutechime != '1')
		{
			if (navigator.userAgent.toLowerCase().indexOf('msie')>0)
			{
			var body = document.getElementsByTagName("body");
			var divE = document.createElement('bgsound');
			divE.id = "LHNSound";
			divE.style.position = "absolute";
			divE.style.left = "0px";
			divE.style.top = "0px";
			divE.hidden = "true";
			if (document.location.protocol=='https:')
			{
				divE.src="https://www.livehelpnow.net/lhn/sounds/beep0.wav";
			}
			else
			{
				divE.src="http://www.livehelpnow.net/lhn/sounds/beep0.wav";
			}
			divE.autostart="true";
			divE.loop="0"
			body[0].appendChild(divE);
			setTimeout("document.getElementsByTagName('body')[0].removeChild(document.getElementById('LHNSound'))", 2000);
			}
			else
			{
			if (lhnqtsupported() == true){
				var body = document.getElementsByTagName("body");
				var divE = document.createElement('embed');
				divE.id = "zaBellSound";
				divE.style.position = "absolute";
				divE.style.left = "-100px";
				divE.style.top = "-100px";
				divE.style.width = "0";
				divE.style.height = "0";
				divE.visible = "false";
				//divE.autostart="true";
				if (document.location.protocol=='https:')
				{
					divE.src="https://www.livehelpnow.net/lhn/sounds/beep0.wav";
				}
				else
				{
					divE.src="http://www.livehelpnow.net/lhn/sounds/beep0.wav";
				}
				body[0].appendChild(divE);
				setTimeout("document.getElementsByTagName('body')[0].removeChild(document.getElementById('zaBellSound'))", 2000);
				}
			}
		}
		}
   

}



function OpenLHNChat()
{
if(typeof CustomOpenLHNChat == 'function') { 
CustomOpenLHNChat();
return false;
}
var wleft = (screen.width - 580-32) / 2;
var wtop = (screen.height - 420-96) / 2;
var sScrollbars=(bLHNOnline==0)?"yes":"no";
<!--HTTPS OR NOT: RELEASENOTE-->
	if (document.location.protocol=='https:' || (typeof lhnJsHost !='undefined' && lhnJsHost == "https://"))
	{
		window.open('https://www.livehelpnow.net/lhn/livechatvisitor.aspx?zzwindow=' + lhnwindow + '&lhnid=' + 8043 + '&d=' + 0,'lhnchat','left=' + wleft + ',top=' + wtop + ',width=580,height=435,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=' + sScrollbars + ',copyhistory=no,resizable=yes');
	}
	else
	{
		window.open('http://www.livehelpnow.net/lhn/livechatvisitor.aspx?zzwindow=' + lhnwindow + '&lhnid=' + 8043 + '&d=' + 0,'lhnchat','left=' + wleft + ',top=' + wtop + ',width=580,height=435,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=' + sScrollbars + ',copyhistory=no,resizable=yes');
	}

    if (typeof Zstepx != 'undefined')
	{
    if (Zstepx==10) 
    {
    Zslide();
    }
    }
}
function Invitation()
{
var wleft = (screen.width - 580-32) / 2;
var wtop = (screen.height - 420-96) / 2;
	if (document.location.protocol=='https:')
	{
		window.open('https://www.livehelpnow.net/lhn/livechat.aspx?fullname=Visitor&email=unknown_email@livehelpnow.com&lhnmes=lhn&zzwindow=' + lhnwindow + '&lhnid=' + 8043,'lhnchat','left=' + wleft + ',top=' + wtop + ',width=580,height=435,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	}
	else
	{
	    window.open('http://www.livehelpnow.net/lhn/livechat.aspx?fullname=Visitor&email=unknown_email@livehelpnow.net&lhnmes=lhn&zzwindow=' + lhnwindow + '&lhnid=' + 8043,'lhnchat','left=' + wleft + ',top=' + wtop + ',width=580,height=435,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	}
   
    Zslide();
}

if (('0'!='') && ('0'!=''))
{
	if (document.location.protocol=='https:')
	{
		document.write("<a href=\"#\" onclick=\"OpenLHNChat();return false;\"><img width=0 height=0 alt='Live Help' id=lhnchatimg border=0 nocache src='https://www.livehelpnow.net/lhn/functions/imageserver.ashx?lhnid=" + 8043 + "&java=" + lhnjava + "&referrer=" + lhnreferrer + "&pagetitle=" + lhnpagetitle + "&pageurl=" + lhnsPath + "&page=" + lhnsPage + "&zimg=" + 0 + "&sres=" + lhnsRes + "&sdepth=" + lhnsDepth + "&flash=" + lhnflashversion + "&custom1=&custom2=&custom3=&t=" +lhnTrack + "&d=0&rndstr=" + lhnrand_no + "'></a>");
	}
	else
	{
		document.write("<a href=\"#\" onclick=\"OpenLHNChat();return false;\"><img width=0 height=0 alt='Live Help' id=lhnchatimg border=0 nocache src='http://www.livehelpnow.net/lhn/functions/imageserver.ashx?lhnid=" + 8043 + "&java=" + lhnjava + "&referrer=" + lhnreferrer + "&pagetitle=" + lhnpagetitle + "&pageurl=" + lhnsPath + "&page=" + lhnsPage + "&zimg=" + 0 + "&sres=" + lhnsRes + "&sdepth=" + lhnsDepth + "&flash=" + lhnflashversion + "&custom1=&custom2=&custom3=&t=" +lhnTrack + "&d=0&rndstr=" + lhnrand_no + "'></a>");
	}

}
else
{
	if (document.location.protocol=='https:')
	{
		document.write("<a href=\"#\" onclick=\"OpenLHNChat();return false;\"><img alt='Live Help' id=lhnchatimg border=0 nocache src='https://www.livehelpnow.net/lhn/functions/imageserver.ashx?lhnid=" + 8043 + "&java=" + lhnjava + "&referrer=" + lhnreferrer + "&pagetitle=" + lhnpagetitle + "&pageurl=" + lhnsPath + "&page=" + lhnsPage + "&zimg=" + 0 + "&sres=" + lhnsRes + "&sdepth=" + lhnsDepth + "&flash=" + lhnflashversion + "&custom1=&custom2=&custom3=&t=" +lhnTrack + "&d=0&rndstr=" + lhnrand_no + "'></a>");
	}
	else
	{
		document.write("<a href=\"#\" onclick=\"OpenLHNChat();return false;\"><img alt='Live Help' id=lhnchatimg border=0 nocache src='http://www.livehelpnow.net/lhn/functions/imageserver.ashx?lhnid=" + 8043 + "&java=" + lhnjava + "&referrer=" + lhnreferrer + "&pagetitle=" + lhnpagetitle + "&pageurl=" + lhnsPath + "&page=" + lhnsPage + "&zimg=" + 0 + "&sres=" + lhnsRes + "&sdepth=" + lhnsDepth + "&flash=" + lhnflashversion + "&custom1=&custom2=&custom3=&t=" +lhnTrack + "&d=0&rndstr=" + lhnrand_no + "'></a>");
	}
}

