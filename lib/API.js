var Channel = require('./Channel');
var Request = require('./Request');
var Logger = require('./Logger');
var findWhere = require('lodash').findWhere;
var channels = [];
var running = false;

var console = Logger('API');

exports.start = function(dialects, done) {
  var opened = 0;
  var tick = function(id) {
    ++opened;

    console.log('Channel ' + id + ' is now open. Got ' + (dialects.length - opened) + ' more to go.');

    if (opened === dialects.length) {
      running = true;
      done();
    }
  };

  if (!dialects.length) {
    return done();
  }

  dialects.forEach(function(dialect) {
    var channel = Channel(dialect);

    channel.open(
      function addChannel() {
        channels.push(channel);
        tick(dialect);
      },

      function reportFailure(err) {
        console.error('Channel ' + dialect + ' has failed to open, ignoring.');
        // TODO: would be nice if we could propagate the error or some signal
        tick(dialect);
      }
    );
  });
};

exports.stop = function(done) {
  var closed = 0;
  var nrChannels = channels.length;
  var onClose = function(id) {
    ++closed;

    console.log('Channel ' + id + ' has been closed. %d/%d', closed, nrChannels);

    if (closed === nrChannels) {
      running = false;
      console.log('\tDisconnected.');
      done();
    }
  };

  if (!nrChannels) {
    done();
  }
  else {
    channels.forEach(function(channel) {
      channel.close(onClose.bind(null, channel.id));
    });

    channels = [];
  }
};

exports.match = function(dialect, pattern, subjects, flags, done) {
  var channel = findWhere(channels, { id: dialect });
  var results = [];

  if (!channel) {
    throw new Error('Channel "' + dialect + '" has not been opened.');
  }
  else if (!channel.isConnected()) {
    throw new Error('Channel "' + dialect + '" is unavailable');
  }

  if (!subjects || !subjects.length) {
    return done([]);
  }

  subjects.forEach(function(subject, i) {
    channel.send(Request(pattern, subject, flags), function(result) {
      results.push(result);

      if (results.length === subjects.length) {
        done(results);
      }
    });
  });
};

exports.isRunning = function() {
  return running;
};