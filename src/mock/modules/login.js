// 登录接口
export function login() {
  return {
    // isOpen: false,
    url: 'http://localhost:8888/login',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        'token': 'admin'
        // 其他数据
      }
    }
  }
}
