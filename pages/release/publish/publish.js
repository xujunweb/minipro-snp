// pages/release/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  jumpPublishImageText: function () {
    console.log('跳转-----')
    wx.navigateTo({
      url: '/pages/release/aticle/aticle'
    })
  },

  jumpPublishArticleVideo: function () {
    wx.navigateTo({
      url: '/pages/release/video/video'
    })
  },

  closePublishPage: function () {
    wx.navigateBack();
  }

})