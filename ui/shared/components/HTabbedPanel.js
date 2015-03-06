var React = require("react");
var classSet = require('react/lib/cx');

var HTabbedPanel = React.createClass({
  displayName: "HTabbedPanel",

  getInitialState: function() {
    return {
      activeTab: null
    };
  },

  render() {
    var activeTab = this.getActiveTab();

    return(
      <div className={"h-tabbed-panel " + (this.props.className || '')}>
        <div className="h-tabbed-panel__tabs">
          {React.Children.map(this.props.children, this.renderTab)}
        </div>

        <div className="h-tabbed-panel__content">
          {activeTab && this.props.contentRenderer(activeTab)}
        </div>
      </div>
    );
  },

  renderTab: function(child, index) {
    var handler;
    var key = this.props.contentKeys[index];
    var className = classSet({
      "h-tabbed-panel__tab": true,
      "h-tabbed-panel__tab--active": this.getActiveTab() === key
    });

    if (child.type === HTabbedPanel.Tab.type) {
      handler = this.activateTab.bind(null, key);
    }

    return (
      <div
        key={'tab-'+key}
        className={className}
        onClick={handler}
        children={child}
      />
    );
  },

  activateTab: function(id, e) {
    e.preventDefault();
    this.setState({ activeTab: id });
  },

  getActiveTab: function() {
    return this.state.activeTab || this.props.contentKeys[0];
  }
});

HTabbedPanel.Tab = React.createClass({
  render: function() {
    return <div {...this.props} />;
  }
});

module.exports = HTabbedPanel;