var fs = require('fs');
var path = require('path');
var CONFIG = require('../config');
var ROOT = path.resolve(__dirname, '..');

module.exports = function() {
  var dir = path.join(ROOT, CONFIG.DIALECTS_DIR);

  return fs.readdirSync(dir).filter(function(dialect) {
    var filePath = path.join(dir, dialect);
    var fileStats = fs.statSync(filePath);
    var binMap = CONFIG.DIALECT_BINMAP;
    var binName = binMap[dialect] || 'rgx-' + dialect;

    return (
      fileStats &&
      fileStats.isDirectory() &&
      fs.existsSync(path.join(filePath, 'bin', binName))
    );
  });
};