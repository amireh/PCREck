var { extend } = require("lodash");
// var defaults = require("../../defaults");
var defaults = {};
var cache;

module.exports = function() {
  return cache || (function() {
    var config = cache = extend({}, defaults);

    return config;
  }());
};