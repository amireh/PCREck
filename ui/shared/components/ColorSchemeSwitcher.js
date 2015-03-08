var React = require("react");
var { AVAILABLE_SCHEMES, DEFAULT_SCHEME } = require("constants");

var ColorSchemeSwitcher = React.createClass({
  componentDidMount: function() {
    document.body.className = DEFAULT_SCHEME;
  },

  render() {
    return(
      <button
        onClick={this.switchScheme}
        className="color-scheme-switcher icon icon-contrast"
        title="Switch Scheme"
      />
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