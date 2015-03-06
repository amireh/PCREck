var Store = require('Store');
var getConfig = require('getConfig');
var { AVAILABLE_DIALECTS } = getConfig();
var subjectUUID = 0;

var FLAGS = AVAILABLE_DIALECTS.reduce(function(flags, dialect) {
  var dialectFlags = require("json!dialects/PCRE/flags.json");

  flags[dialect] = Object.keys(dialectFlags).map(function(flagName) {
    return { name: flagName, desc: dialectFlags[flagName] };
  });

  return flags;
}, {});

class EditorStore extends Store {
  getInitialState() {
    return {
      dialect: 'PCRE',
      pattern: 'foo(bar)',
      subjects: [{ id: 's0011', position: 1, text: 'foobarzoo' }],
      flags: ''
    };
  }

  getDialect() {
    return this.state.dialect;
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
    this.state.subjects.push({
      id: `s${++subjectUUID}`,
      position: this.state.subjects.length+1,
      text: ''
    });

    this.emitChange();
  }

  getAvailableFlags() {
    return FLAGS[this.getDialect()];
  }

  getFlags() {
    return this.state.flags;
  }
}

module.exports = EditorStore;