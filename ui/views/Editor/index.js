var React = require("react");
var EditorView = require('./components/EditorView');
var EditorStore = require('EditorStore');
var ResultStore = require('ResultStore');

var Editor = React.createClass({
  displayName: "Editor",

  componentDidMount: function() {
    EditorStore.getSingleton().addChangeListener(this.reload);
    ResultStore.getSingleton().addChangeListener(this.reload);
  },

  componentWillUnmount: function() {
    EditorStore.getSingleton().removeChangeListener(this.reload);
    ResultStore.getSingleton().removeChangeListener(this.reload);
  },

  render() {
    var editorStore = EditorStore.getSingleton();
    var resultStore = ResultStore.getSingleton();

    return(
      <div>
        <EditorView
          dialect={editorStore.getDialect()}
          pattern={editorStore.getPattern()}
          subjects={editorStore.getSubjects()}
          flags={editorStore.getFlags()}
          availableFlags={editorStore.getAvailableFlags()}
          results={resultStore.getAll()}
        />
      </div>
    );
  },

  reload: function() {
    this.props.onChange();
  }
});

module.exports = Editor;