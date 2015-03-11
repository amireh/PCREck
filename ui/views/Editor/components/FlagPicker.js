var React = require("react");
var Checkbox = require("components/Checkbox");
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
      value: '',
      dialect: ''
    };
  },

  render: function() {
    return(
      <div className="flag-picker">
        <header className="flag-picker__header">
          {this.props.dialect} Flags
        </header>

        <div className="flag-picker__flags">
          {this.props.flags.map(this.renderFlag)}
        </div>
      </div>
    );
  },

  renderFlag: function(flag) {
    return (
      <Checkbox
        key={flag.name}
        value={flag.name}
        checked={this.props.value.indexOf(flag.name) > -1}
        onChange={this.props.onChange}
        className="flag-picker__flag"
      >
        {' '}
        <code className="type-strong">/{flag.name}</code>
        {' '}
        {flag.desc}
      </Checkbox>
    )
  }
});

module.exports = FlagPicker;