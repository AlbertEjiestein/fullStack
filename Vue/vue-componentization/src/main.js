import Vue from 'vue'
import App from './App.vue'
import router from './krouter';
import Bus from './plugins/bus';
// import store from './store';
import store from './store/kindex';

Vue.config.productionTip = false

Vue.use(Bus);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
