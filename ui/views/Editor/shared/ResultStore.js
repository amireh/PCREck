var Store = require('Store');

class ResultStore extends Store {
  getInitialState() {
    return {
      // status: undefined,
      // captures: [],
      // offset: [],
      results: []
    };
  }

  getAll() {
    return this.state.results;
  }
}

module.exports = ResultStore;