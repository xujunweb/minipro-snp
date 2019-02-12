import ajax from '../utils/ajax.js'
import { handleArryToObject} from '../utils/util.js'
//关注用户
export const followUser = (data,user) => {
  console.log(user)
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
    var IMgetUserinfo = {
      "To_Account": [user.ticket],
      "TagList":
        [
          "Tag_Profile_IM_Nick",
          "Tag_Profile_IM_Image",
          "Tag_Profile_IM_AllowType",
          "Tag_Profile_IM_MsgSettings",
          "Tag_Profile_IM_AdminForbidType",
        ]
    }
    global.webim.getProfilePortrait(IMgetUserinfo, (res) => {
      console.log('关注用户的IM信息----', res)
      //设置IM相关用户缓存
      wx.setStorageSync('IMUserInfoMap', {
        ...wx.getStorageSync('IMUserInfoMap'),
        ...handleArryToObject(res.UserProfileItem)
      })
    }, (err) => {
      console.log('用户信息获取失败---', err)
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