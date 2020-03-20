import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/globle.css'
// 导入vue-table
import tableTree from 'vue-table-with-tree-grid'
// 导入图标样式表
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 导入路由
import axios from 'axios'

// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求路径 本地项目地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 在request 拦截器中, 展示进度条 NProgress.start()
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
// axios拦截器 校验token字段
axios.interceptors.request.use(config => {
  NProgress.start()
  // 设置请求头中的Authorization参数为 登录的token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false
// 组件全局注册 表格树
Vue.component('tree-table', tableTree)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
// 时间格式话 使用过滤器
Vue.filter('dateFormat', function (origin) {
  const dt = new Date(origin)
  const y = dt.getFullYear()
  // 不足两位 0补齐
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
