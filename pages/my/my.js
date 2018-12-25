// pages/my/my.js
import { listByUserSignIn, signIn} from '../../api/user.js'
import { GetTime} from '../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    this.listByUserSignIn()
  },
  //获取用户今天是否签到
  listByUserSignIn:function(){
    app.getOpenId().then((userInfo)=>{
      listByUserSignIn({
        user_id: userInfo.id,
        day_date: GetTime(new Date().getTime(), 'Y-M-D'),
      }).then((res) => {
        console.log(res)
      })
    })
    
  },
  //签到
  signIn:function(){
    signIn({
      user_id: app.globalData.userInfo.id
    }).then((res)=>{
      wx.showToast({
        title: '签到成功',
      })
      console.log(res)
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

  },
})