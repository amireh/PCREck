var Store = require('Store');

class ResultStore extends Store {
  getInitialState() {
    return {
      results: []
    };
  }

  getAll() {
    return this.state.results;
  }
}

module.exports = ResultStore;