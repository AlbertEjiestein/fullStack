import Vue from 'vue';
import Home from './views/Home';
import About from './views/About';
import List from './views/List';
import Router from './kvue-router';
// import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", component: Home },
    { path: "/list", component: List }, 
    { path: "/about", component: About }
  ]
})