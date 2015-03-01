var React = require("react");
var classSet = require("react/lib/cx");

var Content = React.createClass({
  render() {
    return (
      <div className="layout-content">
        {this.props.children}
      </div>
    );
  }
});

var Sidebar = React.createClass({
  render() {
    return (
      <div className="layout-sidebar">
        {this.props.children}
      </div>
    );
  }
});

var ActionBar = React.createClass({
  render() {
    return (
      <div className="layout-action-bar">
        {this.props.children}
      </div>
    );
  }
});

var Tabs = require("./Layout/Tabs");

var Layout = React.createClass({
  statics: {
    getTabsHeight: function() {
      var node = document.querySelector(".layout-tabs");

      if (node) {
        return node.getBoundingClientRect().height;
      }
      else {
        return 50;
      }
    }
  },

  getDefaultProps: function() {
    return {
      children: [],
      query: {}
    };
  },

  render() {
    // var ChildTabs = this.getChild(Tabs);
    var ChildSidebar = this.getChild(Sidebar);
    var ChildContent = this.getChild(Content);
    var ChildActionBar = this.getChild(ActionBar);

    var className = classSet({
      "layout": true,
      "layout--with-sidebar": !!ChildSidebar,
      "layout--with-content": !!ChildContent,
      "layout--with-action-bar": !!ChildActionBar
    }) + ' ' + (this.props.className || '');

    return(
      <div className={className}>
        <Tabs tab={this.props.query.tab} />

        {ChildSidebar && {ChildSidebar}}
        {ChildContent && {ChildContent}}
        {ChildActionBar && {ChildActionBar}}
      </div>
    );
  },

  getChild: function(type) {
    if (React.Children.count(this.props.children) > 0) {
      var targetChild;

      React.Children.forEach(this.props.children, function(child) {
        if (!targetChild && child && child.type === type.type) {
          targetChild = child;
        }
      });

      return targetChild;
    }
  }
});

module.exports = Layout;
// module.exports.Tabs = Tabs;
module.exports.Sidebar = Sidebar;
module.exports.ActionBar = ActionBar;
module.exports.Content = Content;