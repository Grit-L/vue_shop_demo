import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
// import Users from '../components/user/Users'
// import Authority from '../components/authority/Authority'
// import Roles from '../components/authority/Roles'
// import Category from '../components/goods/Category'
// import CateList from '../components/goods/List'
// import CateParams from '../components/goods/Params'
// import AddGoods from '../components/goods/AddGoods'
// import Order from '../components/order/Order'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome')

const Users = () => import(/* webpackChunkName: "Users_Authority_Roles" */ '../components/user/Users')
const Authority = () => import(/* webpackChunkName: "Users_Authority_Roles" */ '../components/authority/Authority')
const Roles = () => import(/* webpackChunkName: "Users_Authority_Roles" */ '../components/authority/Roles')

const Category = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Category')
const CateParams = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params')

const CateList = () => import(/* webpackChunkName: "CateList_Add" */ '../components/goods/List')
const AddGoods = () => import(/* webpackChunkName: "CateList_Add" */ '../components/goods/AddGoods')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order')
// const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

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
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/goods', component: CateList },
      { path: '/params', component: CateParams },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order }
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
