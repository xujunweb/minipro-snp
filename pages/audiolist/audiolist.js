// pages/audiolist/audiolist.js
import { pageByArticle, articleLike } from '../../api/article.js'
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
    classMap: [],
    selectClass: 99, //默认选中的分类
    hotList: [], //热搜列表
    seachText: '',
    isSeach: false,
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
    //先获取该用户关注了哪些用户
    app.pageByFollow().then(() => {
      this.pageByArticle(true)
    })
    var classMap = []
    for (let i in app.globalData.classMap) {
      classMap[i] = { id: i, text: app.globalData.classMap[i] }
    }
    this.setData({
      classMap: [
        ...[{ id: 99, text: '推荐' }, { id: 98, text: '关注' }],
        // ...[{id:99,text:'全部'}],
        ...classMap
      ]
    })
  },
  inputText: function (e) {
    this.setData({
      seachText: e.detail.value
    })
  },
  seachList: function () {
    this.data.thisp = 1
    this.pageByArticle(true)
  },
  onPageScroll(e) {
  
  },
  //切换分类
  ClickTab: function (e) {
    var id = e.currentTarget.dataset.id
    this.data.selectClass = id
    this.data.thisp = 1
    this.setData({
      selectClass: id
    })
    this.pageByArticle(true)
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
    var category = this.data.selectClass
    if (this.data.selectClass == 99 || this.data.selectClass == 98) {
      category = ''
    }
    var followUserArry = []
    if (this.data.selectClass == 98) { //关注
      var followUser = wx.getStorageSync('followUser')
      followUserArry = [app.globalData.userInfo.id]
      for (let key in followUser) {
        followUserArry.push(key)
      }
    }
    //获取本地的关注用户
    pageByArticle({
      pageNum: this.data.thisp,
      pageSize: 8,
      type: '2',
      login_user_id: app.globalData.userInfo.id,
      category: category,
      article_type: '0',
      insert_authors: followUserArry.join(','),    //关注的用户组
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
      if (resf) {
        this.setData({
          articlelist: [...res.data.list],
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
  // onShareAppMessage: function (e) {
  //   console.log(e)
  //   if (e.from === 'button') {
  //     return {
  //       title: e.target.dataset.item.title,
  //       imageUrl: e.target.dataset.item.cover_urls,
  //       path: '/pages/detail/article/article?id=' + e.target.dataset.item.id
  //     }
  //   }
  // }
})