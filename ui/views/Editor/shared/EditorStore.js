var Store = require('Store');
var subjectUUID = 0;

class EditorStore extends Store {
  getInitialState() {
    return {
      pattern: '',
      subjects: [],
      flags: []
    };
  }

  getPattern() {
    return this.state.pattern;
  }

  setPattern(newPattern) {
    this.setState({ pattern: newPattern });
  }

  getSubjects() {
    return this.state.subjects;
  }

  addSubject() {
    this.state.subjects.push({
      id: `s${++subjectUUID}`,
      position: this.state.subjects.length+1,
      text: ''
    });

    this.emitChange();
  }

  getFlags() {
    return this.state.flags;
  }
}

module.exports = EditorStore;