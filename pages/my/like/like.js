// pages/my/like/like.js
import { pageByArticleInLike, articleLike} from '../../../api/article.js'
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
    this.pageByArticle(true)
  },
  //请求点赞的文章
  pageByArticle: function (resf){
    pageByArticleInLike({
      pageNum: this.data.thisp,
      pageSize: 8,
      type: '0',
      login_user_id: app.globalData.userInfo.id,
      category: '',
      article_types: '0,2',
      like:1,
      like_user_id: app.globalData.userInfo.id,
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
  //取消点赞
  articleLike:function(e){
    wx.showModal({
      title:'提示',
      content:'是否确定取消收藏？',
      success:(res)=>{
        if (res.confirm) {
          var item = e.currentTarget.dataset.item
          var index = e.currentTarget.dataset.index
          articleLike({
            is_like: '0',
            article_id: item.id,
            user_id: app.globalData.userInfo.id
          }).then((res) => {
            //删除对应的索引
            this.data.articlelist.splice(index,1)
            this.setData({
              articlelist: [...this.data.articlelist]
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看点赞的详情
  jumpDe: function (e) {
    var item = e.currentTarget.dataset.item
    console.log(item)
    var url = ''
    switch (item.type) {
      case 0:
        if (item.article_type == 2) {
          url = '/pages/detail/subject/subject?id='
        } else {
          url = '/pages/detail/article/article?id='
        }
        break
      case 1:
        url = '/pages/detail/video/video?id='
        break
      default:
        break
    }
    wx.navigateTo({
      url: url + item.id
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})