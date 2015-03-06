var React = require("react");
var classSet = require('react/lib/cx');

var VTabbedPanel = React.createClass({
  displayName: "VTabbedPanel",

  getInitialState: function() {
    return {
      activeTab: null
    };
  },

  render() {
    var activeTab = this.getActiveTab();

    return(
      <div className={"v-tabbed-panel " + (this.props.className || '')}>
        <div className="v-tabbed-panel__content">
          {activeTab && this.props.contentRenderer(activeTab)}
        </div>

        <div className="v-tabbed-panel__tabs">
          {React.Children.map(this.props.children, this.renderTab)}
        </div>
      </div>
    );
  },

  renderTab: function(child, index) {
    var handler;
    var key = this.props.contentKeys[index];
    var className = classSet({
      "v-tabbed-panel__tab": true,
      "v-tabbed-panel__tab--active": this.getActiveTab() === key
    });

    if (child.type === VTabbedPanel.Tab.type) {
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

VTabbedPanel.Tab = React.createClass({
  render: function() {
    return <div {...this.props} />;
  }
});

module.exports = VTabbedPanel;