var React = require("react");
var Router = require("react-router");
var RouteActions = require("actions/RouteActions");
var getConfig = require("getConfig");
var ColorSchemeSwitcher = require("components/ColorSchemeSwitcher");
var ErrorNotifier = require("components/ErrorNotifier");
var Banner = require('components/Banner');
var appStore = require('AppStore').getSingleton();

var { RouteHandler } = Router;

var Root = React.createClass({
  mixins: [ Router.Navigation, Router.State ],
  statics: {
    willTransitionTo() {
      console.log('>> transition << ');
    }
  },

  getDefaultProps() {
    return {
      query: {},
      params: {}
    };
  },

  componentDidMount: function() {
    RouteActions.assignDelegate(this);
    appStore.addChangeListener(this.reload);
  },

  componentWillUnmount: function() {
    appStore.removeChangeListener(this.reload);
    RouteActions.assignDelegate(undefined);
  },

  render() {
    return (
      <div className="app-container">
        <Banner dialect={this.props.params.dialect} />

        <ErrorNotifier
          error={appStore.getLatestError()}
        />

        <RouteHandler
          onChange={this.reload}
          config={getConfig()}
          {...this.props}
        />

        <ColorSchemeSwitcher />
      </div>
    );
  },

  reload: function() {
    console.debug('Root: Rendering.');

    this.forceUpdate();
  },
});

module.exports = Root;