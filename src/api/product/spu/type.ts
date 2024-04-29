// 全部的接口返回数据共有部分类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据类型
export interface SpuData {
  category3Id: number | string
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}
// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]
// 定义获取已有的SPU接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 已有的品牌接口返回数据类型
export interface BrandData {
  id?: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回数据类型
export interface AllBrand extends ResponseData {
  data: BrandData[]
}

// 商品图片数据类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
// 已有的SPU照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}
// 已有的销售属性值对象数据类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
// 销售属性对象数据类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU已有的销售属性接口返回数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU返回数据类型
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
