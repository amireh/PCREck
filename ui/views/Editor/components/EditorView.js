var React = require("react");
var Label = require('components/Label');
var Button = require('components/Button');
var CodeTextarea = require('components/CodeTextarea');
var Subject = require('./Subject');
var Actions = require('Actions');
var { findWhere } = require('lodash');

var EditorView = React.createClass({
  displayName: "EditorView",

  getDefaultProps: function() {
    return {
      pattern: '',
      subjects: [],
      results: []
    };
  },

  render() {
    return(
      <div className="editor">
        <form onSubmit={this.consume}>
          <Label value="Pattern">
            <CodeTextarea
              onChange={this.updatePattern}
              value={this.props.pattern}
            />
          </Label>

          <div className="editor__subjects">
            {this.props.subjects.map(this.renderSubject)}
          </div>

          <div className="editor__subject-controls">
            <Button onClick={this.addSubject}>+</Button>
          </div>

          {false && <div className="editor__actions">
            <Button onClick={this.submitConstruct}>Test</Button>
          </div>}
        </form>
      </div>
    );
  },

  consume(e) {
    e.preventDefault();
  },

  updatePattern(newPattern) {
    Actions.updatePattern(newPattern);
  },

  addSubject: function() {
    Actions.addSubject();
  },

  submitConstruct: function() {
    Actions.submit();
  },

  renderSubject: function(subject) {
    var result = findWhere(this.props.results, { subjectId: subject.id });

    return (
      <div key={'subject-'+subject.id}>
        <Label value={"Subject " + subject.position}>
          <Subject
            onChange={this.updateSubject.bind(null, subject.id)}
            result={result ? result.result : undefined}
            {...subject}
          />
        </Label>
      </div>
    );
  },

  updateSubject: function(id, newText) {
    Actions.updateSubjectText(id, newText);
  }
});

module.exports = EditorView;