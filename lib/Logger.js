module.exports = function(context) {
  var logger = {};
  var loggingContext = context + ':';

  [ 'info', 'warn', 'error', 'log' ].forEach(function(logLevel) {
    logger[logLevel] = function() {
      var args = [].slice.call(arguments);
      args[0] = loggingContext + ' ' + args[0];
      console[logLevel].apply(console, args);
    };
  });

  return logger;
};