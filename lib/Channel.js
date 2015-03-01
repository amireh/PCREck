var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var Logger = require('./Logger');
var domain = require('domain');
var CONFIG = require('../config');
var ROOT = path.resolve(__dirname, '..');

var getDialectBinPath = function(dialect) {
  return path.resolve(ROOT, 'dialects', dialect, 'bin', 'rgx-' + dialect);
};

var Channel = function(dialect) {
  var client;
  var binPath = getDialectBinPath(dialect);
  var console = Logger('Channel[' + dialect + ']');
  var queue = [];

  if (!fs.existsSync(binPath)) {
    throw new Error(
      'Missing binary for dialect "' + dialect + '"; expected file to exist ' +
      'at ' + binPath
    );
  }


  return {
    id: dialect,

    open: function(onSuccess, _onError) {
      var d = domain.create();
      var onErrorCalled = false;
      var onError = function() {
        if (!onErrorCalled) {
          _onError();
          onErrorCalled = true;
        }
      };

      d.on('error', function(err) {
        console.error('engine could not be booted up.');
        console.error(err.stack);

        client = null;

        onError();
      });

      d.run(function() {
        client = spawn(binPath, [], {
          stdio: [ 'pipe', 'pipe', process.stderr ]
        });

        if (!client.pid) {
          client = null;
          onError();
          return;
        }

        client.on('close', function (code) {
          if (code !== null && code !== 0) {
            console.warn('Engine has exited abnormally with code ' + code);

            onError();

            if (client) {
              client.stdin.end();
              client = null;
            }
          }
          else {
            console.log('Engine has exited normally.');
            client = null;
          }
        });

        client.on('error', function(err) {
          console.warn('Engine has raised an error:', String(err));
          client = null;
        });

        client.stdout.on('data', function(_buffer) {
          var buffer = String(_buffer);

          if (buffer === CONFIG.SIGNAL_READY + '\n') {
            console.log('Open.');
            onSuccess();
          }
          else {
            console.log('Result received:', buffer);

            buffer.split("\n").filter(function(result) {
              return result.length > 0;
            }).forEach(function(result) {
              if (queue.length > 0) {
                queue.shift()(JSON.parse(result));
              }
            });
          }
        });
      });
    },

    isConnected: function() {
      return !!client;
    },

    close: function(done) {
      console.log('Closing...');

      try {
        if (client) {
          client.on('close', done);
          client.kill();
          client = null;
        }
        else {
          done();
        }
      }
      catch (e) {
        console.warn('Unable to stop engine cleanly: ' + e.message);
        done();
      }
    },

    send: function(message, done) {
      if (client) {
        queue.push(done);
        client.stdin.write(message + '\n');
      }
      else {
        done();
      }
    }
  };
};

module.exports = Channel;