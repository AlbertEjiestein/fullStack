## Vue源码解析

### 项目调试

阅读源码的第一步，应该是分析如何调试`Vue`项目。`package.json`的启动命令如下，为了能在`src`中的文件和`dist`中的文件之间形成位置映射，需要加`--sourcemap`：

```js
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
```

> 这里需要注意，我们是想在web端分析源码，并且想了解vue的编译和运行时过程，因此需要设置TARGET为web-full-dev，具体配置见下面的config.js文件



`scripts`文件夹下，三个配置脚本：

+ alias.js：文件夹起别名

  ```js
  module.exports = {
    vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
    compiler: resolve('src/compiler'),
    core: resolve('src/core'),
    shared: resolve('src/shared'),
    web: resolve('src/platforms/web'),
    weex: resolve('src/platforms/weex'),
    server: resolve('src/server'),
    entries: resolve('src/entries'),
    sfc: resolve('src/sfc')
  }
  ```

+ config.js：这里我们选择`web-full-dev`作为`TARGET`，因为我们需要了解vue编译过程且没有压缩的代码，由于使用`rollup`打包工具而非`webpack`，所以不能选择`web-full-esm`这种`es (em module)`格式作为TARGET，因为是`web`端，排除`cjs (commonjs)`，因此选择`umd`比较合适。

  ```js
  const builds = {
    ...
    // Runtime+compiler ES modules build (for bundlers)
    'web-full-esm': {
      entry: resolve('web/entry-runtime-with-compiler.js'),
      dest: resolve('dist/vue.esm.js'),
      format: 'es',
      alias: { he: './entity-decoder' },
      banner
    },
    // runtime-only production build (Browser)
    'web-runtime-prod': {
      entry: resolve('web/entry-runtime.js'),
      dest: resolve('dist/vue.runtime.min.js'),
      format: 'umd',
      env: 'production',
      banner
    },
    // Runtime+compiler development build (Browser)
    'web-full-dev': {
      entry: resolve('web/entry-runtime-with-compiler.js'),
      dest: resolve('dist/vue.js'),
      format: 'umd',
      env: 'development',
      alias: { he: './entity-decoder' },
      banner
    },
    // Runtime+compiler production build  (Browser)
    'web-full-prod': {
      entry: resolve('web/entry-runtime-with-compiler.js'),
      dest: resolve('dist/vue.min.js'),
      format: 'umd',
      env: 'production',
      alias: { he: './entity-decoder' },
      banner
    }
    ...
  }
  ```
  ```js
  // 根据builds中的配置参数生成rollup配置对象，包含input、external、plugins、output等
  function genConfig (name) {
    const opts = builds[name]
    const config = {
      input: opts.entry,
      external: opts.external,
      plugins: [
        replace({
          __WEEX__: !!opts.weex,
          __WEEX_VERSION__: weexVersion,
          __VERSION__: version
        }),
        flow(),
        alias(Object.assign({}, aliases, opts.alias))
      ].concat(opts.plugins || []),
      output: {
        file: opts.dest,
        format: opts.format,
        banner: opts.banner,
        name: opts.moduleName || 'Vue'
      },
      onwarn: (msg, warn) => {
        if (!/Circular/.test(msg)) {
          warn(msg)
        }
      }
    }
  
    if (opts.env) {
      config.plugins.push(replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env)
      }))
    }
  
    if (opts.transpile !== false) {
      config.plugins.push(buble())
    }
  
    Object.defineProperty(config, '_name', {
      enumerable: false,
      value: name
    })
  
    return config
  }
  ```

  ```js
  // 根据package.json中设置的TARGET，来生成配置
  if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
  } else {
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
  }
  ```

