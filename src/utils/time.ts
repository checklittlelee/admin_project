// 问候语 时间函数
export const getTime = () => {
  let message = ''
  const hours = new Date().getHours()
  if (hours < 9 && hours >= 4) {
    message = '早上好'
  } else if (hours >= 9 && hours < 12) {
    message = '上午好'
  } else if (hours < 18) {
    message = '下午好'
  } else {
    message = '晚上好'
  }
  return message
}
