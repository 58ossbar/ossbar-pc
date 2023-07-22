import axios from '../axios'

// 资源中心资源列表
export const queryResource = params => {
  return axios({
    url: 'resourceCenter-api/queryResource',
    methods: 'get',
    params
  })
}

// 资源中心目录节点树渲染
export const querySubject = params => {
  return axios({
    url: 'resourceCenter-api/querySubject?subjectId=' + params,
    methods: 'get'
  })
}

// 资源

// 分组
// export const getResourceGroup=params=>{
//     return axios({
//         url:'/dict-api/getResourceGroup',
//         methods:'get'
//     })
// }
