import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Authority from '../components/authority/Authority'
import Roles from '../components/authority/Roles'

Vue.use(VueRouter)

const routes = [
  // 用户输入'/'，定向到login
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Authority },
      { path: '/roles', component: Roles }
    ]
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
