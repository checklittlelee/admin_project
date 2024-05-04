// SKU管理接口
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

// SPU管理模块接口地址
enum API {
  // 获取已有商品数据
  SKU_URL = '/admin/product/list/',
  // 商品上架接口
  ONSALE_URL = '/admin/product/onSale/',
  // 商品下架接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除已有商品
  DELETESKU_URL = '/admin/product/deleteSku/'
}

// 获取商品SKU数据列表接口方法
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 商品上架的请求
export const reqOnSaleSku = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId)
// 商品下架的请求
export const reqCancelSaleSku = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
// 获取某个商品详情的接口方法
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
// 删除某个商品的请求
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)
