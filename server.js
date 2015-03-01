#!/usr/bin/env node

var connect = require('connect');
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var rgxConfig = require('./config');
var path = require('path');
var API = require('./lib/API');
var cleanup = require('./lib/utils/process.cleanup');

var ROOT = __dirname;
var host = rgxConfig.HOST;
var port = rgxConfig.PORT;
var app = connect();

// gzip/deflate outgoing responses
app.use(compression());

// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded());

if (process.env.NODE_ENV === 'development') {
  require('./lib/startDevServer')(app);
}

app.use(serveStatic('www', {
  etag: false
}));

app.use(/\/dialects\/([^\/])+/, function(req, res, next) {
  if (req.method !== 'POST') { next(); }
});

cleanup(API.stop);

API.start([ 'PCRE' ], function() {
  http.createServer(app).listen(port, host, function(err, result) {
    if (err) {
      console.error(err);
    }
    else {
      console.info('rgx.io server started at ' + host + ':' + port);
    }
  });
});