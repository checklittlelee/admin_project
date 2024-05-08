export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 职位数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}
// 全部职位数组类型
export type Records = RoleData[]
// 响应的数据类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 菜单与权限数据类型
export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: MenuList[]
  select: boolean
}
export type MenuList = MenuData[]
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
