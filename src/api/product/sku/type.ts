// 全部的接口返回数据共有部分类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SKU部分的数据类型
export interface Attr {
  id?: number
  attrId: string | number // 平台属性ID
  valueId: string | number // 平台属性值ID
  valueName: string
}
export interface saleAttr {
  id?: number
  saleAttrId: string | number // 销售属性ID
  saleAttrValueId: string | number // 销售属性值ID
  saleAttrValueName: string
}
export interface SkuData {
  category3Id?: string | number // 三级分类ID
  spuId?: string | number // 已有SPU ID
  tmId?: string | number // 品牌ID
  skuName?: string
  price?: string | number
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: Attr[] // 平台属性
  skuSaleAttrValueList?: saleAttr[] // 销售属性
  skuDefaultImg?: string
  isSale?: number // 商品上架与下架状态
  id?: number
  skuImageList?: any[]
}
// 获取某个SPU下所有SKU列表返回的数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
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
// 获取某个商品详情返回的数据类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
