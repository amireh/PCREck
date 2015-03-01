var fs = require('fs');
var path = require('path');
var config = require('../config');
var ROOT = path.resolve(__dirname, '..');

module.exports = function() {
  var dir = path.join(ROOT, config.DIALECTS_DIR);

  return fs.readdirSync(dir).filter(function(dialect) {
    var filePath = path.join(dir, dialect);
    var fileStats = fs.statSync(filePath);

    return (
      fileStats &&
      fileStats.isDirectory() &&
      fs.existsSync(path.join(filePath, 'bin', 'rgx-'  + dialect))
    );
  });
};