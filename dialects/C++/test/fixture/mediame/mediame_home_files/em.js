
function _EMeasure(ns){ns=typeof(ns)=='undefined'?'':ns;var d=document;var n=navigator;var w=window;var detectFlash=function(){var axo;if(n.plugins["Shockwave Flash"]||n.plugins["Shockwave Flash 2.0"]){var swVer2=n.plugins["Shockwave Flash 2.0"]?" 2.0":"";var desc=n.plugins["Shockwave Flash"+swVer2].description;var desc_split=desc.split(" ");var version=parseInt(desc_split[2]);return version>=6?1:0;}else{var hasObject=0;try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");hasObject=1;}catch(e){}
if(hasObject==0){try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");axo.AllowScriptAccess="always";hasObject=1;}catch(e){}}
return hasObject;}}
var size=typeof(w.innerWidth)=='number'?w:(d.documentElement&&(d.documentElement.clientWidth||d.documentElement.clientHeight)?d.documentElement:(d.body&&(d.body.clientWidth||d.body.clientHeight)?d.body:null));var encode64=function(inp){var key="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var chr1,chr2,chr3,enc3,enc4,i=0,out="";while(i<inp.length){chr1=inp.charCodeAt(i++);if(chr1>127){chr1=88;}
chr2=inp.charCodeAt(i++);if(chr2>127){chr2=88;}
chr3=inp.charCodeAt(i++);if(chr3>127){chr3=88;}
if(isNaN(chr3)){enc4=64;chr3=0;}else{enc4=chr3&63;}
if(isNaN(chr2)){enc3=64;chr2=0;}else{enc3=((chr2<<2)|(chr3>>6))&63;}
out+=key.charAt((chr1>>2)&63)+key.charAt(((chr1<<4)|(chr2>>4))&63)+key.charAt(enc3)+key.charAt(enc4);}
return encodeURIComponent(out);}
var getLastPageURL=function(){if(d.referrer){var i=(d.referrer).split('//');if(String(i[1]).indexOf(d.domain)!=0){return d.referrer;}}
return'';}
this.minSvWidth=600;this.minSvHeight=200;this.maxSvWidth=700;this.maxSvHeight=620;this.surveyPos=window._em_survey_inv_pos?window._em_survey_inv_pos.split('-'):'';this.yPos=this.surveyPos?this.surveyPos[0]:'bottom';this.xPos=this.surveyPos?this.surveyPos[1]:'right';this.surveyOffset=window._em_survey_inv_offset?window._em_survey_inv_offset.split('-'):'';this.yOffset=this.surveyOffset?(isNaN(this.surveyOffset[0])?'0':this.surveyOffset[0]):'0';this.xOffset=this.surveyOffset?(isNaN(this.surveyOffset[1])?'0':this.surveyOffset[1]):'0';if(this.xOffset=='0'&&this.xPos=='right'){this.xOffset='10';}
this.setCookie=function(c_name,value,sec){var domain=arguments[3];var exdate=new Date();exdate.setTime(exdate.getTime()+sec*1000);d.cookie=c_name+"="+escape(value)+((sec==0)?"":";expires="+exdate.toGMTString())+";domain=."+this._domain+";path=/";return this;}
this.getCookie=function(c_name){if(d.cookie.length>0){var c_start=d.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;var c_end=d.cookie.indexOf(";",c_start);if(c_end==-1){c_end=d.cookie.length;}
return unescape(d.cookie.substring(c_start,c_end));}}
return typeof(arguments[1])=='undefined'?'':arguments[1];}
this.scroll=function(){return typeof(w.pageYOffset)=='number'?w:(d.body&&(d.body.scrollLeft||d.body.scrollTop)?d.body:(d.documentElement&&(d.documentElement.scrollLeft||d.documentElement.scrollTop)?d.documentElement:null));}
this.width=function(){return size==null?0:size==w?size.innerWidth:size.clientWidth;}
this.height=function(){return size==null?0:size==w?size.innerHeight:size.clientHeight;}
this.scrollY=function(){var scroll=this.scroll();return scroll==null?0:scroll==w?scroll.pageYOffset:scroll.scrollTop;}
this.scrollX=function(){var scroll=this.scroll();return scroll==null?0:scroll==w?scroll.pageXOffset:scroll.scrollLeft;}
this._hasFlash=detectFlash();this._isIE=n.appVersion.indexOf("MSIE")>-1;this._isWin=n.appVersion.toLowerCase().indexOf("win")>-1;this._isOpera=n.userAgent.indexOf("Opera")>-1;this._isFF=n.userAgent.indexOf("Firefox")>-1;this._isChrome=n.userAgent.indexOf('Chrome')>-1;this._isOpera=n.userAgent.indexOf("Opera")>-1;this._emVersion='v4';this._emsvVersion='v4';this._emNS=ns;this._emIsSecure=location.protocol.indexOf('https')==0;this._emSchema=this._emIsSecure?'https://':'http://';this._emHost=this._emSchema+'www'+(this._emIsSecure?'9':'9')+'.effectivemeasure.net';this._emCdnHost=this._emIsSecure?this._emHost:this._emSchema+'www9.effectivemeasure.net';this._emsvHost=this._emSchema+'survey-b.effectivemeasure.net';this._emsvCdnHost=this._emIsSecure?this._emsvHost:this._emSchema+'survey-cdn.effectivemeasure.net';this._emsvParams='';this._page=encode64(location.href);this._domain=location.hostname;this._lastPage=encode64(getLastPageURL());this._optedOut=this.getCookie('_em_opt_out',0);this._stageLoaded=0;this._jsLoaded=0;this._hlLoaded=0;this.setCkOp=function(){this.setCookie('_em_sv',0,0);this.setCookie('_em_pv',0,0);this.setCookie('_em_hl',0,0);this.setCookie('_em_vt',0,0);this.setCookie('_em_v',0,0);this.setCookie('_em_opt_out',1,86400*365*5);}
this.setCkSv=function(value){this.setCookie('_em_sv',value,(value==-1?1800:86400));if(value==-2){this.set3rdCk('sv',-2);}}
this.setCkV=function(value){this.setCookie('_em_v',value,1800);}
this.setCkVt=function(value){this.setCookie('_em_vt',value,360*86400);}
this.setCkHl=function(value){this.setCookie('_em_hl',1,2592000);if(value==1){this.set3rdCk('hl',1);}}
this.setCkPn=function(value){this.setCookie('_em_pn',1,2592000);if(value==1){this.set3rdCk('pn',1);}}
this.setCkPv=function(value){this.setCookie('_em_pv',1,2592000);if(value==1){this.set3rdCk('pv',1);}}
this.getGlobalVarObj=function(){var varname;var res=new Object();for(var i=0;i<arguments.length;i++){varname=arguments[i];if((typeof w['_em_'+varname])!='undefined'){res[varname]=w['_em_'+varname];}}
return res;}
this.getEnvVars=function(flag,kf){if(_EMeasure.prototype.env&&typeof(kf)=="undefined"){env=_EMeasure.prototype.env;}else{var env=new Object();env.flag=typeof(flag)=='undefined'?0:(flag.toString().indexOf('#')==0?1:flag);env.v=this.getCookie('_em_v');env.vt=this.getCookie('_em_vt');env.hl=this.getCookie('_em_hl');env.sv=this.getCookie('_em_sv',0);env.pv=this.getCookie('_em_pv');env.pn=this.getCookie('_em_pn');_EMeasure.prototype.env=env;}
if(typeof(flag)=='undefined'||flag.toString().indexOf('#')<0){env.p=this._page;}else{var temploc=location.href.toString();if(temploc.indexOf('#')<0){env.p=encode64(temploc+flag);}else{env.p=encode64(temploc.substr(0,temploc.indexOf('#'))+flag);}}
env.r=this._lastPage;env.f=this._hasFlash&&!(window._em_chrome_compat==1&&this._isChrome)?1:0;env.ns=ns;env.rnd=Math.random();var uinput=this.getGlobalVarObj('panel_pn','plugin_v','partner_id','direct_mode','cat1_id','cat2_id','survey_rate','survey_countries','survey_language','rm_ssid','rm_device_type','env_computername','env_userdnsdomain','env_username','users','cuser','panel_id');var u='';for(x in uinput){u+=x+'='+uinput[x]+'&';}
env.u=escape(u);env.sf=this.width()>=this.minSvWidth&&this.height()>=this.minSvHeight?1:0;var res='';for(x in env){res+=x+'='+env[x]+'&';}
return res;}
this.getVtId=function(){return this.getCookie('_em_vt').substr(19,32)}
this.setVtInPlugin=function(){if(true){if(d.getElementById('_em_chrome_messenger')){d.getElementById('_em_chrome_messenger').innerText=this.getVtId();}
var ev=d.createEvent('Event');ev.initEvent("_EM_SET_VT",true,false);d.documentElement.dispatchEvent(ev);}}
this.setPnInPlugin=function(){if(true){var ev=d.createEvent('Event');ev.initEvent("_EM_SET_PN",true,false);d.documentElement.dispatchEvent(ev);}}
this.voidme=function(){}
this.getStage=function(){return d.getElementById('_em_stage_'+ns);}
this.loadStage=function(){if(!this._optedOut&&!this._stageLoaded){var stage=d.createElement("div");stage.setAttribute('id','_em_stage_'+ns);stage.setAttribute('style','display:none');var s=d.body.getElementsByTagName('script');s=s.length>0?s[s.length-1]:false;while(s&&typeof(s.parentNode)!=='undefined'&&s.parentNode!=d.body){s=s.parentNode;}
if(!s||typeof s.parentNode==='undefined'){d.body.appendChild(stage);}else{s.parentNode.insertBefore(stage,s);}
this._stageLoaded=1;}
return this;}
this.loadJs=function(flag){if(location.protocol.indexOf('http')==0&&!this._optedOut&&(!this._jsLoaded||flag.toString().indexOf('#')==0)){var script=d.createElement('script');script.type='text/javascript';script.async=true;script.src=this._emHost+'/'+this._emVersion+'/em_js?'+this.getEnvVars(flag);var head=d.getElementsByTagName("head")[0];if(head){head.appendChild(script);}else{var s=d.getElementsByTagName('script')[0];s.parentNode.insertBefore(script,s);}
this._jsLoaded=1;}
return this;}
this.trackAjaxPageview=function(pid){pid=typeof(pid)=='undefined'?'#':'#'+pid.toString().replace(/\W/g,'_');this.loadJs(pid);}
this.loadHl=function(vars){if(!this._optedOut&&!this._hlLoaded&&this._hasFlash){var emsrc=this._emCdnHost+'/'+this._emVersion+"/em4.swf";vars=vars+'&ns='+ns;var stage=this.getStage();stage.setAttribute('style','display:block;position:fixed;width: 1px; height: 1px;');stage.innerHTML=this.getSwfHtml("src",emsrc,"width","1","height","1","id","_em_hilex"+ns,'quality','low',"name","_em_hilex"+ns,"flashVars",vars);if(this._isIE){stage.style.top=(this.scrollY()+this.height()/2)+'px';stage.style.left=(this.scrollX()+this.width()/2)+'px';}
this._hlLoaded=1;}
return this;}
this.hideStage=function(){var stage=this.getStage();stage.innerHTML='<img src="'+this._emHost+'/img.gif" />';stage.style.display='none';var bg=d.getElementById('_em_bg_'+ns);if(bg){bg.setAttribute('style','display: none;');}}
this.hlCallback=function(flag){if(flag>0&&d.images){d['_em_dimg']=new Image();d['_em_dimg'].src=this._emHost+'/'+this._emVersion+'/em_dimg?'+this.getEnvVars(flag,1);}}
this.set3rdCk=function(n,v){d['_em_ck_img']=new Image();d['_em_ck_img'].src=this._emHost+'/'+this._emVersion+'/em_ck_img?'+n+'='+v+'&r='+Math.random();}
this.users='';this.user='';this.setUser=function(users,f){var uStr,pt1,pt2;pt1=[];for(x in users){pt2=[];for(var k in users[x]){if(k=='id'||k=='name'){pt2.push('"'+k+'":"'+users[x][k]+'"');}}
pt1.push("{"+pt2.join(',')+"}");}
uStr='['+pt1.join(',')+']';this.users=uStr;if(typeof(f)=="undefined"){this.set3rdCk('users',this.users);}
var stage=this.getStage();var res="<p>Who are you ? </p>";for(x in users){if(typeof(users[x]['id'])!="undefined"){res+="<input type='button' onclick='"+ns+".submitUser(\""+users[x]['id']+":"+users[x]['name']+"\");' ";res+=" name='u' id='"+users[x]['id']+"' value='"+users[x]['name']+"'><br>";}}
var bg=d.getElementById('_em_bg_'+ns)?d.getElementById('_em_bg_'+ns):d.createElement("div");bg.setAttribute('id','_em_bg_'+ns);bg.setAttribute('style','display: block; position: absolute; top: -100%; left: -100%; width: 300%; height: 300%; background-color: black; z-index:2147483646; -moz-opacity: 0.8; opacity:.80; filter: alpha(opacity=80);');d.body.appendChild(bg);stage.innerHTML=res;stage.setAttribute('style','display: block; position: absolute; top: 25%; left: 25%; width: 50%;  height: 50%; padding: 16px; border: 16px solid orange; background-color: white; z-index:2147483647; overflow: auto');}
this.submitUser=function(user){if(typeof(user)!='undefined'){this.user=user;this.set3rdCk('users',this.users);this.set3rdCk('cuser',this.user);this.hideStage();}else{alert('Please select who you are.')}}
this.optout=function(){this.setCkOp();this.set3rdCk('_em_opt_out',1);}
this.getSwfHtml=function(){var i=0;var args=arguments;var embedAttrs=new Object();var params=new Object();var objAttrs=new Object();for(i=0;i<args.length;i=i+2){var currArg=args[i].toLowerCase();switch(currArg){case"src":embedAttrs["src"]=args[i+1];params['movie']=args[i+1];break;case"id":case"width":case"height":case"class":case"name":embedAttrs[args[i]]=objAttrs[args[i]]=args[i+1];break;default:embedAttrs[args[i]]=params[args[i]]=args[i+1];}}
objAttrs["classid"]="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";objAttrs["type"]=embedAttrs["type"]="application/x-shockwave-flash";embedAttrs["allowScriptAccess"]=params["allowScriptAccess"]="always";embedAttrs["quality"]=params["quality"]="high";embedAttrs["align"]=objAttrs["align"]="middle";var str='';str+='<object ';for(i in objAttrs){str+=i+'="'+objAttrs[i]+'" ';}
str+='>';for(i in params){str+='<param name="'+i+'" value="'+params[i]+'" /> ';}
str+='<embed ';for(i in embedAttrs){str+=i+'="'+embedAttrs[i]+'" ';}
str+='> </embed>';str+='</object>';return str;}
this.loadInvitation=function(p){var stage=this.getStage();stage.setAttribute('style','display:block;width:300px;height:200px;padding:0px;margin:0px;right:10px;clear:both');stage.style.backgroundColor='transparent';stage.style.zIndex=2147483647;if(this._isIE){this.setPosInvIE();}else{stage.style.position='fixed';if(this.xPos=='left'){stage.style.left=this.xOffset+'px';}else{stage.style.right=this.xOffset+'px';}
if(this.yPos=='top'){stage.style.top=this.yOffset+'px';}else{stage.style.bottom=this.yOffset+'px';}}
var svsrc=this._emsvCdnHost+"/"+this._emsvVersion+(p.langId==2?"/eminvar.swf":"/eminv.swf");p.domain=this._domain;p.ns=ns;p.version=this._emsvVersion;p.host=this._emsvHost;p.cdnHost=this._emsvCdnHost;p.visitor=this.getCookie('_em_vt');var fvars='';for(x in p){fvars+=x+'='+p[x]+'&';}
this._emsvParams=fvars;stage.innerHTML=this.getSwfHtml("src",svsrc,"width","100%","height","100%","wmode","transparent","id","_em_inv"+ns,"name","_em_inv"+ns,"flashVars",this._emsvParams);if(this._isIE){this.posInv4IE();}}
this._timeoutFlagPosInv4IE=1;this.posInv4IE=function(){if(this._timeoutFlagPosInv4IE==1){var stage=this.getStage();var svLeft=0,svTop=0;if(stage){this.setPosInvIE();}
setTimeout(this._emNS+'.posInv4IE()',200);}}
this.setPosInvIE=function(){var svWidth=300,svHeight=200;var stage=this.getStage();stage.style.position='absolute';stage.style.width=svWidth+'px';stage.style.height=svHeight+'px';stage.style.backgroundColor='transparent';svTop=parseInt(this.height()-svHeight+this.scrollY());svLeft=parseInt(this.width()+this.scrollX()-svWidth-10);if(this.xPos=='left'){stage.style.left=this.xOffset+'px';}else{stage.style.left=svLeft>0?svLeft-this.xOffset+'px':'0px';}
if(this.yPos=='top'){stage.style.top=this.yOffset+'px';}else{stage.style.top=svTop>0?svTop-this.yOffset+'px':'200px';}}
this.hideInvitation=function(){if(this._isIE){this._timeoutFlagPosInv4IE=0;}
this.hideStage();}
this.unloadSurvey=function(){this._timeoutFlagPosMain=0;this.hideStage();if(this._isIE){var stags=d.getElementsByTagName('select');if(stags!=null){for(var i=0;i<stags.length;i++){stags[i].style.visibility='visible';}}}}
this._timeoutFlagPosMain=1;this.posMain=function(){if(this._timeoutFlagPosMain==1){var stage=this.getStage();var screenW=this.width()-20;var screenH=this.height()-20;var svWidth=screenW<this.minSvWidth?this.minSvWidth:(screenW>this.maxSvWidth?this.maxSvWidth:screenW);var svHeight=screenH<this.minSvHeight?this.minSvHeight:(screenH>this.maxSvWidth?this.maxSvWidth:screenH);var svLeft=0,svTop=0;stage.style.width=svWidth+'px';stage.style.height=svHeight+'px';svTop=parseInt((this.height()-svHeight)/2+this.scrollY());svLeft=parseInt((this.width()-svWidth)/2);if(this._isIE){stage.style.position='absolute';stage.style.top=svTop>0?svTop+'px':'0px';}else{stage.style.position='fixed';stage.style.bottom=parseInt((this.height()-svHeight)/2)+'px';}
stage.style.left=svLeft>0?svLeft+'px':'0px';setTimeout(this._emNS+'.posMain()',200);}}
this.loadSurvey=function(tcolor,ttxtcolor,title,rgId){if(!this._isOpera){this.setStageVisible(0);}
var stage=this.getStage();var p="themeColor="+tcolor+'&themeTextColor='+ttxtcolor+'&headerText='+title+'&rgId='+rgId+'&';if(this._emsvParams!=''){p=p+this._emsvParams;var svsrc=this._emsvCdnHost+"/"+this._emsvVersion+"/emsv.swf";stage.innerHTML=this.getSwfHtml("src",svsrc,"width","100%","height","100%","id","_em_survey"+ns,"name","_em_survey"+ns,"wmode","opaque","flashVars",p);}}
this.setStageVisible=function(v){if(!this._isIE){var stage=this.getStage();stage.style.visibility=v==1?'visible':'hidden';}}
this.showSurvey=function(){this.setStageVisible(1);this._timeoutFlagPosInv4IE=0;if(this._isIE){var stags=d.getElementsByTagName('select');if(stags){for(i=0;i<stags.length;i++){stags[i].style.visibility='hidden';}}}
this.posMain();}
this.showFFArrow=function(str){var stage=d.createElement("div");stage.setAttribute('id','_em_ff_arrow_'+ns);stage.setAttribute('style','display:block;position:fixed;top:0px;right:0px;width:200px;padding:0px;margin:0;border:1px solid #bf8a01;border-top:0px;-moz-border-radius-bottomleft: 10px;-moz-border-radius-bottomright: 10px; background-color:#ffc703; background-image: -moz-linear-gradient(top, #ffc703, #ffe970, #ffd016, #ffc703 ); height:100px;');stage.style.zIndex=2147483647;var p='<div style="width:100%;height:100%;background:transparent url('+this._emsvCdnHost+"/"+this._emsvVersion+'/images/plugin_arrow_bg_sm.gif) no-repeat 50px;2px;"><p style="padding:5px;width:100px;">'+str+'</p></div>';stage.innerHTML=p;d.body.insertBefore(stage,d.body.firstChild);}}
if(document['_em_is_panel']){window['_em_is_panel']=document['_em_is_panel'];}
if(window['_em_is_panel']&&!window['_emp']){var _emp=new _EMeasure('_emp');_emp.loadStage().loadJs().voidme();}else if(!window['_em']){var _em=new _EMeasure('_em');_em.loadStage().loadJs().voidme();}