var React = require("react");
var classSet = require("react/lib/cx");

var Status = React.createClass({
  displayName: "Status",

  render() {
    var Tag = this.props.tagName || "span";
    var v = this.props.coverage;
    var className = classSet({
      "Status": true,
      "Status--coverage-1": v >= 0 && v < 25,
      "Status--coverage-2": v >= 25 && v < 50,
      "Status--coverage-3": v >= 50 && v < 75,
      "Status--coverage-4": v >= 75 && v < 90,
      "Status--coverage-5": v >= 90,
      "Status--fill": !!this.props.fill,
    });

    return(
      <Tag className={className}>
        {this.props.children}
      </Tag>
    );
  }
});

module.exports = Status;