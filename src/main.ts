import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
import 'virtual:svg-icons-register' // svg插件
import globalComponent from '@/components' // 自定义插件对象：注册项目全局组件
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission' // 路由鉴权
import 'default-passive-events'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(globalComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
