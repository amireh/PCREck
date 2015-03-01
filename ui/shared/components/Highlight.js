var React = require("react");
var hljs = require("highlight.js");

hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));

var Highlight = React.createClass({
  getDefaultProps: function () {
    return {
      className: undefined
    };
  },

  componentDidMount: function () {
    this.highlightCode();
  },

  componentDidUpdate: function () {
    this.highlightCode();
  },

  highlightCode: function () {
    var nodes = this.getDOMNode().querySelectorAll('pre');

    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i=i+1) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },

  render: function () {
    return (
      <div
        dangerouslySetInnerHTML={{__html: this.props.children}}
        className={this.props.className}
      />
    );
  }
});


module.exports = Highlight;