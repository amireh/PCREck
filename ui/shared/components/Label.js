var React = require("react");

var Label = React.createClass({
  displayName: "Label",

  getDefaultProps: function() {
    return {
      fakeLabel: false
    };
  },

  render() {
    var Tag = this.props.fakeLabel ? 'div' : 'label';

    return(
      <Tag className="form-label">
        <span className="form-label__caption">{this.props.value}</span>
        <div className="form-label__widget">
          {this.props.children}
        </div>
      </Tag>
    );
  }
});

module.exports = Label;