;(function($){$.fn.addOption=function()
{var add=function(el,v,t,sO)
{var option=document.createElement("option");option.value=v,option.text=t;var o=el.options;var oL=o.length;if(!el.cache)
{el.cache={};for(var i=0;i<oL;i++)
{el.cache[o[i].value]=i;}}
if(typeof el.cache[v]=="undefined")el.cache[v]=oL;el.options[el.cache[v]]=option;if(sO)
{option.selected=true;}};var a=arguments;if(a.length==0)return this;var sO=true;var m=false;var items,v,t;if(typeof(a[0])=="object")
{m=true;items=a[0];}
if(a.length>=2)
{if(typeof(a[1])=="boolean")sO=a[1];else if(typeof(a[2])=="boolean")sO=a[2];if(!m)
{v=a[0];t=a[1];}}
this.each(function()
{if(this.nodeName.toLowerCase()!="select")return;if(m)
{for(var item in items)
{add(this,item,items[item],sO);}}
else
{add(this,v,t,sO);}});return this;};$.fn.ajaxAddOption=function(url,params,select,fn,args)
{if(typeof(url)!="string")return this;if(typeof(params)!="object")params={};if(typeof(select)!="boolean")select=true;this.each(function()
{var el=this;$.getJSON(url,params,function(r)
{$(el).addOption(r,select);if(typeof fn=="function")
{if(typeof args=="object")
{fn.apply(el,args);}
else
{fn.call(el);}}});});return this;};$.fn.removeOption=function()
{var a=arguments;if(a.length==0)return this;var ta=typeof(a[0]);var v,index;if(ta=="string"||ta=="object"||ta=="function")
{v=a[0];if(v.constructor==Array)
{var l=v.length;for(var i=0;i<l;i++)
{this.removeOption(v[i],a[1]);}
return this;}}
else if(ta=="number")index=a[0];else return this;this.each(function()
{if(this.nodeName.toLowerCase()!="select")return;if(this.cache)this.cache=null;var remove=false;var o=this.options;if(!!v)
{var oL=o.length;for(var i=oL-1;i>=0;i--)
{if(v.constructor==RegExp)
{if(o[i].value.match(v))
{remove=true;}}
else if(o[i].value==v)
{remove=true;}
if(remove&&a[1]===true)remove=o[i].selected;if(remove)
{o[i]=null;}
remove=false;}}
else
{if(a[1]===true)
{remove=o[index].selected;}
else
{remove=true;}
if(remove)
{this.remove(index);}}});return this;};$.fn.sortOptions=function(ascending)
{var sel=$(this).selectedValues();var a=typeof(ascending)=="undefined"?true:!!ascending;this.each(function()
{if(this.nodeName.toLowerCase()!="select")return;var o=this.options;var oL=o.length;var sA=[];for(var i=0;i<oL;i++)
{sA[i]={v:o[i].value,t:o[i].text}}
sA.sort(function(o1,o2)
{o1t=o1.t.toLowerCase(),o2t=o2.t.toLowerCase();if(o1t==o2t)return 0;if(a)
{return o1t<o2t?-1:1;}
else
{return o1t>o2t?-1:1;}});for(var i=0;i<oL;i++)
{o[i].text=sA[i].t;o[i].value=sA[i].v;}}).selectOptions(sel,true);return this;};$.fn.selectOptions=function(value,clear)
{var v=value;var vT=typeof(value);if(vT=="object"&&v.constructor==Array)
{var $this=this;$.each(v,function()
{$this.selectOptions(this,clear);});};var c=clear||false;if(vT!="string"&&vT!="function"&&vT!="object")return this;this.each(function()
{if(this.nodeName.toLowerCase()!="select")return this;var o=this.options;var oL=o.length;for(var i=0;i<oL;i++)
{if(v.constructor==RegExp)
{if(o[i].value.match(v))
{o[i].selected=true;}
else if(c)
{o[i].selected=false;}}
else
{if(o[i].value==v)
{o[i].selected=true;}
else if(c)
{o[i].selected=false;}}}});return this;};$.fn.copyOptions=function(to,which)
{var w=which||"selected";if($(to).size()==0)return this;this.each(function()
{if(this.nodeName.toLowerCase()!="select")return this;var o=this.options;var oL=o.length;for(var i=0;i<oL;i++)
{if(w=="all"||(w=="selected"&&o[i].selected))
{$(to).addOption(o[i].value,o[i].text);}}});return this;};$.fn.containsOption=function(value,fn)
{var found=false;var v=value;var vT=typeof(v);var fT=typeof(fn);if(vT!="string"&&vT!="function"&&vT!="object")return fT=="function"?this:found;this.each(function()
{if(this.nodeName.toLowerCase()!="select")return this;if(found&&fT!="function")return false;var o=this.options;var oL=o.length;for(var i=0;i<oL;i++)
{if(v.constructor==RegExp)
{if(o[i].value.match(v))
{found=true;if(fT=="function")fn.call(o[i],i);}}
else
{if(o[i].value==v)
{found=true;if(fT=="function")fn.call(o[i],i);}}}});return fT=="function"?this:found;};$.fn.selectedValues=function()
{var v=[];this.selectedOptions().each(function()
{v[v.length]=this.value;});return v;};$.fn.selectedTexts=function()
{var t=[];this.selectedOptions().each(function()
{t[t.length]=this.text;});return t;};$.fn.selectedOptions=function()
{return this.find("option:selected");};})(jQuery);