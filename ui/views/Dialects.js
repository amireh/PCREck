var React = require("react");
var appStore = require("AppStore").getSingleton();
var DialectPicker = require("components/DialectPicker");

var Dialects = React.createClass({
  displayName: "Dialects",

  render() {
    return(
      <div className="dialects">
        <h2>Choose a Dialect</h2>

        <DialectPicker
          availableDialects={appStore.getAvailableDialects()}
        />
      </div>
    );
  }
});

module.exports = Dialects;