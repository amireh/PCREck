var successCodes = [ 200, 204 ];

var parse = function(xhr) {
  var payload;

  if (xhr.responseJSON) {
    return xhr.responseJSON;
  }
  else if ((xhr.responseText || '').length) {
    payload = (xhr.responseText || '').replace('while(1);', '');

    try {
      payload = JSON.parse(payload);
    } catch(e) {
      payload = xhr.responseText;
    }
  }
  else {
    payload = undefined;
  }

  return payload;
};

module.exports = function(options, onSuccess, onError) {
  var url = options.url;
  var method = options.type || 'GET';
  var async = options.hasOwnProperty("async") ? !!options.async : true;
  var data = options.data;
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    // all is well
    if (xhr.readyState === 4) {
      if (successCodes.indexOf(xhr.status) > -1) {
        if (onSuccess) {
          onSuccess(parse(xhr), xhr.status, xhr);
        }
      }
      else {
        if (onError) {
          onError(parse(xhr), xhr.status, xhr);
        }
      }
    }
  };

  xhr.open(method, url, async);

  if (options.headers) {
    Object.keys(options.headers).forEach(function(header) {
      xhr.setRequestHeader(header, options.headers[header]);
    });
  }

  xhr.send(JSON.stringify(data));
};
