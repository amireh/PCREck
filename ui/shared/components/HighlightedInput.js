var React = require("react");
var CodeMirror = require('codemirror');
var modeHtmlMixed = require('codemirror/mode/htmlmixed/htmlmixed');

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
      this.props.onChange(this.cm.getValue());
    });
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  componentDidUpdate: function(prevProps, prevState) {
    var { cm } = this;
    var { match, captures } = this.props;
    var highlight = function(range, opts) {
      // console.log('highlighting [%o,%o] with %s', cm.posFromIndex(range[0]-1), cm.posFromIndex(range[1]), opts.className);
      cm.markText(cm.posFromIndex(range[0]), cm.posFromIndex(range[1]+1), opts);
    };

    cm.getAllMarks().forEach(function(mark) {
      mark.clear();
    });

    if (match) {
      highlight(match, MATCH_HIGHLIGHT_OPTIONS);
    }

    if (captures) {
      captures.forEach(function(capture) {
        highlight(capture, CAPTURE_HIGHLIGHT_OPTIONS);
      });
    }
  },

  render() {
    return(
      <div className="highlighted-input">
        <textarea
          ref="inputWidget"
          value={this.props.value}
          readOnly
        />
      </div>
    );
  }
});

module.exports = HighlightedInput;