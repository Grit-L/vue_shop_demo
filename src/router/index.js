import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/Users.vue'

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
  },
  {
    path: '/home',
    component: home,
    redirect: 'welcome',
    children: [{ path: '/welcome', component: welcome },
      { path: '/users', component: users }]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
// route(to,from,next)
// to 要访问的页面
// from 从哪个页面访问
// next() 放行到目标页面 next('/login')返回登录页
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token值返回登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
