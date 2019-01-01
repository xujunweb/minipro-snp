// pages/release/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    artype:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.artype = options.artype
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
      url: '/pages/release/aticle/aticle?artype=' + this.data.artype
    })
  },

  jumpPublishArticleVideo: function () {
    wx.navigateTo({
      url: '/pages/release/video/video?artype=' + this.data.artype
    })
  },

  closePublishPage: function () {
    wx.navigateBack();
  }

})