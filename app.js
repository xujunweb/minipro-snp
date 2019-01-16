//app.js
import { getOpenId, getNewUserInfo, userUpdate } from './api/global.js'
import { pageByFollow } from './api/user.js'
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
  onShow: function (that,app) {
    if(app.globalData.userInfo){
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }
    that.setData({
      userMap: app.globalData.userMap
    })
    wx.eventBus.on('updataUser', (userInfo) => {
      that.setData({
        userInfo: userInfo
      })
    })
    wx.eventBus.on('showOnAuthShow', () => {
      that.showOnAuthShow()
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  },
  onHide: function (that) {
  },
  onPullDownRefresh: function () {
    
  },
  methods: {//全局每个页面添加其他的方法
    //显示授权弹窗
    showOnAuthShow: function () {
      console.log('全局每个页面添加其他的方法', this);
      let timestamp = new Date().getTime()
      this.setData({ onAuthShow: timestamp})
    }
  },
});
App({
  onLaunch: function () {
    // 展示本地存储能力
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
    this.globalData.bigClass = {}
    this.globalData.litClass = {}
    for (let i = 0, bigClass; bigClass = this.globalData.instClass[i];i++){
      this.globalData.bigClass[bigClass.key] = bigClass.name
      for(let k = 0,litClass;litClass = bigClass.child[k];k++){
        this.globalData.litClass[litClass.key] = litClass.name
      }
    }
  },
  globalData: {
    userInfo: null,
    isCouldAuth: 0,//用户是否点击了允许授权 0:首次进入;1:点击了允许;2:点击了拒绝
    classMap: {
      0: '学生',
      1: '老师',
      2: '家长',
      3: '教育',
      4: '动漫',
      5: '培训',
      6:'科技',
      7:'国风',
      8:'电影',
      9:'时尚',
      10:'搞笑',
      11:'图片',
      12:'体育',
      13:'美食',
      14:'数码',
      15:'旅游',
      16:'三农',
      17:'科学',
      18:'星座',
      19:'生活',
      20:'公益',
      21:'摄影',
      22:'校园',
      23:'法律',
      24:'读书',
      25:'艺术',
      26:'NBA',
      27:'财经',
      28:'综艺',
      29:'节日'
    },
    instClass:[
      {key:'0',name:'综合',child:[
        { key: '01', name:'小提琴'},
        { key: '02', name: '吉他' },
        { key: '03', name: '优克里里' },
        { key: '04', name: '非洲鼓' },
        { key: '05', name: '视唱练耳' },
        { key: '06', name: '跆拳道' },
        { key: '07', name: '国际象棋' },
        { key: '08', name: '珠心算' },
        { key: '09', name: '少儿情商班' },
        { key: '010', name: '自然发音' },
        { key: '011', name: '玩乐英语' },
      ]},
      { key: '1', name:'舞蹈',child:[
        { key: '11', name: '中国舞' },
        { key: '12', name: '芭蕾舞' },
        { key: '13', name: '爵士舞' },
        { key: '14', name: '拉丁舞' },
        { key: '15', name: '街舞' },
      ]},
      {
        key: '2', name: '美术', child: [
          { key: '21', name: '山水' },
          { key: '22', name: '花鸟' },
          { key: '23', name: '毛笔班' },
          { key: '24', name: '素描' },
          { key: '25', name: '动漫' },
          { key: '26', name: '设计' },
          { key: '27', name: '创想' },
          { key: '28', name: '插画' },
          { key: '29', name: '书画' },
          { key: '210', name: '基础' },
          { key: '211', name: '提高' },
          { key: '212', name: '大师班' },
        ]
      },
      {
        key: '3', name: '科技', child: [
          { key: '31', name: '机器人' },
          { key: '32', name: '小小发明家' },
          { key: '33', name: '小小建筑师' },
          { key: '34', name: '创意生活班' },
          { key: '35', name: '趣味科学' },
          { key: '36', name: '机械结构' },
          { key: '37', name: '机械奥秘' },
          { key: '38', name: '机械达人' },
          { key: '39', name: '科技工程师' },
          { key: '310', name: '动力大师' },
        ]
      },
      {
        key: '4', name: '影视', child: [
          { key: '41', name: '影视剧表演' },
          { key: '42', name: '播音主持' },
        ]
      },
      {
        key: '5', name: '钢琴', child: [
          { key: '51', name: '启蒙2级' },
          { key: '52', name: '中级3-4级' },
          { key: '53', name: '中级5-6级' },
          { key: '54', name: '高级7-8级' },
          { key: '55', name: '高级9-10级' },
        ]
      },
      {
        key: '6', name: '语言', child: [
          { key: '61', name: '语言表演' },
          { key: '62', name: '声优主持' },
          { key: '63', name: '形体表演' },
          { key: '64', name: '童声表演' },
        ]
      },
    ],
    userMap:{
      0:'教师',
      1:'家长',
      2:'学生',
      3:'头条用户'
    },
  },
  //获取openid
  getOpenId: function (data) {
    return new Promise((resolve, reject)=>{
      if(this.globalData.userInfo){
        resolve(this.globalData.userInfo)
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
            resolve(res.data)
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
          return
        }
        if (!this.globalData.userInfo || !this.globalData.userInfo.nickname) {
          resolve(false)
          return
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
      this.getUserInfo().then((res)=>{
        wx.eventBus.trigger('updataUser', { ...res })
      })
    })
  },
  /**
   * 当前登录人关注了哪些用户
   * @strorage  是否优先使用本地缓存(默认优先)
   */
  pageByFollow:function(strorage){
    return new Promise((resolve, reject) => {
      this.getOpenId().then((userInfo)=>{
        if (!strorage && wx.getStorageSync('followUser')) {
          resolve()
          return
        }
        pageByFollow({
          pageNum: 1,
          pageSize: 1000,
          follow_user_id: userInfo.id,
        }).then((res) => {
          var followMap = {}
          for (let i = 0, user; user = res.data.list[i]; i++) {
            followMap[user.user_id] = user
          }
          wx.setStorageSync('followUser', followMap)
          resolve()
        })
      })
    })
  },
})