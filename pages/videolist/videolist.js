// pages/videolist/videolist.js
import { pageByArticle} from '../../api/article.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articlelist:[], //文章列表
    thisp:1,  //当前页
    lastPage:1, //总共页数
    noMore:false, //没有更多数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先获取该用户关注了哪些用户
    app.pageByFollow().then(() => {
      this.pageByArticle()
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
    this.pageByArticle()
  },
  //分页加载文章列表
  pageByArticle:function(resf){
    if (this.data.thisp > this.data.lastPage && this.data.lastPage != 0){
      this.setData({
        noMore:true
      })
      wx.showToast({
        title: '没有更多数据了',
        icon:'none'
      })
      return
    }
    pageByArticle({
      pageNum:this.data.thisp,
      pageSize:8,
      type:'1',
      login_user_id: app.globalData.userInfo.id,
      article_type: '0',
    }).then((res)=>{
      console.log(res)
      this.data.lastPage = res.data.lastPage
      this.setData({
        articlelist: [...this.data.articlelist, ...res.data.list]
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
  onShareAppMessage: function () {

  }
})