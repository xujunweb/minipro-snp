// pages/videolist/videolist.js
import { pageByArticle } from '../../api/article.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articlelist: [], //文章列表
    thisp: 1,  //当前页
    lastPage: 1, //总共页数
    noMore: false, //没有更多数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideTabBar()
    
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
    //先获取该用户关注了哪些用户
    app.pageByFollow().then(() => {
      this.pageByArticle(true)
    })
  },
  //分页加载文章列表
  pageByArticle: function (resf) {
    if (this.data.thisp > this.data.lastPage && this.data.lastPage != 0) {
      this.setData({
        noMore: true
      })
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
      return
    }
    pageByArticle({
      pageNum: this.data.thisp,
      pageSize: 1,
      type: '1',
      login_user_id: app.globalData.userInfo.id,
      article_type: '0',
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
        this.setData({
          articlelist: [...res.data.list]
        })
      if (resf) wx.stopPullDownRefresh()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.articlelist = []
    this.data.thisp = 1
    this.pageByArticle(true)
  },
  //下一个视频
  nextVideo:function(){
    this.data.thisp += 1
    this.pageByArticle()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.thisp += 1
    this.pageByArticle()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    if (e.from === 'button') {
      return {
        title: e.target.dataset.item.title,
        imageUrl: e.target.dataset.item.cover_urls,
        path: '/pages/detail/video/video?id=' + e.target.dataset.item.id
      }
    }
  }
})