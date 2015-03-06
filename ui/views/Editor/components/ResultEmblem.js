var React = require("react");
var classSet = require('react/lib/cx');

var ResultEmblem = React.createClass({
  displayName: "ResultEmblem",

  getDefaultProps: function() {
    return {
      match: false,
      captures: 0
    };
  },

  render() {
    var match = this.props.status === 'RC_MATCH';
    var captureCount = this.props.captures.length;
    var capturedCount = match ? this.props.captures.filter(function(capture) {
      return capture.length === 2;
    }).length : 0;

    var className = classSet({
      'match-status-emblem': true,
      'match-status-emblem--match': match,
      'match-status-emblem--nomatch': !match,
      'match-status-emblem--captured': capturedCount > 0
    });

    return(
      <div className={className}>
        {captureCount > 0 && <span>{capturedCount} / {captureCount}</span>}
      </div>
    );
  }
});

module.exports = ResultEmblem;