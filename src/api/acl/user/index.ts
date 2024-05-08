// 用户管理接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'

enum API {
  // 获取全部已有用户账号信息
  ALLUSER_URL = '/admin/acl/user/',
  // 增加一个新用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 编辑一个已有用户
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部职位，以及某用户已拥有的职位
  ALLROLEURL = '/admin/acl/user/toAssign/',
  // 给用户分配职位
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除单个用户
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除多个用户
  DELETEUSERS_URL = '/admin/acl/user/batchRemove'
}

// 获取
export const reqUserInfo = (page: number, limit: number, name: string) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?name=${name}`)
// 增加/编辑一个用户接口方法
export const reqAddOrUpdateUser = (data: User) => {
  // 有id，是编辑；没有id，是增加
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
// 获取全部职位以及某用户已拥有的职位数据的接口方法
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)
// 分配职务
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)
// 删除单个用户
export const reqDeleteUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)
// 批量删除多个用户
export const reqDeleteUsers = (idList: number[]) => request.delete<any, any>(API.DELETEUSERS_URL + { data: idList })
