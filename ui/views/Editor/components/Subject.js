var React = require("react");
var HighlightedInput = require('components/HighlightedInput');
var { RC_MATCH } = require('constants');
var { string, number, array, arrayOf, shape } = React.PropTypes;
var Subject = React.createClass({
  displayName: "Subject",

  propTypes: {
    id: string,
    text: string,
    position: number,
    result: shape({
      status: string,
      offset: array,
      captures: arrayOf(arrayOf(number))
    })
  },

  componentDidMount: function() {
    if (this.props.cursor) {
      this.refs.input.setCursor(this.props.cursor);
    }
  },

  render() {
    var result = this.props.result || {};

    return(
      <HighlightedInput
        ref="input"
        match={result.status === RC_MATCH ? result.offset : undefined}
        captures={result.status === RC_MATCH ? result.captures : undefined}
        value={this.props.text}
        onChange={this.emitChange}
        autoFocus={this.props.autoFocus}
      />
    );
  },

  emitChange(text) {
    this.props.onChange(text, this.getCustomAttributes());
  },

  focus() {
    return this.refs.input.focus();
  },

  getCustomAttributes() {
    return { cursor: this.refs.input.getCursor() };
  }
});

module.exports = Subject;