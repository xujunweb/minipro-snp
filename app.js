//app.js
import { getOpenId } from './api/global.js'
import { newPage, eventBus } from './utils/global-life-cycle.js'
import env from './utils/config.js'

newPage({//引入监听全局每个页面的生命周期
  onLoad: function (that, s) {
    var pageR = getCurrentPages();
    var routePath = pageR[(pageR.length - 1)].route;//当前路径
    var routePathPara = s;//当前路径的参数，是一个对象
    that.data.onAuthShow = ''
    that.data.onAuthHide = ''
    that.data.authParam = {}
  },
  unLoad: function () {
  },
  onShow: function (that) {
  },
  onHide: function (that) {
  },
  onPullDownRefresh: function () {
    
  },
  methods: {//全局每个页面添加其他的方法
    //显示授权弹窗
    showOnAuthShow: function () {
      console.log('全局每个页面添加其他的方法', this);
      let timestamp = new Date().getTime();
      this.setData({ onAuthShow: timestamp, authParam: { isCallBackHandle: true } });
    }
  },
});
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //环境配置
    wx.envConfig = env[env.mode]
    //登录
    this.getOpenId()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  //获取openid
  getOpenId: function (data) {
    return new Promise((resolve, reject)=>{
      if(this.globalData.openid){
        resolve(this.globalData.openid)
        return
      }
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log('wx.login---------', res)
          getOpenId({ code: res.code }).then((res) => {
            resolve(res)
          }).catch((res)=>{
            reject(res)
          })
        }
      })
    })
  },
})