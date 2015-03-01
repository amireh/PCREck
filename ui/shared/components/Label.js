var React = require("react");

var Label = React.createClass({
  displayName: "Label",

  render() {
    return(
      <label className="form-label">
        <span className="form-label__caption">{this.props.value}</span>
        <div className="form-label__widget">
          {this.props.children}
        </div>
      </label>
    );
  }
});

module.exports = Label;