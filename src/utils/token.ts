// 封装本地存储与读取数据方法
// 存储
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
// 获取
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
// 删除
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
