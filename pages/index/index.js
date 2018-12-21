//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  onPageScroll(e) {
    wx.createSelectorQuery().select('.container').boundingClientRect().exec((res) => {
      //res:该元素的信息 数组

      if (res && res[0]) {
        if (res[0].top <= 0 && !this.data.isFixed) {
          this.setData({
            isFixed: true
          })
        } else if (res[0].top > 0 && this.data.isFixed) {
          this.setData({
            isFixed: false
          })
        }
      }

    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
