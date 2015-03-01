var glob = require('glob');
var path = require('path');
var expect = require('chai').expect;
var files = glob.sync(path.resolve(__dirname, '**', '*.test.js'));

global.expect = expect;

files.forEach(require);
