#!/usr/bin/env js

/// rgx.js
///
/// rgx::JavaScript engine that allows for executing
/// JavaScript regexes and returns their matches and captures
///
/// Input pattern, subject, and options are expected to be JSON
/// encoded. Output is _always_ JSON encoded.
///
/// Usage: ./rgx.js "pattern" "subject" "options"

var display_usage = function() {
  print('Usage: ./rgx.js "pattern" "subject" "options"');
}

/**
 * Prints an error report due to bad invocation of the script.
 * The script will abort after the error is printed.
 *
 * Output looks like this: { failure: msg }
 */
var invocation_error = function(msg) {
  print(JSON.stringify({ failure: msg }));
  quit(1);
}

if (arguments.length == 1 && (arguments[0] == "--help" || arguments[0] == "-h")) {
  display_usage();
  quit(1);
}
else if (arguments.length < 3) {
  invocation_error("Invalid number of arguments, run with --help for usage.")
  quit(1);
}

/**
 * Prints an error report due to bad input and aborts the script.
 *
 * The output looks like this: { error: msg }
 */
var input_error = function(cause) {
  print(JSON.stringify({ error: cause }));
  quit(1);
}

var decode = function(arg, name) {
  try {
    return JSON.parse(arg);
  } catch (e) {
    invocation_error("Unable to decode " + name + ": " + e);
    quit(1);
  }
}

print(arguments)

var pattern = decode(arguments[0], "pattern"),
    subject = decode(arguments[1], "subject"),
    options = decode(arguments[2], "options"),
    expr    = null;

// Validate the pattern
try {
  expr = RegExp(pattern, options);
} catch (e) {
  input_error(e.message);
}

// Execute it
var result = expr.exec(subject);
if (result) {
  // we got a match, build its range
  var match     = { begin: subject.search(expr), end: null },
      captures  = result.slice(1);

  match.end = match.begin + result[0].length;

  // print the range of the match and the captures as per the spec
  print(JSON.stringify([ match.begin, match.end ].concat(captures) ));
  quit(0);
}
else {
  // no match, print an empty array as per the spec
  print(JSON.stringify( [] ));
  quit(0);
}