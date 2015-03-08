var React = require('react');
var classSet = require('utils/classSet');

/**
 * @class Components.Checkbox
 *
 * A nice-looking custom checkbox. This component takes care of wrapping
 * the checkbox with a label, so just pass in a "label" prop and other props
 * to the <input /> field itself you may need.
 */
var Checkbox = React.createClass({
  propTypes: {
    label: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      spanner: false
    };
  },

  render: function() {
    var className = classSet({
      'checkbox': true,
      'checkbox--checked': !!this.props.checked,
      'checkbox--spanner': !!this.props.spanner
    }, this.props.className);

    return(
      <label className={className}>
        <input
          tabIndex="0"
          type="checkbox"
          name={this.props.name}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />

        <span className="checkbox__indicator icon" />

        {this.props.label || this.props.children}
      </label>
    );
  }
});

module.exports = Checkbox;