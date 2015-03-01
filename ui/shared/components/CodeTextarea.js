var React = require('react');
var CodeMirror = require('codemirror');
var { extend } = require('lodash');
require('codemirror/mode/ruby/ruby');

var DEFAULTS = {
  mode: 'ruby'
};

var CodeTextarea = React.createClass({
  displayName: 'CodeTextarea',

  componentDidMount: function() {
    this.cm = CodeMirror.fromTextArea(
      this.refs.inputWidget.getDOMNode(),
      extend({}, DEFAULTS, this.props.options)
    );

    this.cm.on('change', () => {
      this.props.onChange(this.cm.getValue());
    });
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  render() {
    return(
      <div className="highlighted-input">
        <textarea
          ref="inputWidget"
          value={this.props.value}
          readOnly
        />
      </div>
    );
  }
});

module.exports = CodeTextarea;