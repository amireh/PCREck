var assign = require('lodash').extend;
var singletons = {};

class Store {
  static getSingleton() {
    var constructor = this;
    var name = constructor.name;

    if (!singletons[name]) {
      singletons[name] = new constructor();
    }

    return singletons[name];
  }

  static resetAllStores() {
    for (var storeName in singletons) {
      if (singletons.hasOwnProperty(storeName)) {
        singletons[storeName].__reset__();
      }
    }
  }

  constructor() {
    this.__reset__();

    return this;
  }

  addChangeListener(callback) {
    this._callbacks.push(callback);
  }

  removeChangeListener(callback) {
    var index = this._callbacks.indexOf(callback);

    if (index > -1) {
      this._callbacks.splice(index, 1);
    }
  }

  getInitialState() {
    return {};
  }

  setState(newState) {
    assign(this.state, newState);
    this.emitChange();
  }

  emitChange() {
    this._callbacks.forEach(function(callback) {
      callback();
    });
  }

  /**
   * @private
   *
   * A hook for tests to reset the Store to its initial state. Override this
   * to restore any side-effects.
   *
   * Usually during the life-time of the app, we will never have to reset a
   * Store, but in tests we do.
   */
  __reset__() {
    this._callbacks = [];
    this.state = this.getInitialState();
  }
}

module.exports = Store;