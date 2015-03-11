var Store = require('Store');
var appStore = require('AppStore').getSingleton();
var subjectUUID = 0;

class EditorStore extends Store {
  getInitialState() {
    return {
      pattern: 'foo(bar)',
      subjects: [{ id: 's0011', position: 1, text: 'foobarzoo' }],
      flags: '',
      activeSubjectId: null,
    };
  }

  getPattern() {
    return this.state.pattern;
  }

  setPattern(newPattern) {
    this.setState({ pattern: newPattern });
  }

  setFlags(newFlags) {
    this.setState({ flags: newFlags });
  }

  getSubjects() {
    return this.state.subjects;
  }

  addSubject() {
    var subject = {
      id: `s${++subjectUUID}`,
      position: this.state.subjects.length+1,
      text: ''
    };

    this.state.subjects.push(subject);
    this.setState({ activeSubjectId: subject.id });
  }

  getFlags() {
    return this.state.flags;
  }

  getActiveSubjectId() {
    return this.state.activeSubjectId || (
      this.state.subjects.length ? this.state.subjects[0].id : null
    );
  }
}

module.exports = EditorStore;