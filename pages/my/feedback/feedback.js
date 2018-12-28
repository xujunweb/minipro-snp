// pages/my/feedback/feedback.js
import { feedback } from '../../../api/user.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedDisabled:false,
    content:''
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

  },
  //校验
  textIsOk:function(){
    if (this.data.content){
      this.setData({
        usedDisabled:true
      })
    }else{
      this.setData({
        usedDisabled: false
      })
    }
  },
  //输入事件
  bindTextAreaFocus:function(e){
    var textareavalue = e.detail.value.trim();
    this.data.content = textareavalue
    this.setData({
      content: textareavalue
    })
    this.textIsOk()
  },
  bindTextAreablur:function(){
    this.textIsOk()
  },
  //提交
  feedback:function(){
    feedback({
      desc:this.data.content
    }).then((res)=>{
      wx.showToast({
        title: '提交成功',
        mask:true,
        duration:2000
      })
      setTimeout(()=>{
        wx.navigateBack()
      },2000)
      
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
})