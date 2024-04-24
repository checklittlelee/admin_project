// 全部的接口返回数据共有部分类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有的品牌接口返回数据类型
export interface BrandData {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部的品牌接口返回数据类型
export type Records = BrandData[]

// 获取的已有全部的品牌接口返回数据类型
export interface BrandResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
