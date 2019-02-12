import ajax from '../utils/ajax.js'
//获取腾讯云UserSig
export const getUserSig = (data) => {
  return ajax({
    url: wx.envConfig.host + 'user/getUserSig',
    data:{...data},
    method: 'post',
  })
}