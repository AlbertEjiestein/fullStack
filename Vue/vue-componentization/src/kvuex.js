let Vue;

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  })
}

class Store {
  constructor(options) {
    this.state = new Vue({
      data: options.state
    })
    this.mutations = options.mutations || {};
    this.actions = options.actions || {};

    options.getters && this.handleGetters(options.getters);
  }

  commit = (eventName, payload) => {
    const fn = this.mutations[eventName];
    fn(this.state, payload);
  }

  dispatch(eventName, payload) {
    const fn = this.actions[eventName];
    return fn({ commit: this.commit, state: this.state }, payload);
  }

  // getters只能读不能写
  handleGetters(getters) {
    this.getters = {};
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      })
    })
  }
}

export default {
  Store,
  install
}
