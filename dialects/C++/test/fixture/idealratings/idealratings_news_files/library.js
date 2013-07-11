Array.prototype.has = function (v) {
	var i;
	for (i = 0; i < this.length; i = i + 1) {
		if (this[i] === v) {
			return i;
		}
	}
	return false;
};

(function () {
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  this.oa_class = function(){};
  oa_class.extend = function(prop) {
  	var _super, prototype, name;
    _super = this.prototype;
    initializing = true;
    prototype = new this();
    initializing = false;
    for (name in prop) {
    	if (prop.hasOwnProperty(name)) {
      prototype[name] = typeof prop[name] === "function" &&
        typeof _super[name] === "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
          	var tmp, ret;
            tmp = this._super;
            this._super = _super[name];
            ret = fn.apply(this, arguments);       
            this._super = tmp;	           
            return ret;
          };
        })(name, prop[name]) :  prop[name];
    	}
    }
    function oa_class() {
      if ( !initializing && this.init ){
        this.init.apply(this, arguments);}
    }
    oa_class.prototype = prototype;
    oa_class.prototype.constructor = oa_class;
    oa_class.extend = arguments.callee;	   
    return oa_class;
  };
})();

/* ===================================================== */
/* ONEALL API */
/* ===================================================== */
var oneall = {};

/* ===================================================== */
/* MULTILANGUAGE SUPPORT */
/* ===================================================== */
oneall.i18n = {
	'Link your account to %s' : '',
	'This %s account is linked to another user' : '',
	'Account successfully linked to %s': '',
	'Account successfully unlinked from %s': '',
	'Connecting...': ''
};


function _(s) {
	var expression, parts, part, translation, regexp, i;

	if (typeof oneall.i18n === 'object' && typeof oneall.i18n[s] === 'string') {
		if (oneall.i18n[s].length > 0) {
			expression = oneall.i18n[s];
		} else {
			expression = s;
		}
	} else {
		expression = s;
	}

	if (arguments.length > 1) {
		parts = expression.split('%');

		if (parts.length > 1) {
			translation = parts[0];
			regexp = /^([ds])(.*)$/;

			for (i = 1; i < parts.length; i = i + 1) {
				part = regexp.exec(parts[i]);
				if (!part || arguments[i] === null) {
					continue;
				}
				if (part[1] === 'd') {
					translation = translation + parseInt(arguments[i], 10);
				} else if (part[1] === 's') {
					translation = translation + arguments[i];
				}
				translation = translation + part[2];
			}
		} else {
			translation = expression;
		}
	} else {
		translation = expression;
	}
	return translation;
}

/* ===================================================== */
/* Settings */
/* ===================================================== */
oneall.user_settings = {
	plugin_protocol: 'http',
	plugin_language: 'en',
	connect_protocol: 'https',
	application_domain: 'idealratings.api.oneall.com',
	application_domains: ["idealratings.com", "*.idealratings.com"],
	application_callback_uri : '',
	parent_uri: '',
	base_domain: '',
	button_style: 'icons',
	demo_mode: false
};

oneall.user_settings.get_application_uri = function () {
	return this.plugin_protocol + '://' + this.application_domain;
};

oneall.user_settings.get_provider_connect_uri = function () {
	return this.get_application_uri() + '/socialize/connect.html';
};

oneall.user_settings.get_provider_login_data_frame_uri = function () {
	return this.get_application_uri() + '/socialize/login/data/frame/';
};

oneall.user_settings.get_provider_login_frame_uri = function () {
	return this.get_application_uri() + '/socialize/login/frame/';
};

oneall.user_settings.get_provider_login_modal_uri = function () {
	return this.get_application_uri() + '/socialize/login/modal/';
};

oneall.user_settings.get_provider_link_frame_uri = function () {
	return this.get_application_uri() + '/socialize/link/frame/';
};

oneall.user_settings.get_provider_sharing_box_uri = function () {
	return this.get_application_uri() + '/socialize/sharing/box/';
};




oneall.user_settings.get_provider_redirect_uri = function () {
	return this.get_application_uri() + '/socialize/redirect.html';
};


/* ===================================================== */
/* Security */
/* ===================================================== */
(function () {
	var domains, domain, document_domain, valid_domain, i, regexp;

	domains = oneall.user_settings.application_domains;
	document_domain = document.domain;

	/* Add Application Domain */
	domains.push(oneall.user_settings.application_domain);

	/* Check for valid domains */
	valid_domain = false;
	i = 0;

	while (!valid_domain && i < domains.length) {

		/* Cleanup Domain */
		domain = domains[i];
		domain = domain.split('?').join('');
		domain = domain.split('$').join('');
		domain = domain.split('.').join('\\.');
		domain = domain.split('*').join('(.*)');

		/* Check if matches */
		regexp = new RegExp('^' + domain, 'i');

		if (document_domain.match(regexp)) {
			oneall.user_settings.base_domain = document_domain;
			valid_domain = true;
		}
		i = i + 1;
	}
}());

/* Check if this domain may use the API */
if (oneall.user_settings.base_domain.length === 0) {
	throw new Error("[ONEALL SOCIAL API] The domain " + document.domain + " is not allowed to include this script. Please check your application security settings.");
}


/* ===================================================== */
/* Browser Detection and Settings */
/* ===================================================== */
oneall.browser = {};
oneall.browser.mobile_clients = ["iphone", "android", "ipad", "midp", "240x320", "blackberry", "netfront", "nokia", "panasonic", "portalmmm", "sharp", "sie-", "sonyericsson", "symbian", "windows ce", "benq", "mda", "mot-", "opera mini", "philips", "pocket pc", "sagem", "samsung", "sda", "sgh-", "vodafone", "xda"];
oneall.browser.user_agent = navigator.userAgent.toLowerCase();
(function () {
	var mobile_clients, i;
	mobile_clients = oneall.browser.mobile_clients;

	for (i = 0; i < mobile_clients.length; i = i + 1) {
		if (oneall.browser.user_agent.indexOf(mobile_clients[i]) !== -1) {
			oneall.browser.is_mobile = true;
			return;
		}
	}

	oneall.browser.is_mobile = false;
}());

oneall.browser.is_win = (navigator.appVersion && navigator.appVersion.toLowerCase().indexOf("win") !== -1);
oneall.browser.is_ie = (navigator.appVersion && navigator.appVersion.indexOf("MSIE") !== -1);
oneall.browser.is_ie6 = (navigator.appVersion && navigator.appVersion.indexOf("MSIE 6.") !== -1);
oneall.browser.is_ie7 = (navigator.appVersion && navigator.appVersion.indexOf("MSIE 7.") !== -1);
oneall.browser.is_ie8 = (navigator.appVersion && navigator.appVersion.indexOf("MSIE 8.") !== -1);
oneall.browser.is_ie9 = (navigator.appVersion && navigator.appVersion.indexOf("MSIE 9.") !== -1);
oneall.browser.is_chrome = (oneall.browser.user_agent.indexOf("chrome") !== -1);
oneall.browser.is_firefox = (oneall.browser.user_agent.indexOf("firefox") !== -1);
oneall.browser.is_opera = (oneall.browser.user_agent.indexOf("opera") !== -1);
oneall.browser.is_safari = (navigator.appVersion && navigator.appVersion.toLowerCase().indexOf("safari") !== -1 && navigator.appVersion.toLowerCase().indexOf("chrome") === -1);
oneall.browser.is_mac = (navigator.appVersion && navigator.appVersion.toLowerCase().indexOf("mac") !== -1 ? true : false);
oneall.browser.quirks_mode = (document.compatMode === "BackCompat" && oneall.browser.is_ie);
oneall.browser.back_compat = (document.compatMode === "BackCompat");

/* ===================================================== */
/* Console */
/* ===================================================== */
oneall.console = {};
oneall.console.log = function (){
	if (arguments.length > 0){
		if (typeof console !== "undefined"){
			console.log ("[ONEALL CONSOLE LOG] ", arguments);
		}
	}
};

/* ===================================================== */
/* Cross Domain Communication */
/* ===================================================== */

/* XD */
oneall.xd = {
	cache_bust: 1,
	interval_id: null,
	last_hash: ''
};

