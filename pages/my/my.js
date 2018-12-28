// pages/my/my.js
import { listByUserSignIn, signIn} from '../../api/user.js'
import { GetTime} from '../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signInTime:'',//签到日期
    isSignIn:false, //当前是否签到
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
    this.data.signInTime = GetTime(new Date().getTime(), 'Y-M-D')
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
        if(res.data && res.data.length){
          this.setData({
            isSignIn:true
          })
        }
      })
    })
  },
  //签到
  signIn:function(){
    if (this.data.isSignIn){
      wx.showToast({
        title: '已经签过到了',
        icon:'none'
      })
      return
    }
    signIn({
      user_id: app.globalData.userInfo.id
    }).then((res)=>{
      wx.showToast({
        title: '签到成功',
      })
      this.data.signInTime = GetTime(new Date().getTime(), 'Y-M-D')
      var time = {}
      time[this.data.signInTime] = true
      wx.setStorageSync('signIn', {
        ...wx.getStorageSync('signIn'),
        ...time,
      })
      //更新用户信息
      app.updataUser()
      console.log(res)
    })
  },
  /**
   * 我的发布
   */
  myPublic: function () {
    var that = this;
    // app.getNewOpenId((openId) => {
    //   // 需要用户授权，显示授权弹框
    //   if (app.globalData.showGetUserInfoAlert) {
    //     let timestamp = new Date().getTime();
    //     that.setData({ onAuthShow: timestamp });
    //   }
    // })
    wx.navigateTo({
      url: '/pages/my/release/release'
    });

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