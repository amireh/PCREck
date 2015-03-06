var React = require("react");
var { arrayOf, shape, string } = React.PropTypes;

var FlagPicker = React.createClass({
  propTypes: {
    flags: arrayOf(shape({
      name: string,
      desc: string
    })),
    value: string
  },

  getDefaultProps: function() {
    return {
      flags: [],
      value: ''
    };
  },

  render: function() {
    return(
      <div>
        {this.props.flags.map(this.renderFlag)}
      </div>
    );
  },

  renderFlag: function(flag) {
    return (
      <label className="form-label" key={flag.name}>
        <input
          type="checkbox"
          value={flag.name}
          checked={this.props.value.indexOf(flag.name) > -1}
          onChange={this.props.onChange}
        />

        <code className="type-strong">/{flag.name}</code>
        {' '}
        {flag.desc}
      </label>
    )
  }
});

module.exports = FlagPicker;