/* Tools \ Post Message to listener */
oneall.xd.postMessage = function (message, target_url, target) {
	if (!target_url) {
		return;
	}

	/* Default to parent */
	target = target || this.parent;

	if (this.postMessage) {
		/* Browser supports window.postMessage */
		target.postMessage(message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));
	} else if (target_url) {
		/*
		 * Browser does not support window.postMessage, use the window.location.hash fragment hack
		 */
		this.cache_bust = this.cache_bust + 1;
		target.location = (target_url.replace(/#.*$/, '') + '#' + (new Date()) + (this.cache_bust) + '&' + message);
	}
};

/* Tools \ Receive Message as listener */
oneall.xd.receiveMessage = function (callback, source_origin) {

	/* Browser supports window.postMessage */
	if (window.postMessage) {
		var attached_callback;

		/* Bind the callback to the actual event associated with window.postMessage */
		if (callback) {
			attached_callback = function (e) {
				if ((typeof source_origin === 'string' && e.origin !== source_origin) || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === false)) {
					oneall.console.log ("XD Source Error: " + source_origin + '<> ' + e.origin + ' : ', e);
					return false;
				}
				callback(e);
			};
		}

		/* Add Listener */
		if (window.addEventListener) {
			if (callback) {
				window.addEventListener('message', attached_callback, false);
			} else {
				window.removeEventListener('message', attached_callback, false);
			}
		} else {
			if (callback) {
				window.attachEvent('onmessage', attached_callback);
			} else {
				window.detachEvent('onmessage', attached_callback);
			}
		}
	} else {
		/*
		 * Browser does not support window.postMessage Start polling loop and call callback whenever the location.hash changes
		 */
		if (this.interval_id) {
			clearInterval(this.interval_id);
		}

		this.interval_id = null;

		if (callback) {
			this.interval_id = setInterval(function () {
				var hash = document.location.hash, re = /^#?\d+&/;
				if (hash !== this.last_hash && re.test(hash)) {
					this.last_hash = hash;
					callback({data: hash.replace(re, '')});
				}
			}, 100);
		}
	}
};

/* Tools \ Receive Message as listener */
oneall.xd.handle_received_message = function (message) {
	var parts, action, value, element;

	parts = message.data.split('|');

	if (parts.length === 1) {
		action = parts[0];

		if (action === 'social_share_modal_lightbox_hide') {
			oneall.api.plugins.social_share.modal.lightbox.hide();
		} else {
			/* Unknown Action */
			throw new Error("[ONEALL SOCIAL API] XD Unknown single action received" + message.data);
		}
	} else if (parts.length === 2) {

		/* Extract arguments */
		action = parts[0];
		value = parts[1];

		if (action === 'resize') {
			/* Resize iFrame */
			element = document.getElementById('oa_frame');

			parts = value.split('-');

			if (parts.length === 2) {
				element.style.height = parts[0] + 'px';
				element.style.width = parts[1] + 'px';
			} else {
				element.style.height = value + 'px';
			}
		} else if (action === 'redirect') {
			/* Redirect Parent */
			window.location.href = value;
		} else {
			/* Unknown Action */
			throw new Error("[ONEALL SOCIAL API] XD Unknown dual action received" + message.data);
		}
	} else {
		throw new Error("[ONEALL SOCIAL API] XD Unknown message received " + message.data);
	}
};

/* ===================================================== */
/* Tools */
/* ===================================================== */

