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
      captures: arrayOf(string)
    })
  },

  render() {
    var result = this.props.result || {};

    return(
      <div>
        <HighlightedInput
          range={result.status === RC_MATCH ? result.offset : undefined}
          value={this.props.text}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
});

module.exports = Subject;