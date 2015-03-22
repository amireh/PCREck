var CodeMirror = require('codemirror');
// var theme = 'zenburn';

// require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/placeholder');
require('codemirror/addon/selection/mark-selection');
// require('style!css!codemirror/theme/' + theme + '.css');

// CodeMirror.defaults.theme = theme;
CodeMirror.defaults.lineNumbers = false;
CodeMirror.defaults.dragDrop = false;
CodeMirror.defaults.styleSelectedText = true;
// CodeMirror.defaults.matchBrackets = true;
// CodeMirror.defaults.mode = 'javascript';
CodeMirror.defaults.extraKeys = {
  'Tab': false,
  'Shift-Tab': false
};