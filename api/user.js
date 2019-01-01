import ajax from '../utils/ajax.js'

//关注用户
export const followUser = (data,user) => {
  return ajax({
    url: wx.envConfig.host + 'user/follow',
    data: { ...data },
    method: 'post',
  }).then((res)=>{
    var obj = {}
    wx.showToast({
      title: '操作成功',
    })
    obj[data.user_id] = data.is_follow == 1?user:false
    wx.setStorageSync('followUser', {
      ...wx.getStorageSync('followUser'),
      ...obj
    })
    
  })
}

//查询关注用户(分页查询)
export const pageByFollow = (data) => {
  return ajax({
    url: wx.envConfig.host + 'user/pageByFollow',
    data: { ...data },
    method: 'post',
  })
}

//查询用户签到信息
export const listByUserSignIn = (data) => {
  return ajax({
    url: wx.envConfig.host + 'user/listByUserSignIn',
    data: { ...data },
    method: 'post',
  })
}
//用户签到
export const signIn = (data) => {
  return ajax({
    url: wx.envConfig.host + 'user/signIn',
    data: { ...data },
    method: 'post',
  })
}
//用户反馈
export const feedback = (data) => {
  return ajax({
    url: wx.envConfig.host + 'faultFeedback/save',
    data: { ...data },
    method: 'post',
  })
}