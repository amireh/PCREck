var React = require("react");
var CodeMirror = require('codemirror');
var modeHtmlMixed = require('codemirror/mode/htmlmixed/htmlmixed');
var { debounce } = require("lodash");
var { THROTTLE } = require("constants");

var MATCH_HIGHLIGHT_OPTIONS = {
  className: 'highlighted-input__match'
};

var CAPTURE_HIGHLIGHT_OPTIONS = {
  className: 'highlighted-input__capture'
};

var HighlightedInput = React.createClass({
  displayName: "HighlightedInput",

  getDefaultProps: function() {
    return {
      match: undefined,
      captures: [],
    };
  },

  componentDidMount: function() {
    this.cm = CodeMirror.fromTextArea(this.refs.inputWidget.getDOMNode(), {
    });

    this.cm.on('change', () => {
      this.emitChange(this.cm.getValue());
    });

    this.highlight();
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.highlight();
  },

  render() {
    return(
      <div className="highlighted-input">
        <textarea
          ref="inputWidget"
          value={this.props.value}
          autoFocus={this.props.autoFocus}
          readOnly
        />
      </div>
    );
  },

  highlight: function() {
    var { cm } = this;
    var { match, captures } = this.props;
    var highlight = function(range, opts) {
      cm.markText(cm.posFromIndex(range[0]), cm.posFromIndex(range[1]+1), opts);
    };

    this.dehighlight();

    if (match) {
      highlight(match, MATCH_HIGHLIGHT_OPTIONS);
    }

    if (captures) {
      captures.forEach(function(capture) {
        highlight(capture, CAPTURE_HIGHLIGHT_OPTIONS);
      });
    }
  },

  dehighlight: function() {
    this.cm.getAllMarks().forEach(function(mark) {
      mark.clear();
    });
  },

  focus() {
    if (!this.cm.hasFocus()) {
      this.cm.focus();
    }
  },

  setCursor(cursor) {
    this.cm.setCursor(cursor);
  },

  getCursor() {
    return this.cm.getCursor();
  },

  emitChange: debounce(function(value) {
    this.props.onChange(value);
  }, THROTTLE)
});

module.exports = HighlightedInput;