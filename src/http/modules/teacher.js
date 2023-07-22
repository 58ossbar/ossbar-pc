import axios from '../axios'

// 根据id获取布道师的列表页
export const findData = params => {
  return axios({
    url: 'teacher-api/list',
    method: 'get',
    params
  })
}

