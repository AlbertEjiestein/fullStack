import Vue from 'vue';

export default function create(Compomemt, props) {
    // 1. 创建vue实例
  const vm = new Vue({
    render(h) {
      return h(Compomemt, {props});
    }
  }).$mount();

  // 2. 通过$children获取组件实例
  const comp = vm.$children[0];

  // 3. 将实例挂载到body上
  document.body.append(vm.$el);

  // 4. 清理函数
  comp.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  }

  // 5. 返回组件实例
  return comp;
}