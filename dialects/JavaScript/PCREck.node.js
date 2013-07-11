#!/usr/bin/env node

/**
 * This file is part of PCREck.
 *
 * PCREck is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PCREck is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with PCREck. If not, see <http://www.gnu.org/licenses/>.
 */

var
http = require('http'),

/**
 * Prints an error report due to bad input and aborts the script.
 *
 * Output format: { "error": "message" }
 */
input_error = function(cause) {
  return JSON.stringify({ error: cause });
},
success = function(out) {
  return res.end(JSON.stringify(out));
},
error = function(cause) {
  return res.end(input_error(cause));
},
/**
 * Output format on no match: []
 * Output format on match:    [ M_OFFSET, M_END ]
 */
handle = function(pattern, subject, flags) {
  var expr    = null,
      result  = null;

  if (!pattern) {
    return error("missing pattern");
  }
  if (!subject) {
    return error("missing subject");
  }

  // Validate the pattern
  try {
    expr = RegExp(pattern, flags);
  } catch (e) {
    return error(e.message);
  }

  // Execute it
  result = expr.exec(subject);
  if (result) {
    // we got a match, build its range
    var match     = { begin: subject.search(expr), end: null },
        captures  = result.slice(1);

    match.end = match.begin + result[0].length;

    // print the range of the match and the captures as per the spec
    return success([match.begin, match.end ].concat(captures));
  }
  else {
    // no match, print an empty array as per the spec
    return success([]);
  }
},

/** The current response stream */
res,
address = process.argv[2] || '127.0.0.1',
port    = process.argv[3] || 1337;

if ((process.argv[2]||'').indexOf('help') > -1) {
  return console.log("usage: PCREck.js [ADDRESS] [PORT]");
}

http.createServer(function (req, in_res) {
  res = in_res;
  res.writeHead(200, {'Content-Type': 'application/json'});

  if ( req.method !== 'POST' ) {
    return error('unsupported METHOD');
  }

  var data = '';

  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    try {
      data = JSON.parse(data.trim());
    } catch(e) {
      return error(e.message);
    }

    handle(data.pattern, data.subject, data.options);
  });

}).listen(port, address);

console.log('PCREck.js running at ' + address + ':' + port);