var React = require("react");
var Button = require("components/Button");
var Icon = require("components/Icon");
var { AVAILABLE_SCHEMES, DEFAULT_SCHEME } = require("constants");

var ColorSchemeSwitcher = React.createClass({
  componentDidMount: function() {
    document.body.className = DEFAULT_SCHEME;
  },

  render() {
    return(
      <Button
        onClick={this.switchScheme}
        className="color-scheme-switcher"
        title="Switch Scheme"
      >
        <Icon className="icon-contrast" />
      </Button>
    );
  },

  switchScheme: function() {
    var className = document.body.className;

    if (className.indexOf("solarized--light") > -1) {
      className = className.replace("solarized--light", "solarized--dark");
    }
    else {
      className = className.replace("solarized--dark", "solarized--light");
    }

    document.body.className = className;
  }
});

module.exports = ColorSchemeSwitcher;