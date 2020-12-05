/* 
1. 创建响应式变量存储当前路由
2. 创建监听事件,监听当前路由变化时,更新路由,并更新dom
3. 创建路由映射表,解析路由配置信息
4. 创建router-link和router-view全局组件
*/

let Vue;

class VueRouter {
  constructor(options) {
    this.$options = options;

    // 创建路由到组件的映射
    this.routeMap = {};

    this.app = new Vue({
      data: {
        current: '/'
      }
    })
  }

  init() {
    // 绑定事件
    this.bindEvents();

    // 解析路由配置
    this.createRouteMap(this.$options);

    // 创建全局组件
    this.initComponents();
  }

  bindEvents() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    window.addEventListener('load', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.app.current = window.location.hash.slice(1) || '/';
  }

  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item;
    })
  }

  initComponents() {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h){
        return h('a', {attrs: {href: '#' + this.to}}, this.$slots.default)
      }
    });

    Vue.component('router-view', {
      render: h => {
        const Comp = this.routeMap[this.app.current].component;
        return h(Comp);
      }
    })
  }
}

// 把VueRouter变为插件
VueRouter.install = function(_Vue) {
    Vue = _Vue; // 这里保存，上面使用

    // 混入任务
    Vue.mixin({ // 混入：就是扩展Vue
        beforeCreate() {
            // 这里的代码将来会在外面初始化的时候被调用
            // 这样我们就实现了Vue扩展
            // this是谁？ Vue组件实例
            // 但是这里只希望根组件执行一次
            if (this.$options.router) {
                // Vue.prototype.$router = this.$options.router;
                this.$options.router.init();
            }
            
        }
    })
}


export default VueRouter