var React = require("react");
var CodeMirror = require('codemirror');
var modeHtmlMixed = require('codemirror/mode/htmlmixed/htmlmixed');

var HIGHLIGHT_OPTIONS = {
  className: 'highlighted-input__match'
};

var HighlightedInput = React.createClass({
  displayName: "HighlightedInput",

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
    var { range } = this.props;

    this.cm.getAllMarks().forEach(function(mark) {
      mark.clear();
    });

    if (range) {
      this.cm.markText(
        this.cm.posFromIndex(range[0]),
        this.cm.posFromIndex(range[1]+1),
        HIGHLIGHT_OPTIONS
      );
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