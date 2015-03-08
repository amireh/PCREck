var React = require("react");
var Router = require("react-router");
var RouteActions = require("actions/RouteActions");
var getConfig = require("getConfig");
var ColorSchemeSwitcher = require("components/ColorSchemeSwitcher");

var { RouteHandler } = Router;

var Root = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getDefaultProps() {
    return {
      query: {}
    };
  },

  componentDidMount: function() {
    RouteActions.assignDelegate(this);

    this.populate();
  },

  componentWillUnmount: function() {
    RouteActions.assignDelegate(undefined);
  },

  render() {
    return (
      <div className="app-container">
        <RouteHandler
          onChange={this.reload}
          config={getConfig()}
          {...this.props}
        />

        <ColorSchemeSwitcher />
      </div>
    );
  },

  populate: function() {
    var config = getConfig();
  },

  reload: function() {
    console.debug('Root: Rendering.');

    this.forceUpdate();
  },
});

module.exports = Root;