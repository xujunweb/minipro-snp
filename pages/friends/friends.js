// pages/friends/friends.js
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
    //获取本地的关注用户
    var followUser = wx.getStorageSync('followUser')
    var followUserArry = [app.globalData.userInfo.id]
    for (let key in followUser){
      followUserArry.push(key)
    }
    pageByArticle({
      pageNum: this.data.thisp,
      pageSize: 8,
      type: '',
      login_user_id: app.globalData.userInfo.id,
      article_type: '1',
      insert_authors: followUserArry.join(','),    //关注的用户组
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
      this.setData({
        articlelist: [...this.data.articlelist, ...res.data.list]
      })
      if (resf) wx.stopPullDownRefresh()
    })
  },
  //删除文章
  deleArticle(index){
    console.log('要删除的索引',index)
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

  },
})