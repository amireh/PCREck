var React = require("react");

var Icon = React.createClass({
  render() {
    return(
      <i className={"icon " + this.props.className} />
    );
  }
});

module.exports = Icon;