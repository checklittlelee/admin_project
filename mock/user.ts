function createUserList() {
  return [
    {
      userId: 1,
      avatar: '../public/avatar_man.png',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token'
    },
    {
      userId: 2,
      avatar: '../public/avatar_woman.png',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token'
    }
  ]
}

export default [
  // 用户登录接口
  {
    url: '/api/user/login', // 请求地址
    method: 'post', // 请求方式
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password
      )
      // 没有用户 返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: { message: '账号或者密码不正确' }
        }
      }
      // 如果有 返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    }
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      const token = request.headers.token
      const checkUser = createUserList().find((item) => item.token === token)
      // 没有用户 返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: { message: '获取用户信息失败' }
        }
      }
      // 如果有 返回成功信息
      return { code: 200, data: { checkUser } }
    }
  }
]
