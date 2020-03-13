import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Menu, Submenu, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

// 挂载到全局中，用this调用
Vue.prototype.$message = Message
