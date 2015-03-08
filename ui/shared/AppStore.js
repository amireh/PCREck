var Store = require('Store');
var { AVAILABLE_DIALECTS } = require('getConfig')();

var flagFiles = require.context("json!dialects/", true, /([^\/]+)\/flags.json$/);

var FLAGS = flagFiles.keys().reduce(function(flags, flagFile) {
  var dialectFlags = flagFiles(flagFile);
  var dialect = flagFile.split('/')[1];

  flags[dialect] = Object.keys(dialectFlags).map(function(flagName) {
    return { name: flagName, desc: dialectFlags[flagName] };
  });

  return flags;
}, {});

class AppStore extends Store {
  getAvailableDialects() {
    return AVAILABLE_DIALECTS;
  }

  getAvailableFlags(dialect) {
    return FLAGS[dialect];
  }

  getLatestError() {
    return this.state.error;
  }

  setError(error) {
    // TODO: handle internal 500 errors too
    this.setState({ error: error.message });
  }

  clearError() {
    this.setState({ error: undefined });
  }
}

module.exports = AppStore;