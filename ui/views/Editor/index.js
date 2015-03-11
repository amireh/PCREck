var React = require("react");
var EditorView = require('./components/EditorView');
var appStore = require('AppStore').getSingleton();
var editorStore = require('EditorStore').getSingleton();
var resultStore = require('ResultStore').getSingleton();
var Actions = require('Actions');

var Editor = React.createClass({
  displayName: "Editor",

  componentDidMount: function() {
    editorStore.addChangeListener(this.reload);
    resultStore.addChangeListener(this.reload);
  },

  componentWillUnmount: function() {
    resultStore.removeChangeListener(this.reload);
    editorStore.removeChangeListener(this.reload);
  },

  render() {
    var dialect = this.getDialect();

    return(
      <EditorView
        dialect={dialect}
        pattern={editorStore.getPattern()}
        subjects={editorStore.getSubjects()}
        flags={editorStore.getFlags()}
        availableFlags={appStore.getAvailableFlags(dialect)}
        results={resultStore.getAll()}
        activeSubjectId={editorStore.getActiveSubjectId()}
      />
    );
  },

  reload: function() {
    this.props.onChange();
  },

  getDialect() {
    return decodeURIComponent(this.props.params.dialect);
  }
});

module.exports = Editor;