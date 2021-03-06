export default {
  namespaced: true,
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
}