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
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  require('./lib/startDevServer')(app);
}

app.use(serveStatic('www', {
  etag: false
}));

app.use(function(req, res, next) {
  var dialect = (req.url.match(/^\/dialects\/([^\/]+)$/) || [])[1];

  console.log(req.url);

  if (dialect && req.method === 'POST') {
    console.log('Got a match request:', req.method, req.url, req.body);
    var params = req.body;
    // var params = JSON.parse(req.body);

    API.match(dialect, params.pattern, params.subjects, params.flags, function(result) {
      res.write(JSON.stringify(result));
      res.end();
    });
  }
  else {
    next();
  }
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