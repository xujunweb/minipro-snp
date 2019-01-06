// pages/subject/bodies/bodies.js
import { pageByInstitute } from '../../../api/bodies.js'
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
    this.pageByArticle(true)
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
    pageByInstitute({
      pageNum: this.data.thisp,
      pageSize: 10,
      login_user_id: app.globalData.userInfo.id,
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
      if (resf) {
        this.setData({
          articlelist: [...res.data.list]
        })
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          articlelist: [...this.data.articlelist, ...res.data.list]
        })
      }
    })
  },
  jumpNextPage: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/detail/bodies/bodies?id=' + e.currentTarget.dataset.item.id
    });
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
  // onShareAppMessage: function () {

  // }
})