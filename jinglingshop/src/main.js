import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui的全局组件
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);
// 

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