+ build.js：对每一种配置进行`rollup`打包构建
  ```js
  let builds = require('./config').getAllBuilds()
  
  build(builds) // 对每种配置进行打包构建
  
  function build (builds) {
    let built = 0
    const total = builds.length
    const next = () => {
      buildEntry(builds[built]).then(() => {
        built++
        if (built < total) {
          next()
        }
      }).catch(logError)
    }
  
    next()
  }
  
  function buildEntry (config) {
    const output = config.output
    const { file, banner } = output
    const isProd = /(min|prod)\.js$/.test(file)
    return rollup.rollup(config) // rollup进行打包
      .then(bundle => bundle.generate(output))
      .then(({ output: [{ code }] }) => {
        if (isProd) {
          const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
            toplevel: true,
            output: {
              ascii_only: true
            },
            compress: {
              pure_funcs: ['makeMap']
            }
          }).code
          return write(file, minified, true)
        } else {
          return write(file, code)
        }
      })
  }
  ```

  

### 初始化流程

当我们`new Vue()`的时候，这个过程发生了什么？

+ src\platforms\web\entry-runtime-with-compiler.js：**入口文件，扩展$mount，解析template和el，将template编译成render函数**

  ```js
  const mount = Vue.prototype.$mount
  Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
  ): Component {
    // 获取选项
    const options = this.$options
    if (!options.render) { // render优先
      let template = options.template
      if (template) {
        // 没有render则解析template
      } else if (el) {
        // 没有template则解析el
        template = getOuterHTML(el)
      }
      if (template) { // 将template编译成render函数
        const { render, staticRenderFns } = compileToFunctions(template, {...}, this)
        options.render = render
      }
    }
    return mount.call(this, el, hydrating)
  }
  ```

+ src\platforms\web\runtime\index.js：**web运行时代码，实现$mount以及patch方法（虚拟dom中进行diff算法比较）**

  ```js
  Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
  ): Component {
    return mountComponent(this, el, hydrating)
  }
  ```

  + src\core\instance\lifecycle.js：**mountComponent函数完成了执行render函数生成vnode，执行update函数生成dom并渲染到屏幕**

    ```js
    function mountComponent (
      vm: Component,
      el: ?Element,
      hydrating?: boolean
    ): Component {
      vm.$el = el
          
      callHook(vm, 'beforeMount')
    
      let updateComponent
     
        updateComponent = () => {
          vm._update(vm._render(), hydrating) // _update函数调用了patch函数，将vnode转换为dom节点然后渲染在视图中
        }
    
      new Watcher(vm, updateComponent, noop, {
        before () {
          if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
          }
        }
      }, true /* isRenderWatcher */)
      hydrating = false
    
      if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
      }
      return vm
    }
    ```

    

  ```js
  import { patch } from './patch'
  
  Vue.prototype.__patch__ = inBrowser ? patch : noop
  ```

+ src\core\index.js：**全局API定义**

  ```js
  function initGlobalAPI (Vue: GlobalAPI) {
    Vue.set = set
    Vue.delete = del
    Vue.nextTick = nextTick
  
    Vue.observable = <T>(obj: T): T => {
      observe(obj)
      return obj
    }
  
    initUse(Vue)
    initMixin(Vue)
    initExtend(Vue)
    initAssetRegisters(Vue)
  }
  ```

  

