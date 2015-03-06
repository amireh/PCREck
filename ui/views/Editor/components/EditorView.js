var React = require("react");
var Label = require('components/Label');
var Button = require('components/Button');
var CodeTextarea = require('components/CodeTextarea');
var HTabbedPanel = require('components/HTabbedPanel');
var Subject = require('./Subject');
var FlagPicker = require('./FlagPicker');
var ResultEmblem = require('./ResultEmblem');
var Actions = require('Actions');
var EllipsifedText = require('components/EllipsifedText');
var { findWhere, pluck } = require('lodash');

var EditorView = React.createClass({
  displayName: "EditorView",

  getDefaultProps: function() {
    return {
      pattern: '',
      flags: '',
      subjects: [],
      results: [],
      availableFlags: []
    };
  },

  render() {
    var availableFlagNames = pluck(this.props.availableFlags, 'name').join('');

    return(
      <div className="editor">
        <form onSubmit={this.consume}>
          <div className="editor__pattern">
            <Label fakeLabel value="Regular expression:">
              <CodeTextarea
                className="editor__flags inline-block"
                onChange={this.updateFlags}
                value={this.props.flags}
                placeholder={availableFlagNames}
                options={{scrollbarStyle: null}}
              />

              <div className="pattern-input-container">
                <CodeTextarea
                  onChange={this.updatePattern}
                  value={this.props.pattern}
                />
              </div>
            </Label>
          </div>

          <HTabbedPanel
            className="editor__subjects"
            contentRenderer={this.renderSubject}
            contentKeys={pluck(this.props.subjects, 'id')}
          >
            {this.props.subjects.map(this.renderSubjectTab)}

            <div key="controls" className="editor__subject-controls">
              <div className="editor__subject-tab">
                <Button className="editor__add-subject-btn" onClick={this.addSubject}>+</Button>
              </div>
            </div>
          </HTabbedPanel>

          {false && <div className="editor__actions">
            <Button onClick={this.submitConstruct}>Test</Button>
          </div>}

          <FlagPicker
            flags={this.props.availableFlags}
            value={this.props.flags}
            onChange={this.toggleFlag}
          />
        </form>
      </div>
    );
  },

  consume(e) {
    e.preventDefault();
  },

  updateFlags: function(newFlags) {
    Actions.updateFlags(newFlags);
  },

  toggleFlag: function(e) {
    var name = e.target.value;
    var isOn = e.target.checked;
    var flags = this.props.flags || '';

    if (isOn && flags.indexOf(name) === -1) {
      this.updateFlags(flags + name);
    }
    else if (!isOn && flags.indexOf(name) !== -1) {
      this.updateFlags(flags.replace(name, ''));
    }
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

  renderSubjectTab: function(subject) {
    var result = findWhere(this.props.results, { subjectId: subject.id }) || {};

    return (
      <HTabbedPanel.Tab key={subject.id} className="editor__subject-tab">
        {false && <EllipsifedText>{subject.text}</EllipsifedText>}

        {<ResultEmblem {...result.result} />}
      </HTabbedPanel.Tab>
    );
  },

  renderSubject: function(id) {
    var subject = findWhere(this.props.subjects, { id });
    var result = findWhere(this.props.results, { subjectId: id });

    return (
      <div className="editor__subject" key={'subject-'+subject.id}>
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