/* Tools */
oneall.tools = {};
oneall.tools.oak = {};
oneall.tools.oak.encrypt = function (key, pt) {
	var i, j, x, y, s, ct, res, b16_digits, b16_map;
	
	key = 'oak' + key;

	s = [];
	for (i = 0; i < 256; i = i + 1) {
		s[i] = i;
	}
	
	j = 0;
	for (i = 0; i < 256; i = i + 1) {
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
	}
	i = 0;
	j = 0;
	
	ct = '';
	for (y = 0; y < pt.length; y = y + 1) {
		i = (i + 1) % 256;
		j = (j + s[i]) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
		ct += String.fromCharCode(pt.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
	}


	b16_digits = '0123456789abcdef';
	b16_map = [];
	for (i = 0; i < 256; i = i + 1) {
		b16_map[i] = b16_digits.charAt(i >> 4) + b16_digits.charAt(i & 15);
	}

	res = [];
	for (i = 0; i < ct.length; i = i + 1) {
		res[i] = b16_map[ct.charCodeAt(i)];
	}

	return res.join('');
};

/* Tools \ Transform Object to JSON String */
oneall.tools.json_stringify = function (obj) {
	var t, n, v, json, arr;


	t = typeof (obj);

	if (t !== "object" || obj === null) {
		if (t === "string"){
			obj = '"'+obj+'"';
		}
		return String(obj);
	}
	else {
		// recurse array or object
		json = [];
		arr = (obj && obj.constructor === Array);

		for (n in obj) {			
			if (obj.hasOwnProperty(n)) {
				v = obj[n];
				t = typeof(v);

				if (t === "string"){
					v = '"'+v+'"';
				}
				else if (t === "object" && v !== null){
					v = this.json_stringify(v);
				}
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

/* Tools \ Get Elements By Class Name */
oneall.tools.get_elements_by_class_name = function (class_name, node) {
	var i, regexp, elements, node_elements, num_node_elements;

	if (typeof node === 'undefined'){
		node = document.getElementsByTagName("body")[0];
	}

	elements = [];
	regexp = new RegExp('\\b' + class_name + '\\b');

	node_elements = node.getElementsByTagName("*");
	num_node_elements = node_elements.length;

	for(i = 0; i < num_node_elements; i = i + 1){
		if(regexp.test(node_elements[i].className)){
			elements.push(node_elements[i]);
		}
	}

	return elements;
};

/* Tools \ Replace String */
oneall.tools.str_replace = function (string, search, replace) {
	return string.split(search).join(replace);
};

/* Tools \ Hide Element By ID */
oneall.tools.remove_element_by_id = function (id) {
	var element = document.getElementById(id);
	if (element){
		element.parentNode.removeChild(element);
	}
};

/* Tools \ Hide Element By ID */
oneall.tools.hide_element_by_id = function (id) {
	var element = document.getElementById(id);
	if (element){
		element.style.display = "none";
	}
};


/* Tools \ Show Element By ID */
oneall.tools.show_element_by_id = function (id) {
	var element = document.getElementById(id);
	if (element){
		if (oneall.browser && oneall.browser.is_ie6){
			if (element.tagName.toLowerCase() === "td"){
				element.style.display = "table-cell";
			} else if (element.tagName.toLowerCase() === "tr" || element.tagName.toLowerCase() === "table"){
				element.style.display = "";
			}else {
				element.style.display = "block";
			}
		}else {
			element.style.display = "block";
		}
	}
};


/* Tools \ Remove class from an element */
oneall.tools.remove_element_class = function (element, classname) {
	var regexp;
	if (oneall.tools.has_element_class (element, classname)){
		regexp = new RegExp('(\\s|^)'+classname+'(\\s|$)');
		element.className = element.className.replace(regexp,' ');
	}
};

/* Tools \ Add class from to element */
oneall.tools.add_element_class = function (element, new_classname) {
	var old_classname;

	/* Trim Spaces */
	new_classname = new_classname.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	
	if (new_classname.length > 0){
		if ( ! oneall.tools.has_element_class (element, new_classname)){
			
			old_classname = element.className;		
			old_classname = old_classname.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			
			if (old_classname.length > 0){		
				new_classname = old_classname + " " + new_classname;
			} 
			
			element.className = new_classname;
		}
	}
};


/* Tools \ Check if element has class */
oneall.tools.has_element_class = function (element, classname) {
	var regexp;
	regexp = new RegExp('(\\s|^)'+classname+'(\\s|$)');
	return element.className.match(regexp);
};


/* Tools \ Get object position x */
oneall.tools.get_object_pos_x = function (obj){
	var pos_x;
	
	pos_x = 0;
	if (obj.offsetParent) {
		while (1) {
			pos_x = pos_x + obj.offsetLeft;
			if (!obj.offsetParent) {
				break;
			}
			obj = obj.offsetParent;
		}
	} else if (obj.x) {
		pos_x = pos_x + obj.x;
  }
  return pos_x;
};


/* Tools \ Get object position y */
oneall.tools.get_object_pos_y = function (obj){
  var pos_y;
  
  pos_y = 0;
	if (obj.offsetParent) {
		while (1) {
			pos_y = pos_y + obj.offsetTop;
			if (!obj.offsetParent) {
				break;
			}
			obj = obj.offsetParent;
		}
	} else if (obj.y) {
		pos_y = pos_y + obj.y;
  }
  return pos_y;
};

/* Tools \ Get viewport */
oneall.tools.get_viewport_size = function() {
	 var viewport_w;
	 var viewport_h;

	 if (typeof window.innerWidth != 'undefined') {
		 viewport_w = window.innerWidth,
		 viewport_h = window.innerHeight
	 }
	 else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
		 viewport_w = document.documentElement.clientWidth,
		 viewport_h = document.documentElement.clientHeight
	 }
	 else {
		 viewport_w = document.getElementsByTagName('body')[0].clientWidth,
		 viewport_h = document.getElementsByTagName('body')[0].clientHeight
	 }
	 return {width:viewport_w, height: viewport_h};
};




oneall.tools.gui = {};

/* API \ Plugins \ Social Login Plugin \ Modal \ Lightbox \ Overlay \ Show */
oneall.tools.gui.show_overlay = function(overlay_id) {
	var image, background_image, overlay;

	/* Background */
	background_image = 'https://cdn.oneall.com/img/api/socialize/gui/overlay.png';

	/* Preload */
	image = new Image();
	image.src = background_image;

	/* Create Overlay */
	overlay = document.createElement('div');
	overlay.setAttribute('id', overlay_id);
	overlay.style.position = 'fixed';
	overlay.style.left = '0';
	overlay.style.top = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.textAlign = 'center';
	overlay.style.overflow = 'auto';
	overlay.style.zIndex = '999995';
	overlay.style.backgroundImage = "url('"+background_image+"')";
	overlay.style.backgroundRepeat = 'repeat';
	overlay.style.backgroundPosition = '0 0';
	overlay.style.backgroundColor = 'transparent';

	/* Add Overlay to document */
	document.body.appendChild(overlay);
};

/* API \ Plugins \ Social Login Plugin \ Modal \ Lightbox \ Overlay \ Hide */
oneall.tools.gui.hide_overlay = function(overlay_id) {
	oneall.tools.remove_element_by_id(overlay_id);
};



/*
 * Tools \ Create iFrame
 */
oneall.tools.create_iframe =  function (container, options){
	var options_name, options_id, options_border, options_width, options_height, options_src, options_background_color, frame, frame_object;

	options_name = (typeof options.name !== 'undefined'? options.name : ("oa_frame_" + (Math.floor ( Math.random ( ) * 1000 + 1))));
	options_id = (typeof options.id !== 'undefined'? options.id : ('oa_frame_' + (Math.floor ( Math.random ( ) * 1000 + 1))));
	options_border =  (typeof options.border !== 'undefined'? options.border : "0px");
	options_background_color = (typeof options.background_color !== 'undefined'? options.background_color : "transparent");
	options_width =  (typeof options.width  !== 'undefined'? options.width  : "100%");
	options_height =  (typeof options.height  !== 'undefined'? options.height  : "100px");
	options_src =  (typeof options.src   !== 'undefined'? options.src   : "about:blank");

	options_src = options_src + '&lang='+oneall.user_settings.plugin_language;

	try {

		frame = document.createElement('iframe');
		frame.name = options_name;
		frame.setAttribute ('scrolling', 'no');
		frame.setAttribute ('frameBorder', 0);
		frame.setAttribute ('allowTransparency', 'true');

		frame.setAttribute('id', options_id);
		frame.style.border = options_border;
		frame.style.width = options_width;
		frame.style.height = options_height;
		frame.style.backgroundColor = options_background_color;
		frame.src = options_src;

		/* Does not work in IE */
		if ( ! oneall.browser.is_ie){
			frame.style.visibility = 'hidden';
			frame.onload = function(){
				frame.style.visibility = 'visible';
			};
		}
		frame_object = container.appendChild(frame);
		
	} catch(exception) {

		// This is for IE5 PC, which does not allow dynamic creation
		// and manipulation of an iframe object. Instead, we'll fake
		container.innerHTML += '<iframe frameBorder="0" scrolling="no" allowTransparency="true" id="'+options_id+'" style="background-color:'+options_background_color+';border:'+options_border+';width:'+options_width+';height:'+options_height+';</iframe>';

		frame_object = {};
		frame_object.document = {};
		frame_object.document.location = {};
		frame_object.document.location.iframe = document.getElementById(options_id);
		frame_object.document.location.replace = function (location) {
			this.iframe.src = location;
		};
	}
	return frame;
};

/*
 * Tools \ Get position to center div
 */
oneall.tools.get_window_center_position = function (width, height){
	var screen_pos_left, screen_width, screen_pos_y, screen_height, left, top;

	screen_pos_y = 0;
	
	if (oneall.browser.is_ie){
		screen_pos_left = window.screenLeft;
		screen_width = (typeof screen.availWidth !== 'undefined' ? screen.availWidth : screen.width);
		screen_height =(typeof screen.availHeight !== 'undefined' ? screen.availHeight : screen.height);
		
	} else {	
		screen_pos_left = (typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft);
		screen_width = (typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.documentElement.clientWidth);
		screen_height = (typeof window.outerHeight !== 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22));
	}	
	
  left = parseInt(((screen_pos_left + (screen_width/2)) - (width/2)), 10);
  top = parseInt(screen_pos_y + ((screen_height-height) / 2.5), 10);

  return ('left=' + left + ',top=' + top);
};

/* Tools \ Open Popup */
oneall.tools.open_window =  function (url, window_name, window_options) {
	var width, height, options, new_window;

	if (typeof window_options === "undefined") {
		window_options = "menubar=0,toolbar=0,resizable=1,width=960,height=680";
	}

	/* Popup Sizes */
	width = window_options.split("width=")[1].split(",")[0];
	height = window_options.split("height=")[1].split(",")[0];

	/* Build options */
	options = window_options + ',' + oneall.tools.get_window_center_position (width, height);

	/* Open Windows */
	new_window = window.open(url, window_name, options);

	if (new_window && new_window.focus) {
		new_window.focus();
		return new_window;
	}
};

/* ===================================================== */
/* API */
/* ===================================================== */
oneall.api = {};

/* ===================================================== */
/* API \ Providers */
/* ===================================================== */
oneall.api.providers = {};

/*
 * API \ Providers \ Get Provider By Key
 */
oneall.api.providers.get_provider_by_key = function (provider_key, providers_list) {
	var i;

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	for (i = 0; i < providers_list.length; i = i + 1){
		if (providers_list[i].key.toLowerCase() === provider_key.toLowerCase()){
			return providers_list[i];
		}
	}
	return false;
};

/*
 * API \ Providers \ Get Providers By Keys
 */
oneall.api.providers.get_providers_by_keys = function (provider_keys, providers_list) {
	var i, j, providers, provider;

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	providers = [];
	provider = null;
	j = 0;

	for (i = 0; i < provider_keys.length; i = i + 1){
		provider = oneall.api.providers.get_provider_by_key (provider_keys[i]);
		if (provider){
			providers[j] = provider;
			j = j + 1;
		}
	}
	return providers;
};

/*
 * API \ Providers \ Sanitize providerids
 */
oneall.api.providers.get_sanitized_providerids = function (providerids, providers_list) {
	var i, j, sanitized_providerids, providers;

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	sanitized_providerids = [];

	if (providerids.length > 0){
		providers = oneall.api.providers.get_providers_by_ids (providerids);
		if (providers.length > 0){
			j = 0;
			for (i = 0; i < providers.length; i = i + 1){
				sanitized_providerids[j] = providers[i].id;
				j = j + 1;
			}
		}
	}

	return sanitized_providerids;
};

/*
 * API \ Providers \ Get Provider IDs By Keys
 */
oneall.api.providers.get_providerids_by_keys = function (provider_keys, providers_list) {
	var i, j, providers, providerids;

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	providers = this.get_providers_by_keys(provider_keys, providers_list);
	providerids = [];

	if (providers.length > 0){
		j = 0;
		for (i = 0; i < providers.length; i = i + 1){
			providerids[j] = providers[i].id;
			j = j + 1;
		}
	}
	return providerids;
};


/*
 * API \ Providers \ Get Provider By ID
 */
oneall.api.providers.get_provider_by_id = function (provider_id, providers_list) {
	var i;

	provider_id = parseInt(provider_id, 10);

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	for (i = 0; i < providers_list.length; i = i + 1){
		if (providers_list[i].id === provider_id){
			return providers_list[i];
		}
	}
	
	/* Not found */
	return false;
};


/*
 * API \ Providers \ Get Providers By IDs
 */
oneall.api.providers.get_providers_by_ids = function (provider_ids, providers_list) {
	var i, j, providers, provider;

	if (typeof providers_list === 'undefined'){
		providers_list = oneall.api.providers.list;
	}

	providers = [];

	if (provider_ids.length > 0){
		j = 0;
		for (i = 0; i < provider_ids.length; i = i + 1){
			provider = oneall.api.providers.get_provider_by_id (provider_ids[i]);
			if (provider){
				providers[j] = provider;
				j = j + 1;
			}
		}
	}
	return providers;
};


/*
 * API \ Providers \ Get all Providers
 */
oneall.api.providers.get_all_providers = function () {
	return oneall.api.providers.list.concat();
};


/*
 * API \ Providers \ Provider
 */
oneall.api.providers.provider = function (providerid, name, name_short, key, is_login_data_required, popup_width, popup_height, sprite_position, available_actions){
	this.id = providerid;
	this.name = name;
	this.name_short = name_short;
	this.key = key;
	this.is_login_data_required = (is_login_data_required == '1' ? true : false);
	this.popup_width = popup_width;
	this.popup_height = popup_height;
	this.sprite_position = sprite_position;
	this.popup_options = "menubar=0,toolbar=0,resizable=1,scrollbars=1,width=" + popup_width + ",height=" + popup_height;
	this.available_actions = available_actions;
	this.toString = function () {
		return this.name;
	};
};

/*
 * API \ Providers \ List
 */
oneall.api.providers.list = [
	new oneall.api.providers.provider(9, "AOL", "AOL", "aol", "0", 530,	720, 1, ["login"])
,	new oneall.api.providers.provider(18, "Blogger", "Blogger", "blogger", "1", 760,	400, 2, ["login"])
,	new oneall.api.providers.provider(19, "ClaimID", "ClaimID", "claimid", "0", 760,	400, 1, ["login"])
,	new oneall.api.providers.provider(20, "ClickPass", "ClickPass", "clickpass", "0", 760,	400, 1, ["login"])
,	new oneall.api.providers.provider(16, "Digg", "Digg", "digg", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(1, "Facebook", "Facebook", "facebook", "0", 1000,	712, 3, ["login"])
,	new oneall.api.providers.provider(13, "Flickr", "Flickr", "flickr", "0", 700,	540, 1, ["login"])
,	new oneall.api.providers.provider(30, "Foursquare", "Foursquare", "foursquare", "0", 500,	567, 4, ["login"])
,	new oneall.api.providers.provider(29, "Fox News", "Fox News", "foxnews", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(2, "Google", "Google", "google", "0", 540,	470, 5, ["login"])
,	new oneall.api.providers.provider(21, "Hyves", "Hyves", "hyves", "0", 700,	540, 6, ["login"])
,	new oneall.api.providers.provider(10, "LinkedIn", "LinkedIn", "linkedin", "0", 471,	296, 7, ["login"])
,	new oneall.api.providers.provider(28, "Livedoor", "Livedoor", "livedoor", "0", 970,	700, 1, ["login"])
,	new oneall.api.providers.provider(7, "LiveID", "LiveID", "liveid", "0", 800,	550, 8, ["login"])
,	new oneall.api.providers.provider(22, "LiveJournal", "LiveJournal", "livejournal", "1", 860,	500, 9, ["login"])
,	new oneall.api.providers.provider(15, "Messenger", "Messenger", "messenger", "0", 520,	450, 10, ["login"])
,	new oneall.api.providers.provider(27, "Mixi", "Mixi", "mixi", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(8, "MySpace", "MySpace", "myspace", "0", 610,	510, 11, ["login"])
,	new oneall.api.providers.provider(24, "Netlog", "Netlog", "netlog", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(6, "OpenID", "OpenID", "openid", "1", 730,	590, 12, ["login"])
,	new oneall.api.providers.provider(26, "Orange France", "Orange France", "orangefrance", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(17, "Orkut", "Orkut", "orkut", "0", 610,	510, 13, ["login"])
,	new oneall.api.providers.provider(4, "PayPal", "PayPal", "paypal", "0", 640,	580, 1, ["login"])
,	new oneall.api.providers.provider(25, "SignOn", "SignOn", "signon", "0", 870,	900, 1, ["login"])
,	new oneall.api.providers.provider(32, "StackExchange", "StackExchge", "stackexchange", "0", 965,	545, 20, ["login"])
,	new oneall.api.providers.provider(14, "Steam", "Steam", "steam", "0", 700,	540, 1, ["login"])
,	new oneall.api.providers.provider(3, "Twitter", "Twitter", "twitter", "0", 674,	792, 15, ["login"])
,	new oneall.api.providers.provider(23, "Typepad", "Typepad", "typepad", "0", 730,	590, 1, ["login"])
,	new oneall.api.providers.provider(11, "VeriSign", "VeriSign", "verisign", "0", 980,	500, 17, ["login"])
,	new oneall.api.providers.provider(31, "VKontakte", "VKontakte", "vkontakte", "0", 674,	792, 15, ["login"])
,	new oneall.api.providers.provider(12, "WordPress", "WordPress", "wordpress", "1", 790,	570, 1, ["login"])
,	new oneall.api.providers.provider(5, "Yahoo", "Yahoo", "yahoo", "0", 500,	560, 20, ["login"])

];


/* ===================================================== */
/* API \ Plugins */
/* ===================================================== */
oneall.api.plugins = {};

/* API \ Plugins \ Launch a provider connection */
oneall.api.plugins.launch_provider_connection = function (providerid, plugin, callback_uri, args){
	var provider, login_url;

	/* Check args format */
	args = ((typeof args !== 'undefined') ? args : {});	
	
	/* Load provider */
	provider = oneall.api.providers.get_provider_by_id (providerid);	
	
	if (provider){				
		/* Do we need an URL ? */
		if (provider.signon_data === 'url'){				
			this.launch_openid_requesting(provider.id)
			return false;
		}

		/* Open Window */
		return oneall.tools.open_window(oneall.user_settings.get_provider_connect_uri() + '?providerid=' + providerid + '&plugin=' + plugin + '&callback_uri=' + encodeURIComponent(callback_uri) + '&args='+oneall.tools.json_stringify(args), 'Connect', provider.popup_options);
	} else{		
		/* Invalid provider */
		throw new Error("[ONEALL SOCIAL API] Could not launch provider connection: invalid provider");		
	}
};





/* ===================================================== */
/* API \ Plugins \ Social Sharing Plugin: Static */
/* ===================================================== */
oneall.api.plugins.social_sharing = {};
oneall.api.plugins.social_sharing.build = function (container_class_or_id, args){
	var plugin;	
	plugin = new oa_social_sharing(args);
	plugin.build (container_class_or_id);
}


/* ===================================================== */
/* API \ Plugins \ Social Login Plugin: Static */
/* ===================================================== */
oneall.api.plugins.social_login = {};
oneall.api.plugins.social_login.build = function (container_class_or_id, args){
	var plugin;		
	plugin = new oa_social_login(args);
	plugin.build (container_class_or_id);
}

oneall.api.plugins.social_login.modal = {};
oneall.api.plugins.social_login.modal.attach = function(container_class, args){
	args = ((typeof args === 'object') ? args : {});	
	args.modal = true;	
	oneall.api.plugins.social_login.build(container_class, args);
};


/* ===================================================== */
/* API \ Plugins \ Social Link Plugin: Static */
/* ===================================================== */
oneall.api.plugins.social_link = {};
oneall.api.plugins.social_link.build = function (container_class_or_id, args){
	var plugin = new oa_social_link(args);
	plugin.build (container_class_or_id);
}
oneall.api.plugins.social_link.setup_frame = function (container_class_or_id, args){
	var plugin = new oa_social_link(args);
	plugin.setup_login_frame(container_class_or_id);
}


/* ===================================================== */
/* API \ Plugins \ Abstract Plugin */
/* ===================================================== */
var oa_social_abstract = oa_class.extend({	
	init: function(pluginkey, args){
		/* Restore arguments */
		args = ((typeof args !== 'undefined') ? args : {});		
		this.parent_uri = (typeof args.parent_uri !== 'undefined'? args.parent_uri : document.location.href);
		this.callback_uri = (typeof args.callback_uri !== 'undefined'? args.callback_uri : '');
		this.css_theme_uri = (typeof args.css_theme_uri !== 'undefined'? args.css_theme_uri : '');	
		this.demo = ((typeof args.demo  !== 'undefined' && args.demo === true) ? true : false);
		this.force_reauth = ((typeof args.force_reauth  !== 'undefined' && args.force_reauth === true) ? true : false);
		this.modal = ((typeof args.modal  !== 'undefined' && args.modal === true) ? true : false)
		this.grid_size_x = (((typeof args.grid_size_x !== 'undefined') && !isNaN(parseInt(args.grid_size_x, 10))) ? parseInt(args.grid_size_x, 10) : 99);
		this.grid_size_y = (((typeof args.grid_size_y !== 'undefined') && !isNaN(parseInt(args.grid_size_y, 10))) ? parseInt(args.grid_size_y, 10) : 99);
		this.id = (typeof args.id !== 'undefined'? args.id :   (10000 + Math.floor ( Math.random ( ) * 99999 + 1)));
		this.providers = (typeof args.providers === 'object' && args.providers.length ? args.providers : oneall.api.providers.get_all_providers());
		this.linked_providers = (typeof args.provider_application_identities === 'object' ? args.provider_application_identities: []);
		this.events = (typeof args.events === 'object' ? args.events : {});	
		this.pluginkey = pluginkey;
		this.location = '';
			
		/* Setup custom properties */
		this.args = ((typeof this.args === 'object') ? this.args : {});
		this.args.id = this.id;
		this.args.parent_uri = this.parent_uri;
		this.args.callback_uri = this.callback_uri;
		this.args.css_theme_uri = this.css_theme_uri;
		this.args.modal = this.modal;
		this.args.force_reauth = this.force_reauth;
		this.args.demo = this.demo;
		this.args.pluginkey = this.pluginkey;
		this.args.linked_providers = this.linked_providers;
		this.args.grid_size_x = this.grid_size_x;
		this.args.grid_size_y = this.grid_size_y;
		this.args.providers = this.providers;			
	},
	

	/***************************************************************************************/
	/* Attach Modal Dialog to Link / Inject providers into a container */
	/***************************************************************************************/
	
	/* Attach Modal Dialog to Link / Inject providers into a container */
	build: function (target_url, container_class_or_id){
		var oakv, i, container, containers, args;
					
		/* Transform Options to string */
		args = oneall.tools.json_stringify (this.args);
			
		/* Check for valid container */
		containers = document.getElementById(container_class_or_id);
	
		if (containers !== null && typeof containers === 'object'){
			containers = [containers];
		} else {
			containers = oneall.tools.get_elements_by_class_name (container_class_or_id);
		}	
	
		/* Check if container found */	
		if (containers !== null && typeof containers === 'object'){
			for (i = 0; i < containers.length; i = i + 1){
				container = containers[i];
			
				/* Inline display */
				if (this.modal !== true){
					
					/* Encrypt URL arguments */
					oakv = oneall.tools.oak.encrypt (this.id, args);
					
					/* Clear container */
					container.innerHTML = '';
			
					/* Inject Frame */
					oneall.tools.create_iframe (
						container, {
							'id': 'oa_'+this.pluginkey+'_frame_' + this.id,
							'name': 'SocialPlugin',
							'width': '100%',
							'height' : '0',
							'src': (target_url + '?oakk='+this.id+'&oakv='+oakv)
						}
					);							
					
				/* Modal display */
				} else {					
					/* Setup container */
					container.style.cursor = 'pointer';					
					container.onclick = function(me) {return function(){me.open_login_modal_dialog();return false;};}(this);							
				}
			}
			
			/* Add Listener */
			var thiz = this;
			oneall.xd.receiveMessage(function (message){thiz.xd_listener (message);}, oneall.user_settings.get_application_uri());		
		}
		/* Container not found */
		else{
			throw new Error("[ONEALL SOCIAL API] No plugin container with the id/class ["+containers+"] has not been found");
		}
	},
	
	
	/***************************************************************************************/
	/* Provider Gui */
	/***************************************************************************************/
	
	/* Display the providers in the given container */
	show_providers_in_container: function (provider_containerid) {
		
		var i, group_id,group, group_size_max, group_size, row, row_size_max, row_size, scrollbody, scroll, block,
			provider, provider_block, providers_group, providers_row, tick, link, text, provider_container, providers, providers_keys, document_height;
	
		
		/* Read providers */
		providers = oneall.api.providers.get_providers_by_keys (this.providers);
		
		/* Get provider container */
		provider_container = document.getElementById(provider_containerid);
			
		/* Provider container found */
		if (provider_container){
			
			/* Size of a group */			
			group_size_max = (this.grid_size_x * this.grid_size_y);
			group_size  = 0;
			group_id = 0;
			
			/* Size of a row */
			row_size_max = this.grid_size_x;
			row_size = 0;
			
			/* Provider Group */
			group_id = group_id + 1;
			group = document.createElement('div');
			group.className = 'providers_group';
			group.setAttribute('id', 'providers_group_'+group_id);
			
			/* Provider Block */
			block = document.createElement('div');
			block.className = 'providers_block';
			
			/* Provider Row */
			row = document.createElement('div');
			row.className = 'providers_row';
			
			/* Loop trough providers */
			for (i = 0; i < providers.length; i = i + 1) {

				/* Get provider */
				provider = providers[i];
				
				/* Setup provider */
				provider_block = document.createElement('div');
				provider_block.className = ((typeof this.linked_providers[provider.key] === 'object') ? 'provider provider_linked' : 'provider');
				provider_block.setAttribute('id', 'provider_'+provider.key);
								
				/* Setup Link */
				link = document.createElement('a');
				link.className = 'button';
				link.setAttribute('id', 'button_'+provider.key);				
				link.setAttribute('href', '#');		
				link.setAttribute('rel', 'nofollow');	
				link.onclick = function(me, providerid) {return function(){me.do_provider_login(providerid);};}(this, provider.id);						
				link.setAttribute('title', _('Login with %s', provider.name));
	
				/* Setup Link Button Border */
				tick = document.createElement('span');
				tick.className = 'tick';
				
				/* Setup Link Button Text */
				text = document.createElement('div');
				text.className = 'name';
				text.setAttribute('id', 'name_'+provider.key);
				text.appendChild(document.createTextNode(provider.name_short));
				
				/* Glue together */		
				link.appendChild(tick);			
				provider_block.appendChild(link);
				provider_block.appendChild(text);
				
				/* Add button to row */
				row.appendChild(provider_block);
				
				/* Increase counter */
				group_size = group_size + 1;
				row_size = row_size + 1;
				
				block.appendChild(row);
				
				/* Limited reached */
				if (row_size === row_size_max)
				{	
					row = document.createElement('div');
					row.className = 'providers_row';
					row_size = 0;
				}
				
				/* Current group is full */
				if (group_size === group_size_max)
				{
					group.appendChild(block);
					block = document.createElement('div');
					block.className = 'providers_block';
					
					/* More providers to be added */
					if ((i + 1) < providers.length)
					{
						/* Add right arrows */
						scroll = document.createElement('div');	
						scroll.className = 'scroll scroll_right';
						scroll.onclick = function(me, page, direction) {return function(){me.paginate_provider_group(page, direction);};}(this, group_id, 'right');			
						scrollbody = document.createElement('div');			
						scroll.appendChild(scrollbody);									
						group.appendChild(scroll);
					
						/* Add current group */						
						provider_container.appendChild(group);
					
						/* Add next group - Hidden */
						group_id = group_id + 1;
						group = document.createElement('div');
						group.className = 'providers_group hidden';
						group.setAttribute('id', 'providers_group_'+group_id);			
					
						/* Add left arrows */
						scroll = document.createElement('div');	
						scroll.className = 'scroll scroll_left';
						scroll.onclick = function(me, page, direction) {return function(){me.paginate_provider_group(page, direction);};}(this, group_id, 'left');				
						scrollbody = document.createElement('div');			
						scroll.appendChild(scrollbody);							
						group.appendChild(scroll);					
	
						/* Reset counters */
						group_size = 0;
						row_size=0;						
					}	
				} else {
					/* Add current group */						
					provider_container.appendChild(group);
				}
			}
			
			/* Add remaining groups */
			if (row_size > 0 || group_size > 0)
			{
				group.appendChild(block);
				provider_container.appendChild(group);
			}

			/* Only one group, no pagination */
			if (group_id === 1)
			{
				provider_container.className = 'providers_unpaginated';
			}
						
	
		} else {
			/* Invalid provider container */
			throw new Error("[ONEALL SOCIAL API] The provider container with the id ["+provider_container+"] has not been found");
		}
	},

	/* Paginate provider groups */
	paginate_provider_group: function (page, direction){
		var element1, element2;	
		
		element1 = document.getElementById('providers_group_' + page);
		if (direction == 'right'){
			element2 = document.getElementById('providers_group_' + (page+1));
		} else {
			element2 = document.getElementById('providers_group_' + (page-1));
		}				
				
		if (element1 && element2){
			element1.style.display = "none";
			element2.style.display = "block";			
		}
	},
	
	/***************************************************************************************/
	/* Message Handling */
	/***************************************************************************************/
	
	/* Show message */
	show_message: function (message, type, key){
		var element;
	
		/* Message container */
		element = document.getElementById('message');
		if (element){
	
			/* Add class */
			if (type === 'error'){
				oneall.tools.remove_element_class (element, 'notice');
				oneall.tools.add_element_class (element, 'error');
			} else {
				oneall.tools.remove_element_class (element, 'error');
				oneall.tools.add_element_class (element, 'notice');
			}
	
			/* Add key */
			if (typeof key !== 'undefined'){
				element.setAttribute('data-key', key);
			} else {
				element.removeAttribute('data-key');
			}
					
			/* Add text */
			element.innerHTML = '';
			element.appendChild(document.createTextNode(message));
	
			/* Show message */
			oneall.tools.hide_element_by_id ('branding');
			oneall.tools.show_element_by_id ('message');
		}
	},
	

	/* Hide message */
	hide_message:  function (key){
		var element;
		
		/* Handle Message */
		element = document.getElementById('message');
		if (element){
			if (typeof key !== 'undefined'){
				if (element.getAttribute ('data-key') === key){
					oneall.tools.hide_element_by_id ('message');
					oneall.tools.show_element_by_id ('branding');
				}
			}	else {
				oneall.tools.hide_element_by_id ('message');
				oneall.tools.show_element_by_id ('branding');
			}
		}
	},
	
	/***************************************************************************************/
	/* Generic Dialog */
	/***************************************************************************************/
	
	/* Open Dialog */
	open_dialog: function(id, uri){
		var dialog, overlay;
					
		
		/* Create Overlay */
		overlay = document.createElement('div');
		overlay.setAttribute('id', 'oa_'+this.pluginkey+'_'+id+'_overlay_'+this.id);
		overlay.style.position = 'fixed';
		overlay.style.left = '0';
		overlay.style.top = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.textAlign = 'center';
		overlay.style.overflow = 'auto';
		overlay.style.zIndex = '999995';
		overlay.style.backgroundImage = "url('https://cdn.oneall.com/img/api/socialize/gui/overlay.png')";
		overlay.style.backgroundRepeat = 'repeat';
		overlay.style.backgroundPosition = '0 0';
		overlay.style.backgroundColor = 'transparent';	
			
		/* Add to document */
		document.body.appendChild(overlay);		
		
		/* Create Dialog */
		dialog = document.createElement('div');
		dialog.setAttribute('id', 'oa_'+this.pluginkey+'_'+id+'_dialog_'+this.id);
		dialog.style.marginLeft = '-240px';
		dialog.style.position = 'fixed';
		dialog.style.left = '50%';
		dialog.style.top = '15%';
		dialog.style.width = '480px';
		dialog.style.textAlign = 'left';
		dialog.style.zIndex = '999996';
			
		/* Inject Frame into Dialog */
		oneall.tools.create_iframe (
			dialog, {
				'id': 'oa_'+this.pluginkey+'_'+id+'_dialog_'+this.id,
				'name': 'SocialLogin',
				'width': '480px',
				'height': '480px',
				'src': uri
			}
		);
		
		/* Add to document */
		document.body.appendChild(dialog);
	},

	/* Close Dialog */
	close_dialog: function(id, uri){
		oneall.tools.remove_element_by_id ('oa_'+this.pluginkey+'_'+id+'_dialog_'+this.id);
		oneall.tools.remove_element_by_id ('oa_'+this.pluginkey+'_'+id+'_overlay_'+this.id);
	},
	
	/* Hide Dialog */
	hide_dialog: function (id){
		oneall.tools.hide_element_by_id ('oa_'+this.pluginkey+'_'+id+'_dialog_'+this.id);
		oneall.tools.hide_element_by_id ('oa_'+this.pluginkey+'_'+id+'_overlay_'+this.id);		
	},
	
	/* Show Dialog */
	show_dialog: function (id){
		oneall.tools.show_element_by_id ('oa_'+this.pluginkey+'_'+id+'_dialog_'+this.id);
		oneall.tools.show_element_by_id ('oa_'+this.pluginkey+'_'+id+'_overlay_'+this.id);		
	},
	
	/***************************************************************************************/
	/* Login Frame */
	/***************************************************************************************/
	
	/* Setup Frame */
	setup_login_frame: function (container){
		
		/* Show providers */
		this.show_providers_in_container(container);
		
		/* Setup XD Communication */
		this.xd_poster('trigger_onload');
		this.xd_poster('resize_frame|'+document.body.scrollHeight + '-' + document.body.scrollWidth);
	},
	
	/* Launched when the created iFrame is ready */
	trigger_onload: function (data){
		if (typeof this.events === 'object' &&	typeof this.events['onload'] === 'function'){
			this.events['onload'](data);
		}
	},
	
	/***************************************************************************************/
	/* Login Modal Dialog */
	/***************************************************************************************/

	/* Open Login Modal Dialog */
	open_login_modal_dialog: function(){
		var args, oakv, uri;
		
		/* Forge Options */
		args = this.args;
		args.grid_size_x = 2;
		args.grid_size_y = 2;
		args = oneall.tools.json_stringify (args);
		
		/* Encrypt */
		oakv = oneall.tools.oak.encrypt (this.id, args);
			
		/* Build URI */
		uri = (oneall.user_settings.get_provider_login_modal_uri() + '?oakk='+ this.id +'&oakv=' + oakv);
		
		/* Open Dialog */
		this.open_dialog ('login_modal', uri);
	},
	
	
	/* Close Login Modal Dialog */
	close_login_modal_dialog: function(){		
		this.close_dialog ('login_modal');
	},	
	
	/* Setup Login Modal Dialog */
	setup_login_modal_dialog: function(container){
		var element;	
		
		/* Close Button */
		element = document.getElementById('close_login_modal_dialog');
		if (element){
			element.onclick = function(me) {return function(){me.xd_poster('close_login_modal_dialog');};}(this);
		}		
		
		/*Add providers */
		this.show_providers_in_container(container);
	},
	
	/***************************************************************************************/
	/* Login Data Dialog */
	/***************************************************************************************/
	
	/* Open Login Data Dialog	 */
	open_login_data_dialog: function(providerid){
		var args, oakv, provider;

		/* Read provider */
		provider = oneall.api.providers.get_provider_by_id (providerid);
		
		/* Valid provider selected */
		if (provider !== false){				
			
			/* Forge Options */
			args = this.args;
			args.providerid = provider.id;
			args.pluginkey = this.pluginkey;
			args = oneall.tools.json_stringify (args);
			
			/* Encrypt */
			oakv = oneall.tools.oak.encrypt (provider.id, args);
			
			/* Hide Modal */
			if ((typeof this.args.modal !== 'undefined' &&  this.args.modal === true)){
				document.getElementById('oa_login_modal_overlay_'+this.id).style.display = 'none';		
				document.getElementById('oa_login_modal_dialog_'+this.id).style.display = 'none';				
			}

			/* Open Dialog */
			this.open_dialog ('login_data', (oneall.user_settings.get_provider_login_data_frame_uri() + '?oakk='+ provider.id +'&oakv=' + oakv));
			
		} else {
			/* Invalid provider container */
			throw new Error("[ONEALL SOCIAL API] Non-existent provider ["+providerid+"] specified");	
		}
	},
	
	
	/* Close Login Data Dialog */
	close_login_data_dialog: function(){		
		
		/* Close Dialog */			
		this.close_dialog ('login_data');
			
		/* Show Modal */
		if ((typeof this.args.modal !== 'undefined' &&  this.args.modal === true)){
			document.getElementById('oa_login_modal_overlay_'+this.id).style.display = 'block';		
			document.getElementById('oa_login_modal_dialog_'+this.id).style.display = 'block';				
		}
	},	
	
	/* Setup Login Data Dialog */
	setup_login_data_dialog: function(providerid){
		var element, field;	
		
		/* Close Button */
		element = document.getElementById('close_login_data_dialog');
		if (element){
			element.onclick = function(me) {
				return function(){
					me.xd_poster('close_login_data_dialog');
				};
			}(this);
		}		
		
		/* Form */
		element = document.getElementById('login_data_dialog_form');
		if (element){
			element.onsubmit = function(me, providerid) {
				return function(){			
					field = document.getElementById('login_data_dialog_value');
					if (field && field.value.length > 0){	
						me.do_provider_login (providerid, field.value);
					}					
					return false;
				}      
			}(this, providerid);			
		}
	},
		
	/***************************************************************************************/
	/* Cross Domain Communication */
	/***************************************************************************************/
	
	/* Cross Domain Poster */
	xd_poster: function (data){
		oneall.xd.postMessage(this.id+'::'+data, this.parent_uri, window.parent);
	},
	
	/* Cross Domain Parser */
	xd_parser: function (message){
		var message_data_parts, message_target_id, message_content, message_content_parts;
		
		/* Check message */
		if (typeof message.data !== 'undefined'){			
			message_data_parts = message.data.split('::');
			
			if (message_data_parts.length === 2){	
				message_target_id = parseInt(message_data_parts[0], 10);
				
				if (message_target_id === this.id){					
					message_content = message_data_parts[1];				
					message_content_parts = message_content.split('|');
					return message_content_parts;
				}
			}
		}
		return;
	},
	
	/* Cross Domain Listener */
	xd_listener: function (message){
		var message_content_parts, message_action_parts, element, width, height;
			
		/* Extract message data */
		message_content_parts = this.xd_parser (message);		
		if (typeof message_content_parts !== 'undefined'){			
			
			switch (message_content_parts[0]){	
					
				/* Open Login Data Dialog */
				case 'open_login_data_dialog':
					if (message_content_parts.length === 2){	
						this.open_login_data_dialog(message_content_parts[1]);
					}
				break;
						
				/* Close Login Data Dialog */
				case 'close_login_data_dialog':
					this.close_login_data_dialog();
				break;
						
				/* Close Login Modal Dialog */
				case 'close_login_modal_dialog':
					this.close_login_modal_dialog();
				break;				
					
				/* Trigger onLoad Event */
				case 'trigger_onload':
					this.trigger_onload();
				break;
					
				/* Redirect after login */		
				case 'redirect':
					if (message_content_parts.length === 2){
						window.location.href = message_content_parts[1];
					}
				break;			
		
				/* Resize Frame */
				case 'resize_frame':	
					if (message_content_parts.length === 2){						
						message_action_parts = message_content_parts[1].split('-');							
						if (message_action_parts.length === 2){
							element = document.getElementById('oa_'+this.pluginkey+'_frame_' + this.id);	
							if (element){	
								
								width = parseInt (message_action_parts[1], 10);
								height = parseInt (message_action_parts[0], 10);
								
								if (width === 0){									
									width = '100%'
								} else {
									width = width + 'px';
								}
								
								if (height === 0){								
									height = 'auto';
								} else {
									height = height + 'px';
								}
								
								element.style.cssText = 'background-color:transparent;border:0 none;height: '+height + ' !important; width:'+width + ';visibility: visible;';	
							}
						} 					
					}	
				 break;
			}						
		}
	},
	
	/***************************************************************************************/
	/* Provider Login */
	/***************************************************************************************/
	
	/* Login with the given provider */
	do_provider_login: function (providerid, login_data, args){
		var login_window, timer, thiz, action;
				
		/* Check args format */
		args = ((typeof args !== 'undefined') ? args : {});	
		args = oneall.tools.json_stringify(args);
					
		/* Demonstration Mode */
		if (typeof this.demo !== 'undefined' && this.demo === true){
			alert("The login is disabled in the preview box");
			return false;
		}
		
		/* Login Data - Optional */
		login_data = ((typeof login_data === 'undefined') ? '' : login_data); 
			
		/* Read provider */
		provider = oneall.api.providers.get_provider_by_id (providerid);
	
		/* Valid provider selected */
		if (provider !== false){			
			
			/* We need an URL first */
			if (provider.is_login_data_required === true && login_data.length === 0)
			{
				/* Open Login Data Dialog */
				this.xd_poster('open_login_data_dialog|' + providerid);
			}
			/* Ready to go */
			else
			{
				/* Show Messages */
				this.show_message(_('Connecting...'), 'succes', 'connection_message');		
				
					/* Open Login Dialog */
				login_window = oneall.tools.open_window(oneall.user_settings.get_provider_connect_uri() + '?force_reauth='+this.force_reauth+'&xdframeid='+(this.id)+'&providerid=' + providerid + '&plugin=' + this.pluginkey + '&callback_uri=' + encodeURIComponent(this.callback_uri) + '&args='+encodeURIComponent(args)+'&login_data='+encodeURIComponent(login_data), 'Connect', provider.popup_options);
			
				/* Window opened successfully */
				if (typeof login_window === 'object'){
					
					/* Store for further use */
					thiz = this;
				
					/* Catch Login Dialog Close */
					timer = setInterval(function () {
				
						/* Window closed */
						if(login_window.closed) {
							
							/* Cear timer */
							clearInterval(timer);
							
							/* Remove Message */
							thiz.hide_message('connection_message');
						}
					}, 500);
				}
			}
		} else {
			/* Invalid provider container */
			throw new Error("[ONEALL SOCIAL API] Non-existent provider ["+providerid+"] specified");	
		}			
	}
});

/* ===================================================== */
/* API \ Plugins \ Social Login Plugin */
/* ===================================================== */
var oa_social_login = oa_social_abstract.extend({
	
	/* Constructor */
	init: function(args){
		this._super('social_login', args);
	},
	
	/* Build the frame */
	build: function (container_class_or_id){
		this._super(oneall.user_settings.get_provider_login_frame_uri(), container_class_or_id);
	},
	
	/***************************************************************************************/
	/* Receive Callback Result */
	/***************************************************************************************/
	handle_callback_result: function (json){				
		if (typeof json === 'object' && json.connection.status !== 'undefined'){			
			switch (json.connection.status){				
				/* Error */
				case 'error':
					switch (json.connection.flag){
						case 'invalid_openid_endpoint':					
							this.show_message(_('The specified url is not a valid OpenID endpoint'), 'error', 'error_message');
						break;
					}					
				break;
				
				/* Success */
				case 'success':
					switch (json.connection.action){
						case 'redirect':
							this.xd_poster('redirect|'+oneall.user_settings.get_provider_redirect_uri()+'?provider_connection_token='+json.connection.token);
						break;						
					}				
				break;
			}			
		}		
	}
});

/* ===================================================== */
/* API \ Plugins \ Social Link Plugin */
/* ===================================================== */
var oa_social_link = oa_social_abstract.extend({
	
	/* Constructor */
	init: function(args){
	
		/* Setup parent arguments */
		this._super('social_link', args);

		/* Setup custom arguments */
		args = ((typeof args !== 'undefined') ? args : {});		
		args.user_token = (typeof args.user_token !== 'undefined' ?  args.user_token : '');
		
		/* Setup url arguments */
		this.args.user_token = args.user_token;
		
		/* Setup custom properties */
		this.user_token = args.user_token;
	},
	
	/* Build the frame */
	build: function (container_class_or_id){
		this._super(oneall.user_settings.get_provider_link_frame_uri(), container_class_or_id);
	},
	
	/* Receive Callback Result */
	handle_callback_result: function (json){	
		if (typeof json === 'object' && json.connection.status !== 'undefined'){			
			switch (json.connection.status){				
				/* Error */
				case 'error':
					switch (json.connection.operation)
					{
						case 'nothing_to_do':
							switch (json.connection.reason)
							{
								case 'invalid_openid_endpoint':
									this.show_message(_('The specified url is not a valid OpenID endpoint'), 'error');
									return true;
								break;
								
								case 'identity_is_linked_to_another_user':
									this.show_message (_('The social profile is linked to another user'), 'error');
									return true;
								break;
								
								case 'identity_is_last_one':
									this.show_message (_('At least one profile must remain linked to allow you to sign in'), 'error');
									return true;
								break;
								
								case 'user_cancelled_operation':
									return true;
								break;									
							}							
						break;
					}			
				break;
				
				/* Success */
				case 'success':
					switch (json.connection.operation)
					{
						case 'nothing_to_do':
							switch (json.connection.reason)
							{
								case 'identity_was_already_linked':
									this.show_message (_('The social profile is already linked'), 'notice');
									return true;
								break;
								
								case 'identity_does_not_exist':
									return true;
								break;
							}
						break;						
					}				
				break;
			}			
	
			/* Redirect if no specific actions above */			
			this.xd_poster('redirect|'+oneall.user_settings.get_provider_redirect_uri()+'?provider_connection_token='+json.connection.token);
		}		
	},
	
	/* Cross Domain Listener */
	xd_listener: function (message){
		var message_content_parts, message_action_parts, element;
	
		/* Extract message data */
		message_content_parts = this.xd_parser (message);				
		if (typeof message_content_parts !== 'undefined'){	
			switch (message_content_parts[0]){	
							
				/* Open Identity Manager */
				case 'open_idm':
					if (message_content_parts.length == 2){
						this.open_idm (message_content_parts[1]);
					}
				break;
				
				/* Close Identity Manager */
				case 'close_idm':
					this.close_idm();
				break;
				
				/* Default */
				default:
					this._super(message);
				break;
			}
		}
	},
	
	/* Setup Identity Manager Dialoge */
	setup_idm_dialog: function (providerid){
		var elements, i, identity;
		
	 	/* Read arguments */
	 	this.providerid = (typeof providerid !== 'undefined'? providerid : null);

		/* Close Buttons */
		elements = oneall.tools.get_elements_by_class_name ('close_dialog');
		if (elements !== null && typeof elements === 'object'){
			for (i = 0; i < elements.length; i = i + 1){
				elements[i].onclick = function(me) {return function(){me.xd_poster('close_idm');};}(this);
			}
		}		
		
		/* Unlink */
		elements = oneall.tools.get_elements_by_class_name ('unlink_account');
		if (elements !== null && typeof elements === 'object'){
			for (i = 0; i < elements.length; i = i + 1){				
				identity = elements[i].getAttribute ('data-identity');
				elements[i].onclick = function(me, providerid, identity) {
					return function(){
						me.do_provider_login(providerid, false, identity);
					};
				}(this, providerid, identity);
			}
		}			
		
		/* Link */
		elements = oneall.tools.get_elements_by_class_name ('link_account');
		if (elements !== null && typeof elements === 'object'){
			for (i = 0; i < elements.length; i = i + 1){				
				elements[i].onclick = function(me, providerid) {
					return function(){
						me.do_provider_login(providerid, true);
					};
				}(this, providerid, identity);
			}
		}	
		
	 	/* Handle Messages received from Parent */
	 	oneall.xd.receiveMessage(function (message){oneall.api.plugins.social_link.xd_listener (message);}, document.location);
	},
	
	/* Close Identity Manager */
	close_idm: function(){
		this.close_dialog ('idm');
	},
	
	/* Open Identity Manager */
	open_idm: function (providerid){	
		var args, oakv, uri, provider;
		
		/* Read provider */
		provider = oneall.api.providers.get_provider_by_id (providerid);
		if (provider !== false){				
			
			/* Forge Options */
			args = this.args;
			args.providerid = providerid;
			args = oneall.tools.json_stringify (args);
			
			/* Encrypt */
			oakv = oneall.tools.oak.encrypt (this.id, args);
				
			/* Build URI */
			uri = (oneall.user_settings.plugin_protocol + '://idealratings.api.oneall.com/socialize/link/idm/modal/?oakk='+ this.id +'&oakv=' + oakv)
			
			/* Open Dialog */
			this.open_dialog ('idm', uri);
			
		} else {
			/* Invalid provider container */
			throw new Error("[ONEALL SOCIAL API] Non-existent provider ["+providerid+"] specified");		
		}
	},
	
	/* Setup Login Data Dialog */
	setup_login_data_dialog: function(providerid){
		var element, field;	
		
		/* Close Button */
		element = document.getElementById('close_login_data_dialog');
		if (element){
			element.onclick = function(me) {
				return function(){
					me.xd_poster('close_login_data_dialog');
				};
			}(this);
		}		
		
		/* Form */
		element = document.getElementById('login_data_dialog_form');
		if (element){
			element.onsubmit = function(me, providerid) {
				return function(){			
					field = document.getElementById('login_data_dialog_value');
					if (field && field.value.length > 0){	
						me.do_provider_login (providerid, true, field.value);
					}					
					return false;
				}      
			}(this, providerid);		
		}		
	},
		
	/* Open Login Data Dialog	 */
	open_login_data_dialog: function(providerid){			
		this.hide_dialog ('idm');
		this._super(providerid);
	},
	
	/* Close Login Data Dialog */	
	close_login_data_dialog: function(){
		this.show_dialog ('idm');
		this._super();
	},
	
	/* Login with the given provider */
	do_provider_login: function (providerid, link_identity, login_data){
		var provider;
	
		/* Default Value */
		link_identity = (typeof link_identity === 'undefined' ? true : link_identity );
		
		/* Read provider */
		provider = oneall.api.providers.get_provider_by_id (providerid);
		if (provider !== false){		
			/* Already linked */
			if (typeof this.linked_providers[provider.key] === 'object'){					
				this.xd_poster('open_idm|'+provider.id);
			} 
			/* Not yet linked, login */
			else {								
				/* Build arguments */
				this._super(providerid, login_data, {'user_token': this.user_token, 'link_identity': link_identity});
			}
		}
	}
});

/* ===================================================== */
/* API \ Plugins \ Social Sharing Plugin */
/* ===================================================== */
function oa_social_sharing(args) {	
	
	/* Restore arguments */
	args = ((typeof args !== 'undefined') ? args : {});		
	this.parent_uri = (typeof args.parent_uri !== 'undefined'? args.parent_uri : document.location.href);
	this.mode = (typeof args.mode !== 'undefined'? args.mode : 'basic');
	this.callback_uri = (typeof args.callback_uri !== 'undefined'? args.callback_uri : '');
	this.demo = ((typeof args.demo  !== 'undefined' && args.demo === true) ? true : false);
	this.id = (typeof args.id !== 'undefined'? args.id :   (10000 + Math.floor ( Math.random ( ) * 99999 + 1)));
	this.providers = (typeof args.providers === 'object' && args.providers.length ? args.providers : oneall.api.providers.get_all_providers());
	this.location = '';
	
	this.args = {
		'id': this.id,
		'mode': this.mode,
		'parent_uri' : this.parent_uri,
		'callback_uri': this.callback_uri,
		'demo': this.demo,
		'providers': this.providers			
	};	
	
	/***************************************************************************************/
	/* Attach Modal Dialog to Link */
	/***************************************************************************************/
	
	/* Attach Modal Dialog to Link / Inject providers into a container */
	this.build = function (container_class_or_id){
		var oakv, i, container, containers, args, source;
						
		/* Transform Options to string */
		args = oneall.tools.json_stringify (this.args);
			
		/* Check for valid container */
		containers = document.getElementById(container_class_or_id);
	
		if (containers !== null && typeof containers === 'object'){
			containers = [containers];
		} else {
			containers = oneall.tools.get_elements_by_class_name (container_class_or_id);
		}	
	
		/* Check if container found */	
		if (containers !== null && typeof containers === 'object'){
			for (i = 0; i < containers.length; i = i + 1){
				container = containers[i];	
								
				/* Setup container */
				container.style.cursor = 'pointer';					
				container.onclick = function(me) {return function(){me.open_sharing_box_dialog(this);return false;};}(this);
			}
			
			/* Add Listener */
			var thiz = this;
			oneall.xd.receiveMessage(function (message){thiz.xd_listener (message);}, oneall.user_settings.get_application_uri());		
		}
		/* Container not found */
		else{
			throw new Error("[ONEALL SOCIAL API] The social sharing container with the id/class ["+containers+"] has not been found");
		}
	};
	
	/***************************************************************************************/
	/* Sharing Box Dialog */
	/***************************************************************************************/

	/* Setup Sharing Box Dialog */
	this.setup_sharing_box_dialog = function(){
		var element, field;	
		
		/* Close Button */
		element = document.getElementById('close_sharing_box_dialog');
		if (element){
			element.onclick = function(me) {return function(){me.xd_poster('close_sharing_box_dialog');};}(this);
		}		
	};	
	
	/* Close Sharing Box Dialog */
	this.close_sharing_box_dialog = function(){				
		oneall.tools.remove_element_by_id ('oa_sharing_box_dialog_'+this.id);
	}	
	
	/* Open Sharing Box Dialog */
	this.open_sharing_box_dialog = function(opener_object){
		var args, oakv, dialog, object_h, object_w, object_x, object_y, viewport_sizes;
		
		/* Do not open twice */
		if (!document.getElementById('oa_sharing_box_dialog_'+this.id)){			
			
			/* Forge Options */
			args = oneall.tools.json_stringify (this.args);
			
			/* Encrypt */
			oakv = oneall.tools.oak.encrypt (this.id, args);
					
			/* Get viewport sizes */
			viewport_size = oneall.tools.get_viewport_size();
					
			/* Find Object Location */
			object_h = opener_object.offsetHeight;
			object_w = opener_object.offsetWidth;
			object_x = oneall.tools.get_object_pos_x(opener_object);
			object_y = oneall.tools.get_object_pos_y(opener_object);
			
			/* Calculate dialog location */
			dialog_x = (object_x + 5);
			dialog_y = (object_y + object_h);
			dialog_w = 240;
			dialog_h = 240;
			
			if ((dialog_x + dialog_w) > viewport_size.width)
			{
				dialog_x = (object_x + object_w - 5 - dialog_w);
			}
			
			if ((dialog_y + dialog_h) > viewport_size.height)
			{
				dialog_y = (object_y  - dialog_h - 5);
			}
			
			/* Create Dialog */
			dialog = document.createElement('div');
			dialog.setAttribute('id', 'oa_sharing_box_dialog_'+this.id);
			dialog.style.width = '280px';
			dialog.style.heigth = '280px';
			dialog.style.zIndex = '999996';
			dialog.style.left = dialog_x + 'px';
			dialog.style.top = dialog_y + 'px';
				
			/* Inject Frame into Dialog */
			oneall.tools.create_iframe (
				dialog, {
					'id': 'oa_sharing_box_dialog_'+this.id,
					'name': 'SocialSharing',
					'width': '280px',
					'height': '280px',
					'src': (oneall.user_settings.get_provider_sharing_box_uri() + '?oakk='+ this.id +'&oakv=' + oakv)
				}
			);
			
			/* Add to document */
			document.body.appendChild(dialog);
		}
	};
	
	/***************************************************************************************/
	/* Cross Domain Communication */
	/***************************************************************************************/
	
	/* Cross Domain Poster */
	this.xd_poster = function (data){
		oneall.xd.postMessage(this.id+'::'+data, this.parent_uri, window.parent);
	};
	
	/* Cross Domain Listener */
	this.xd_listener = function (message){
		var message_data_parts, message_target_id, message_data, message_content_parts, message_action_parts, element;
			
		/* Check message */
		if (typeof message.data !== 'undefined'){			
			message_data_parts = message.data.split('::');
			
			if (message_data_parts.length === 2){	
				message_target_id = parseInt(message_data_parts[0], 10);
				
				if (message_target_id === this.id){					
					message_content = message_data_parts[1];				
					message_content_parts = message_content.split('|');
				
					switch (message_content_parts[0]){						
						/* Close Login Data Dialog */
						case 'close_sharing_box_dialog':
							this.close_sharing_box_dialog();
						break;
					}
				}
			}
		}
	};
}


