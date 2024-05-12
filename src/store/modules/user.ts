import { defineStore } from 'pinia'
import router from '@/router'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, ResponseData, loginResponseData, userInfoResponseData } from '@/api/user/type.ts'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token.ts'
import { constantRoute, asyncRoute } from '@/router/routes'
// @ts-expect-error no TS provided by lodash
import cloneDeep from 'lodash/cloneDeep'

// 过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: []
    }
  },
  actions: {
    // 用户登录
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo()
      // 获取成功，存储用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        this.menuRoutes = [...constantRoute, ...userAsyncRoute]
        userAsyncRoute.forEach((route: any) => {
          router.addRoute(route)
        })
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result: ResponseData = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {}
})

export default useUserStore
