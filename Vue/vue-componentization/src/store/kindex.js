import Vue from 'vue';
import Vuex from '../kvuex.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations:{
    increment(state) {
      state.count++;
    }
  },
  getters: {
    score(state) {
      return 'score:' + state.count;
    }
  },
  actions: {
    asyncIncrement({commit}) {
      return new Promise(resolve => {
        setTimeout(function() {
          commit("increment");
          resolve({ok: 1})
        }, 1000)
      })
    }
  }
})