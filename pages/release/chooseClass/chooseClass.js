// pages/release/chooseClass/chooseClass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var classMap = []
    for (let i in app.globalData.classMap) {
      classMap[i] = { id: i, classifyName: app.globalData.classMap[i] }
    }
    this.setData({
      classifyList: [
        ...classMap
      ]
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  choose: function (e) {
    let index = e.currentTarget.dataset.index,
      data = this.data.classifyList[index],
      pages = getCurrentPages(),
      prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      category: data.id
    });
    wx.navigateBack();

  },
})