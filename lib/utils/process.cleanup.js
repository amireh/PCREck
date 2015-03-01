var doExit = function() {
  process.exit();
};

module.exports = function(onExit) {
  process.on('cleanup', function() {
    setTimeout(doExit, 2500);
    onExit(doExit);
  });

  process.on('exit', function () {
    process.emit('cleanup');
  });

  process.on('SIGINT', function () {
    console.log('rgx: SIGINT caught, terminating gracefully...');
    process.emit('cleanup');
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    console.error('rgx: uncaught Exception...');
    console.error(e.stack);

    process.exit(99);
  });
};