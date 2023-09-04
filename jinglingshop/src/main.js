import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import css from './assets/quanju.css'


// 导入element-ui的全局组件
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);
//导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
// 配置axios请求默认路径
axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1';
// 发起请求数据拦截
axios.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('token');
  if (token) { config.headers['Authorization'] = token; }
  return config
}, error => {
  return Promise.reject(error);
})
// 创建一个过滤器  来格式化时间
// // let timeFormat =
Vue.filter('dateFormat', function (originVal) {
  let time = new Date(originVal);
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + '').padStart(2, '0');
  let d = (time.getDate() + '').padStart(2, '0');
  let h = (time.getHours() + '').padStart(2, '0');
  let mi = (time.getMinutes() + '').padStart(2, '0');
  let s = (time.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${mi}:${s}`
});
// 导入lodash库来使用merge合并对象
import _ from 'lodash'
// 导入树形结构
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  css,
  render: function (h) { return h(App) }
}).$mount('#app')
