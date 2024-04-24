// 全部的接口返回数据共有部分类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 分类数据类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
// 分类接口返回数据类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值
// 属性值对象数据类型--安卓手机
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
// 存储属性值对象的数组数据类型--attrValueList
export type AttrValueList = AttrValue[]
// 属性对象--手机系统
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
// 存储属性对象的数组--data
export type AttrList = Attr[]
// 属性接口返回数据类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
