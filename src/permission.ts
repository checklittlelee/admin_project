// 路由鉴权
// 需求一：任意路由切换时实现顶部进度条效果
// 需求二：由仓库中的token判断：未登录，只能访问login；登录成功，不能访问login，指向首页
import setting from './setting'
import router from '@/router'
import nprogress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css' // 进度条样式
nprogress.configure({ showSpinner: false }) // 右上角旋转效果关闭
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)

router.beforeEach(async (to, from, next) => {
  // 全局前置守卫
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        // 如果没有用户信息，在路由守卫发请求获取用户信息再放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期 || 用户手动编辑本地存储token后对不上了
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: './login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to, from) => {
  // 全局后置守卫
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.done()
})
