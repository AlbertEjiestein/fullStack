import Vue from 'vue'
import App from './App.vue'
import router from './krouter';
import Bus from './plugins/bus';


Vue.config.productionTip = false

Vue.use(Bus);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
