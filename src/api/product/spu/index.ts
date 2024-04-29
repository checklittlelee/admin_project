// SPU管理接口
import request from '@/utils/request'
import type {
  SpuData,
  HasSpuResponseData,
  AllBrand,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData
} from './type.ts'

// SPU管理模块接口地址（1+4）
enum API {
  // 获取已有SPU数据接口
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌列表数据接口
  ALLBRAND_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下全部售卖商品图片数据接口
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个SPU下全部已有的销售属性数据接口
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 增加一个新SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 编辑一个已有SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo'
}

// 获取三级分类下已有的SPU数据接口方法
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) =>
  request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
// 获取全部SPU品牌列表数据接口方法
export const reqAllBrand = () => request.get<any, AllBrand>(API.ALLBRAND_URL)
// 获取某个SPU下全部售卖商品图片数据接口方法
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
// 获取某个SPU下销售属性接口方法
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
// 获取全部销售属性接口方法
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 增加一个新SPU接口方法
// 编辑一个已有SPU接口方法
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 有id，是编辑；没有id，是增加
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
