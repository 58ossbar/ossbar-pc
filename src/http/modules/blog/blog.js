import axios from '../../axios'

// 根据id获取职业路径详情
export const writeBlogInfo = data => {
  return axios({
    url: '/site/forum/blog/writeBlogInfo',
    method: 'post',
    data
  })
}

// 查询博客列表信息
export const queryBlogList = params => {
  return axios({
    url: '/site/forum/blog/queryBlogList',
    method: 'get',
    params
  })
}

// 删除博客
export const deleteBlog = data => {
  return axios({
    url: '/site/forum/blog/deleteBlog',
    method: 'post',
    data
  })
}

// 获取热门标签
export const recommendedLabel = params => {
  return axios({
    url: '/site/forum/blog/recommendedLabel',
    method: 'get'
  })
}

// 获取热门博主
export const popularBloggers = params => {
  return axios({
    url: '/site/forum/blog/popularBloggers',
    method: 'get'
  })
}

// 获取友情社区数据
export const friendshipCommunity = params => {
  return axios({
    url: '/site/forum/blog/friendshipCommunity',
    method: 'get'
  })
}

// 获取博客内容
export const queryBlogDetails = params => {
  return axios({
    url: '/site/forum/blog/queryBlogDetails?postId=' + params,
    method: 'get'
  })
}

// 收藏博客
export const collect = data => {
  return axios({
    url: '/site/forum/blog/collect?postId=' + data,
    method: 'post'
  })
}

// 点赞博客
export const like = data => {
  return axios({
    url: '/site/forum/blog/like?postId=' + data,
    method: 'post'
  })
}

// 点赞博客
export const follow = data => {
  return axios({
    url: '/site/forum/fans/follow?traineeId=' + data,
    method: 'post'
  })
}

// 删除评论
export const deleteReply = data => {
  return axios({
    url: '/site/forum/comment/deleteReply?ciId=' + data.ciId + '&postId=' + data.postId,
    method: 'post'
  })
}

// 查询评论
export const queryBlogCommentList = data => {
  return axios({
    url: '/site/forum/comment/queryBlogCommentList',
    method: 'post',
    data
  })
}

// 发表评论
export const saveCommentInfo = data => {
  return axios({
    url: '/site/forum/comment/saveCommentInfo',
    method: 'post',
    data
  })
}

// 获取关注博主
export const queryMyFollowList = params => axios({ url: '/site/forum/fans/queryMyFollowList', method: 'get', params })

// 评论点赞与取消点赞
export const clickLike = data => axios({ url: '/site/forum/comment/clickLike/' + data, method: 'post' })

// 获取所有博客技术标签
export const getSubjectTypeList = () => axios({ url: '/site/forum/blog/getSubjectTypeList', method: 'get' })

// 上传背景图片
export const changeBackgroundImage = data => {
  return axios({
    url: '/site/forum/blog/changeBackgroundImage',
    method: 'post',
    data
  })
}

// 更换文字
export const updateInfo = data => {
  return axios({
    url: '/site/forum/blog/updateInfo',
    method: 'post',
    data
  })
}
