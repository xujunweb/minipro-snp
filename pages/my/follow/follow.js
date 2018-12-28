// pages/my/follow/follow.js
import { pageByFollow} from '../../../api/user.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisp: 1,  //当前页
    lastPage: 1, //总共页数
    noMore: false, //没有更多数据了
    total:0,  //总关注数
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
    this.pageByFollow(true)
  },
  //获取关注用户
  pageByFollow:function(resf){
    pageByFollow({
      pageNum: this.data.thisp,
      pageSize: 20,
      follow_user_id: app.globalData.userInfo.id,
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
      this.data.total = res.data.total
      if (resf) {
        this.setData({
          articlelist: [...res.data.list],
          total: res.data.total
        })
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          articlelist: [...this.data.articlelist, ...res.data.list]
        })
      }
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.thisp += 1
    this.pageByFollow()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})