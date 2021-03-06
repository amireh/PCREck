var appStore = require('AppStore').getSingleton();
var editorStore = require('EditorStore').getSingleton();
var resultStore = require('ResultStore').getSingleton();
var { findWhere, pluck, debounce } = require('lodash');
var ajax = require('utils/ajax');
var { THROTTLE } = require("constants");

var debouncedSubmit;

exports.updatePattern = function(dialect, pattern) {
  editorStore.setPattern(pattern);
  debouncedSubmit(dialect);
};

exports.updateFlags = function(dialect, flags) {
  editorStore.setFlags(flags);
  debouncedSubmit(dialect);
};

exports.addSubject = function() {
  editorStore.addSubject();
};

exports.activateSubject = function(id) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    editorStore.setState({ activeSubjectId: id });
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.updateSubjectAttrs = function(id, customAttrs) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    subject.customAttrs = customAttrs;
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.updateSubjectText = function(dialect, id, newText) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    subject.text = newText;
    editorStore.emitChange();
    debouncedSubmit(dialect);
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.submit = function(dialect) {
  var subjects = editorStore.getSubjects();
  var params = {
    pattern: editorStore.getPattern(),
    subjects: pluck(subjects, 'text'),
    flags: editorStore.getFlags()
  };

  ajax({
    url: `/dialects/${dialect}`,
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
  }, appStore.setError.bind(appStore));
};

debouncedSubmit = debounce(exports.submit, THROTTLE, {
  leading: false, trailing: true
});

exports.dismissError = function() {
  appStore.clearError();
};

/**
 * Called on every route transition. Here we get to clean up any state that
 * should not be carried across the pages, like error notifications.
 */
exports.clearTransientState = function() {
  exports.dismissError();
};