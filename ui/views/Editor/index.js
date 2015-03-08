var React = require("react");
var EditorView = require('./components/EditorView');
var Banner = require('./components/Banner');
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
        <Banner />

        <EditorView
          dialect={editorStore.getDialect()}
          pattern={editorStore.getPattern()}
          subjects={editorStore.getSubjects()}
          flags={editorStore.getFlags()}
          availableFlags={editorStore.getAvailableFlags()}
          results={resultStore.getAll()}
          activeSubjectId={editorStore.getActiveSubjectId()}
        />
      </div>
    );
  },

  reload: function() {
    this.props.onChange();
  }
});

module.exports = Editor;