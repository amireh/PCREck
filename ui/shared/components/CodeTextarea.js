var React = require('react');
var CodeMirror = require('codemirror');
var { string, func, object } = React.PropTypes;

var CodeTextarea = React.createClass({
  displayName: 'CodeTextarea',

  propTypes: {
    className: string,
    onChange: func.isRequired,
    value: string,
    placeholder: string,
    options: object
  },

  componentDidMount: function() {
    this.cm = CodeMirror.fromTextArea(
      this.refs.inputWidget.getDOMNode(),
      this.props.options
    );

    this.cm.on('change', () => {
      if (!this.cm.isClean() && this.cm.getValue() !== this.props.value) {
        this.props.onChange(this.cm.getValue());
      }
    });
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.value !== this.cm.getValue()) {
      this.cm.setValue(this.props.value);
      this.cm.markClean();
    }
  },

  render() {
    var className = `${this.props.className || ''} code-textarea`;

    return(
      <div className={className}>
        <textarea
          ref="inputWidget"
          value={this.props.value}
          placeholder={this.props.placeholder}
          readOnly
        />
      </div>
    );
  }
});

module.exports = CodeTextarea;