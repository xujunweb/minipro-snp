// pages/detail/bodies/bodies.js
import { getByInstitute } from '../../../api/bodies.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",  //文章id
    artInfo: null, //文章信息
    isfollow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
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
  getByArticleId: function (id) {
    getByInstitute({
      status: '0',
      id: id,
    }).then((res) => {
      if (res.data.img_urls){
        res.data.img_urls = res.data.img_urls.split(',')
      }
      this.data.artInfo = res.data
      this.setData({
        artInfo: res.data
      })
    })
  },
  //拨打电话
  makePhone: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
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
  // onShareAppMessage: function () {

  // }
})