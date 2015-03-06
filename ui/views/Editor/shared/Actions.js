var editorStore = require('EditorStore').getSingleton();
var resultStore = require('ResultStore').getSingleton();
var { findWhere, pluck, debounce } = require('lodash');
var ajax = require('utils/ajax');

var debouncedSubmit;
var getCurrentDialect = function() {
  // TODO
  return 'PCRE';
};

exports.updatePattern = function(pattern) {
  editorStore.setPattern(pattern);
  debouncedSubmit();
};

exports.updateFlags = function(flags) {
  editorStore.setFlags(flags);
  debouncedSubmit();
};

exports.addSubject = function() {
  editorStore.addSubject();
};

exports.updateSubjectText = function(id, newText) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    subject.text = newText;
    editorStore.emitChange();
    debouncedSubmit();
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.submit = function() {
  var subjects = editorStore.getSubjects();
  var params = {
    pattern: editorStore.getPattern(),
    subjects: pluck(subjects, 'text'),
    flags: editorStore.getFlags()
  };

  ajax({
    url: `/dialects/${getCurrentDialect()}`,
    type: 'POST',
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }, function(payload) {
    resultStore.setState({
      results: payload.map(function(result, i) {
        return {
          result: result,
          subjectId: subjects[i].id
        };
      })
    });
  }, function(error) {

  });
};

debouncedSubmit = debounce(exports.submit, 200, { leading: false, trailing: true });
