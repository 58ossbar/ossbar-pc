import axios from '@/http/axios'

/**
 * 批量保存章节
 * @param {*} data
 * @returns
 */
export const batchSaveChapter = data => {
  return axios({
    url: '/subject-api/batchSaveChapter',
    method: 'post',
    data
  })
}
