// 品牌管理接口
import request from '@/utils/request'
import { BrandResponseData, BrandData } from './type'

// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  GETBRAND_URL = '/admin/product/baseTrademark/',
  // 添加品牌接口
  ADDBRAND_URL = '/admin/product/baseTrademark/save',
  // 编辑品牌接口
  UPDATEBRAND_URL = '/admin/product/baseTrademark/update',
  // 删除品牌接口
  DELETE_URL = '/admin/product/baseTrademark/remove/'
}

// 获取已有品牌的接口方法
export const reqHasBrand = (page: number, limit: number) =>
  request.get<any, BrandResponseData>(API.GETBRAND_URL + `${page}/${limit}`)

// 添加/编辑品牌的接口方法
export const reqAddOrUpdateBrand = (data: BrandData) => {
  if (data.id) {
    // 存在id，为编辑品牌
    return request.put(API.UPDATEBRAND_URL, data)
  } else {
    // 没有id，为添加品牌
    return request.post(API.ADDBRAND_URL, data)
  }
}

// 删除品牌的接口方法
export const reqDeleteBrand = (id: number) => request.delete<any, any>(API.DELETE_URL + id)
