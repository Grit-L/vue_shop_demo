import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/globle.css'
// 导入图标样式表
import './assets/fonts/iconfont.css'
import axios from 'axios'

// 配置请求路径 本地项目地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios拦截器 校验token字段
axios.interceptors.request.use(config => {
  // 设置请求头中的Authorization参数为 登录的token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
