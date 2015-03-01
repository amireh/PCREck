var React = require("react");
var Router = require("react-router");
var classSet = require("react/lib/cx");
var RouteActions = require("actions/RouteActions");
var { TAB_LISTING, TAB_SOURCE, QUERY_OFF } = require("constants");
var DEFAULT_TAB = TAB_LISTING;
var { Link } = Router;

var activeTab;
var Tab = React.createClass({
  render() {
    var className = classSet({
      "layout-tabs__tab": true,
      "layout-tabs__tab--active": this.props.active,
      "active": this.props.active
    });

    return (
      <a
        className={className}
        activeClassName="layout-tabs__tab--active"
        href={this.props.href}
        children={this.props.children}
      />
    );
  },

  onClick() {
    this.props.onClick(this.props.id);
  }
});

var Tabs = React.createClass({
  mixins: [ Router.State ],

  render() {
    activeTab = this.getQuery().tab || DEFAULT_TAB;
    var pathName = this.getPathname();

    return(
      <div className="layout-tabs">
        <marquee behavior="alternate" className="layout-tabs__tab font-bitmap layout-tabs__logo">
          Pierce
        </marquee>

        <Tab key={TAB_LISTING} href="#/" active={pathName === "/"}>
          Overview
        </Tab>

        <Tab key={TAB_SOURCE} href="#/files" active={pathName.match(/^\/files/)}>
          Source
        </Tab>
      </div>
    );
  },

  switchTab: function(tabId) {
    RouteActions.updateQuery({ tab: tabId === DEFAULT_TAB ? QUERY_OFF : tabId });
  }
});

module.exports = Tabs;