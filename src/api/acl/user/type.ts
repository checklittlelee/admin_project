// 全部的接口返回数据共有部分类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 单个用户账号的数据类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}
// 包含全部用户信息的数组类型
export type Records = User[]
// 获取全部用户信息接口返回的数据类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number // 用户总数
    size: number
    current: number
    pages: number // 总页数
  }
}

// 一个职位的数据类型
export interface RoleData {
  id?: number
  createTime: string
  updateTime: string
  roleName: string
  remark?: null
}
// 全部职位列表
export type AllRole = RoleData[]
// 获取全部职位的接口返回的数据类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}
// 给用户分配职位接口携带参数的数据类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
