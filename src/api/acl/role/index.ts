// 职位管理接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  // 获取全部职位
  ALLROLE_URL = '/admin/acl/role/',
  // 添加职位
  ADDROLE_URL = '/admin/acl/role/save',
  // 编辑已有职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部菜单与权限
  ALLPERMISSION = '/admin/acl/permission/toAssign/',
  // 给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除已有的职位
  DELETEROLE_URL = '/admin/acl/role/remove/'
}

// 获取全部职位
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
// 添加/编辑职位
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    // 有id，是编辑；没有id，是增加
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
// 获取全部权限与权限
export const reqAllPermissionList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION + roleId)
// 给相应的职位下发权限
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
// 删除已有的职位
export const reqDeleteRole = (roleId: number) => request.delete<any, any>(API.DELETEROLE_URL + roleId)
