export default {
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
      return '分数为:' + state.count;
    }
  },
  actions: {
    asyncAdd({commit}) {
      commit("increment");
    }
  }
}