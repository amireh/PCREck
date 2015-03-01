var CodeMirror = require('codemirror');
var theme = 'midnight';

require('style!css!codemirror/theme/' + theme + '.css');

CodeMirror.defaults.theme = theme;
CodeMirror.defaults.lineNumbers = false;
CodeMirror.defaults.dragDrop = false;