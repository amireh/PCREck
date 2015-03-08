var React = require("react");
var classSet = require('react/lib/cx');
var { KC_RETURN } = require("constants");
var findChildByType = require("utils/findChildByType");

var HTabbedPanel = React.createClass({
  displayName: "HTabbedPanel",

  getInitialState: function() {
    return {
      activeTab: null
    };
  },

  propTypes: {
    inverted: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      inverted: false
    };
  },

  render() {
    var { inverted } = this.props;
    var activeTab = this.getActiveTab();
    var tabs = (
      <div className="h-tabbed-panel__tabs">
        {React.Children.map(this.props.children, this.renderTab)}
      </div>
    )
    ;
    return(
      <div className={"h-tabbed-panel " + (this.props.className || '')}>
        {!inverted && tabs}

        <div className="h-tabbed-panel__content">
          {activeTab && this.renderContent(activeTab)}
        </div>

        {inverted && tabs}
      </div>
    );
  },

  renderTab: function(child, index) {
    if (child.type !== HTabbedPanel.Tab.type) {
      return null;

    }
    var key = this.props.contentKeys[index] || index;
    var props = {};
    var className = {
      "h-tabbed-panel__tab": true,
      "h-tabbed-panel__tab--active": this.getActiveTab() === key
    };

    if (child.props.tabClassName) {
      className[child.props.tabClassName] = true;
    }

    props.onClick = child.props.onClick || this.activateTab.bind(null, key);
    props.onKeyPress = child.props.onKeyPress || this.activateTabOnReturn.bind(null, key);
    props.className = classSet(className);
    props.children = child;
    props.key = key;

    return (
      <div tabIndex="0" {...props} />
    );
  },

  renderContent: function(activeTab) {
    if (this.props.contentRenderer) {
      return this.props.contentRenderer(activeTab);
    }
    else {
      var content = findChildByType(this.props.children, HTabbedPanel.Content);
      return content;
    }
  },

  activateTab: function(id, e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.isControlled()) {
      if (this.props.onChange) {
        this.props.onChange(id);
      }
      else {
        console.warn('Passing value but no onChange handler for HTabbedPanel!');
      }
    }
    else {
      if (this.props.contentKeys.indexOf(id) > -1) {
        this.setState({ activeTab: id });
      }
    }
  },

  activateTabOnReturn: function(id, e) {
    if (e.which === KC_RETURN) {
      this.activateTab(id, e);
    }
  },

  getActiveTab: function() {
    return this.isControlled() ?
      this.props.value :
      this.state.activeTab || this.props.contentKeys[0]
    ;
  },

  isControlled: function() {
    return this.props.value !== undefined;
  }
});

HTabbedPanel.Tab = React.createClass({
  render: function() {
    return <div {...this.props} />;
  }
});

HTabbedPanel.Content = React.createClass({
  render: function() {
    return this.props.children;
  }
});

module.exports = HTabbedPanel;