import ajax from '../utils/ajax.js'

//发布文章or视频
export const insertArticle = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/insert',
    data: { status:'0',...data },
    method: 'post',
  })
}
//根据id获取文章详情
export const getByArticleId = (data)=>{
  return ajax({
    url: wx.envConfig.host + 'article/getByArticleId',
    data: { ...data, status:'' },
    method: 'post',
  })
}
//文章列表查询
export const pageByArticle = (data) => {
  let app = getApp()
  return ajax({
    url: wx.envConfig.host + 'article/pageByArticle',
    data: {
      state: '0', 
      status: '', 
      article_type:'0',
      ...data
    },
    method: 'post',
    loading:true,
  })
}
//热搜文章
export const hotSearch = (data) => {
  let app = getApp()
  return ajax({
    url: wx.envConfig.host + 'article/hotSearch',
    data: {
      state: '0',
      status: '',
      // article_type: '0',
      ...data
    },
    method: 'post',
    loading: true,
  })
}
//文章点赞
export const articleLike = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/like',
    data: { ...data },
    method: 'post',
  })
}
//查询我的点赞
export const pageByArticleInLike = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/pageByArticleInLike',
    data: { state: '0', status:'0',...data },
    method: 'post',
  })
}
//修改文章信息
export const updateArticle = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/update',
    data: { ...data },
    method: 'post',
  })
}
//发表评论
export const addComment = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/comment',
    data: { ...data },
    method: 'post',
    loading:true,
  })
}
//查询文章评论列表
export const pageByArticleComment = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/pageByArticleComment',
    data: { state:'0',...data },
    method: 'post',
  })
}
//删除评论
export const delComment = (data) => {
  return ajax({
    url: wx.envConfig.host + 'article/delComment',
    data: { ...data },
    method: 'post',
  })
}


