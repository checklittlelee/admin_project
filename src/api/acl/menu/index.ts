import request from '@/utils/request'
import type { PermissionResponse, MenuParams } from './type'

enum API {
  // 获取全部菜单数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单添加一个子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 编辑菜单
  EDITMENU_URL = '/admin/acl/permission/update',
  // 删除菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/'
}

export const reqAllPermission = () => request.get<any, PermissionResponse>(API.ALLPERMISSION_URL)
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    // 有id，是编辑；没有id，是增加
    return request.put<any, any>(API.EDITMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
export const reqDeleteMenu = (id: number) => request.delete<any, any>(API.DELETEMENU_URL + id)
