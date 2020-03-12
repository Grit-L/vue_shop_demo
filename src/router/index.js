import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'

Vue.use(VueRouter)

const routes = [
  // 用户输入'/'，定向到login
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: login
  }
]

const index = new VueRouter({
  routes
})

export default index
