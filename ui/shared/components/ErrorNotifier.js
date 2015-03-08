var React = require("react");
var Actions = require("Actions");

var ErrorNotifier = React.createClass({
  propTypes: {
    error: React.PropTypes.string
  },

  render() {
    var { error } = this.props;

    if (!error) {
      return null;
    }

    return(
      <div className="error-notifier">
        Dang! An internal error has occured:
        {' '}
        <em className="error-notifier__message">{error}</em>
        {' '}
        <a onClick={this.dismiss}>Dismiss</a>
      </div>
    );
  },

  dismiss: function() {
    Actions.dismissError();
  }
});

module.exports = ErrorNotifier;