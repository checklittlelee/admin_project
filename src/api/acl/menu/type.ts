export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Permission {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: PermissionList
  select: boolean
}
export type PermissionList = Permission[]
// 菜单接口返回的数据类型
export interface PermissionResponse extends ResponseData {
  data: PermissionList
}
// 添加与编辑菜单携带的参数类型
export interface MenuParams {
  id?: number
  code: string // 权限数值
  level: number // 菜单等级
  name: string // 菜单名字
  pid: number // 已有菜单ID
}
