//app.js
import { getOpenId, getNewUserInfo, userUpdate } from './api/global.js'
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
    wx.eventBus.on('updataUser', (userInfo) => {
      that.setData({
        userInfo: userInfo
      })
    })
  },
  unLoad: function () {
  },
  onShow: function (that,app) {
    
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
    wx.eventBus = eventBus  //将发布订阅模式挂载到wx.eventBus上
    //环境配置
    wx.envConfig = env[env.mode]
    //登录
    this.getOpenId()
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    isCouldAuth: 0,//用户是否点击了允许授权 0:首次进入;1:点击了允许;2:点击了拒绝
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
            console.log('微信登录信息openid---',res)
            this.globalData.openid = res.data.openid
            this.globalData.userInfo = { ...res.data}
            wx.eventBus.trigger('updataUser', { ...res.data })
            resolve(res)
          }).catch((res)=>{
            reject(res)
          })
        }
      })
    })
  },
  /**
   * 根据获取用户信息
   * @local 是否优先获取本地的用户信息
   *
  */
  getUserInfo: function (local){
    return new Promise((resolve, reject) => {
      if (local && this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
        return
      }
      getNewUserInfo().then((res)=>{
        resolve(res.data)
      }).catch((err)=>{
        reject(err)
      })
    })
    
  },
  /**
   * 判断用户是否授权了昵称和头像
   * @isCouldAuth 用户点击了拒绝就不再弹窗(每次进入页面时)
  */
  isAuthorize: function (isCouldAuth){
    return new Promise((resolve, reject) => {
      this.getOpenId().then(() => {
        if (isCouldAuth && this.globalData.isCouldAuth == 2) {
          resolve(true)
        }
        if (!this.globalData.userInfo || !this.globalData.userInfo.nickname) {
          resolve(false)
        }
        resolve(true)
      }).catch((err)=>{
        reject(err)
      })
    })
  },
  /**
   * 更新用户信息
   *
  */
  updataUser:function(data){
    return userUpdate({
      user_id: this.globalData.userInfo.id,
      ...data
    }).then((res)=>{
      wx.eventBus.trigger('updataUser', { ...data })
    })
  },
})