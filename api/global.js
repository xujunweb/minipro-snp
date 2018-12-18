import ajax from '../utils/ajax.js'

//获取openid
export const getOpenId = (data)=>{
  return ajax({
    url: wx.envConfig.host + 'pay/wx/getWeixinUserInfo',
    data: {...data},
    method: 'post',
    // header: { ticket: app.globalData.userInfo.id || wx.getStorageSync('loginUserInfo').id}
  })
}