+ src\core\instance\index.js：**定义Vue构造函数**

  ```js
  function Vue (options) {
    this._init(options)
  }
  
  // 对Vue进行扩展
  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
  
  export default Vue
  ```

  + initMixin：**实现Vue.prototype._init**

  ```js
  function initMixin (Vue: Class<Component>) {
    Vue.prototype._init = function (options?: Object) {
  	initLifecycle(vm) // vm.$parent/$root/$children/$refs
      initEvents(vm) // updateComponentListeners 
      initRender(vm) // vm._c / vm.$createElement
      callHook(vm, 'beforeCreate')
      initInjections(vm) // resolveInject / defineReactive
      initState(vm) // initProps/initMethods/initData/initComputed/initWatch
      initProvide(vm) // vm._provided
      callHook(vm, 'created')
    }
  }
  ```

  + stateMixin：**$data/$props/$set/$del/$watch**

  ```js
  function stateMixin (Vue: Class<Component>) {
    const dataDef = {}
    dataDef.get = function () { return this._data }
    const propsDef = {}
    propsDef.get = function () { return this._props }
      
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)
  
    Vue.prototype.$set = set
    Vue.prototype.$delete = del
  
    Vue.prototype.$watch = function (): Function {}
  }
  ```

  

  + eventsMixin：**$on/$once/$off/$emit**

  ```js
  function eventsMixin (Vue: Class<Component>) {
  	  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {}
      
        Vue.prototype.$once = function (event: string, fn: Function): Component {}
      
        Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {}
      
        Vue.prototype.$emit = function (event: string): Component {}
  }
  ```

  

  + lifecycleMixin：**_update/$forceUpdate/$destroy**

  ```js
  function lifecycleMixin (Vue: Class<Component>) {
    Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
  
    Vue.prototype.$forceUpdate = function () {}
  
    Vue.prototype.$destroy = function () {}
  }
  ```

  

  + renderMixin：**Vue.prototype.$nextTick/_render**

  ```js
  function renderMixin (Vue: Class<Component>) {
    Vue.prototype.$nextTick = function (fn: Function) {
      return nextTick(fn, this)
    }
    Vue.prototype._render = function (): VNode {}
  }
  ```

  

### 数据响应式

+ src\core\instance\state.js：initData

  ```js
  proxy(vm, `_data`, key)
  
  observe(data, true /* asRootData */)
  ```

+ src\core\observer\index.js：observe

  ```js
  function observe (value: any, asRootData: ?boolean): Observer | void {
    ob = new Observer(value)
    return ob
  }
  ```

+ src\core\observer\index.js：Observer

  ```js
  class Observer {
      // 对象响应化
      walk (obj: Object) {
          const keys = Object.keys(obj)
          for (let i = 0; i < keys.length; i++) {
              defineReactive(obj, keys[i])
          }
      }
      // 数组响应化
      observeArray (items: Array<any>) {
          for (let i = 0, l = items.length; i < l; i++) {
              observe(items[i])
          }
      }
  }
  ```

  + defineReactive

  ```js
  function defineReactive (
    obj: Object,
    key: string,
    val: any,
    customSetter?: ?Function,
    shallow?: boolean
  ) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {},
      set: function reactiveSetter (newVal) {}
    })
  }
  ```

+ src\core\observer\dep.js：**Dep**

  ```js
  class Dep {
    addSub (sub: Watcher) {}
  
    removeSub (sub: Watcher) {}
  
    depend () {
      if (Dep.target) {
        Dep.target.addDep(this)
      }
    }
  
    notify () {}
  }
  ```

+ src\core\observer\watcher.js：**Watcher**

  ```js
  class Watcher {
    get () {}
  
    addDep (dep: Dep) {
      const id = dep.id
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
          dep.addSub(this)
        }
      }
    }
  
    cleanupDeps () {}
  
    update () {
      if (this.lazy) {
        this.dirty = true
      } else if (this.sync) {
        this.run()
      } else { // 异步更新队列
        queueWatcher(this)
      }
    }
      
    run () {}
  
    evaluate () {}
  
    depend () {
      let i = this.deps.length
      while (i--) {
        this.deps[i].depend()
      }
    }
  
    teardown () {}
  }
  ```

  + src\core\observer\scheduler.js：**queueWatcher**

  ```js
  function queueWatcher (watcher: Watcher) {
    queue.push(watcher)
    nextTick(flushSchedulerQueue)
  }
  ```

  + src\core\util\next-tick.js：**nextTick**

  ```js
  function nextTick (cb?: Function, ctx?: Object) {
    callbacks.push(() => cb.call(ctx))
    timerFunc()
  }
  ```

  timerFunc指定了vue异步执⾏策略，根据执⾏环境，⾸选Promise，备选依次为： MutationObserver、setImmediate、setTimeout

  

### 虚拟DOM



### 编译器

