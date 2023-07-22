// 获取技术领域信息
export function findData() {
  return {
    url: 'http://localhost:8888/library',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': ['信息安全', '信息安全', '信息安全', '信息安全', '信息安全']
    }
  }
}

export function save(data) {
  return {
    url: 'http://localhost:8888/save/library',
    method: 'post',
    data: {
      'code': 0,
      'msg': null,
      'data': 1
    }
  }
}
