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
var AVAILABLE_DIALECTS = rgxConfig.AVAILABLE_DIALECTS;

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

  if (dialect && AVAILABLE_DIALECTS.indexOf(dialect) === -1) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
      message: "unknown dialect '" + dialect + "'"
    }));
    res.end();
  }
  else if (dialect && req.method === 'POST') {
    var params = req.body;

    API.match(dialect, params.pattern, params.subjects, params.flags, function(result) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));
      res.end();
    });
  }
  else {
    next();
  }
});

app.use(function onerror(err, req, res, next) {
  // an error occurred!
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify({ message: err.message }));
  res.end();
});

cleanup(API.stop);

API.start([ 'PCRE', 'Perl', 'Ruby' ], function() {
  http.createServer(app).listen(port, host, function(err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      console.info('rgx.io server started at ' + host + ':' + port);
    }
  });
});