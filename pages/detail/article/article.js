// pages/detail/article/article.js
import { updateArticle, getByArticleId} from '../../../api/article.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",  //文章id
    artInfo:null, //文章信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id:options.id
      })
      this.getByArticleId(options.id)
    }
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

  //获取文章信息
  getByArticleId:function(id){
    getByArticleId({
      status:'0',
      id: id,
    }).then((res)=>{
      res.data.img_urls = res.data.img_urls.split(',')
      this.setData({
        artInfo:res.data
      })
    })
  },
  //跳转到指定评论位置
  scollCommnet: function (e) {
    var query = wx.createSelectorQuery(),
      id = e.detail == 'top' ? 'discussTop' : 'discussBottom';
    query.select(`#${id}`).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].top + res[1].scrollTop,
        duration: 0
      })
    });
  },
  /**
   * 预览图片 （新闻）
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.artInfo.img_urls, // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})