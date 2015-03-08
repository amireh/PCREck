var React = require("react");
var { Link } = require("react-router");
var { arrayOf, string } = React.PropTypes;

var DialectPicker = React.createClass({
  displayName: "DialectPicker",

  propTypes: {
    availableDialects: arrayOf(string)
  },

  getDefaultProps: function() {
    return {
      availableDialects: []
    };
  },

  render() {
    return(
      <div className="dialect-picker">
        {this.props.availableDialects.map(this.renderDialect)}
      </div>
    );
  },

  renderDialect: function(dialect) {
    return (
      <div key={dialect} onClick={this.setDialect} className="dialect-picker__dialect">
        <Link to="editor" params={{dialect: encodeURIComponent(dialect)}}>{dialect}</Link>
      </div>
    );
  }
});

module.exports = DialectPicker;