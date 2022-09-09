
import { baseUrl } from '@/utils/global'

/**
 * 处理图片地址
 * @param {*} str
 * @returns 示例结果：
 * http://thirdqq.qlogo.cn/g?b=oidb&k=Rhqd4feUicVicFSp07uO637g&s=40&t=1557039707
 * https://frp.creatorblue.com/console/uploads/teacher-img/67fcfbaea3d4476187e2e4279cea5e24.jpeg
 */
export function handleImagePath(str) {
  if (!str) {
    return str
  }
  // 如果是网络头像，不需要额外拼接
  if (str.indexOf('https') !== -1 || str.indexOf('http') !== -1) {
    return str
  }
  // 去掉中间多余的斜杠
  if (baseUrl) {
    // 如果最后一位有斜杠
    const v = baseUrl.substring(baseUrl.length - 1, baseUrl.length)
    if (v && v === '/') {
      // 如果传入的值，第一个也是斜杠
      const s = str.substring(0, 1)
      if (s && s === '/') {
        str = str.substring(1)
      }
    }
  }
  return baseUrl + str
}
