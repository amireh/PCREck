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
      availableFlags: [],
      activeSubjectId: null
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.activeSubjectId !== prevProps.activeSubjectId) {
      this.refs.subject.focus();
    }
  },

  render() {
    var availableFlagNames = pluck(this.props.availableFlags, 'name').join('');

    return(
      <div className="editor">
        <form onSubmit={this.consume}>
          <div className="editor__pattern-and-flags">
            <Label className="flags-input-container" value="Flags">
              <CodeTextarea
                className=""
                onChange={this.updateFlags}
                value={this.props.flags}
                placeholder={availableFlagNames.substr(0,6)}
                options={{scrollbarStyle: null}}
              />
            </Label>

            <Label className="pattern-input-container" value="Pattern">
              <CodeTextarea
                onChange={this.updatePattern}
                value={this.props.pattern}
                autoFocus
              />
            </Label>
          </div>

          <HTabbedPanel
            inverted
            onChange={this.activateSubject}
            className="editor__subjects"
            contentKeys={pluck(this.props.subjects, 'id')}
            value={this.props.activeSubjectId}
          >
            {this.props.subjects.map(this.renderSubjectTab)}

            <HTabbedPanel.Tab key="controls" tabClassName="editor__subject-controls">
              <Button
                className="editor__add-subject-btn"
                onClick={this.addSubject}>
                +
              </Button>
            </HTabbedPanel.Tab>

            <HTabbedPanel.Content>
              {this.props.activeSubjectId &&
                this.renderSubject(this.props.activeSubjectId)
              }
            </HTabbedPanel.Content>
          </HTabbedPanel>

          <FlagPicker
            flags={this.props.availableFlags}
            value={this.props.flags}
            onChange={this.toggleFlag}
            dialect={this.props.dialect}
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

  addSubject: function(e) {
    e.stopPropagation();

    if (this.props.activeSubjectId) {
      Actions.updateSubjectAttrs(
        this.props.activeSubjectId,
        this.refs.subject.getCustomAttributes()
      );
    }

    Actions.addSubject();
  },

  submitConstruct: function() {
    Actions.submit();
  },

  renderSubjectTab: function(subject) {
    var result = findWhere(this.props.results, { subjectId: subject.id }) || {};
    var Tab = HTabbedPanel.Tab;

    return (
      <Tab key={subject.id} className="editor__subject-tab">
        {false &&
          <EllipsifedText>{subject.text}</EllipsifedText>
        }

        {<ResultEmblem {...result.result} />}
      </Tab>
    );
  },

  activateSubject: function(id) {
    if (this.props.activeSubjectId) {
      Actions.updateSubjectAttrs(
        this.props.activeSubjectId,
        this.refs.subject.getCustomAttributes()
      );
    }

    Actions.activateSubject(id);
  },

  renderSubject: function(id) {
    var subject = findWhere(this.props.subjects, { id });
    var result = findWhere(this.props.results, { subjectId: id });

    if (!subject) {
      return null;
    }

    var { customAttrs } = subject;

    return (
      <div className="editor__subject" key={'subject-'+subject.id}>
        <Label value={"Subject " + subject.position}>
          <Subject
            ref="subject"
            onChange={this.updateSubject.bind(null, subject.id)}
            result={result ? result.result : undefined}
            {...customAttrs}
            {...subject}
          />
        </Label>
      </div>
    );
  },

  updateSubject: function(id, newText, customAttrs) {
    Actions.updateSubjectAttrs(id, customAttrs);
    Actions.updateSubjectText(id, newText);
  }
});

module.exports = EditorView;