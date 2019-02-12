// pages/chatIM/chatList/chatList.js
import webim from '../../../utils/webim_wx.js'
import webimhandler from '../../../utils/webim_handler.js'
import { iconNoMessage} from '../../../utils/imageBase64.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latestNotification:[],
    chatList:[],
    iconNoMessage: iconNoMessage,
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
    //监听群消息
    wx.eventBus.on('onBigGroupMsgNotify', (msg) => {
      webimhandler.onBigGroupMsgNotify(msg, (msgs) => {
        this.receiveMsgs(msgs);
      })
    })
    //监听私聊
    wx.eventBus.on('onMsgNotify', (msg) => {
      webimhandler.onMsgNotify(msg, (msg) => {
        console.log('新的私聊消息-----', msg)
        this.receiveMsgs([msg]);
      })
    })
    setTimeout(()=>{
      this.getChatList()
    },3000)
  },
  //获取会话列表
  getChatList:function(){
    console.log('所有回话', webim.MsgStore.sessMap())
    webimhandler.getRecentContactList(100,(res)=>{
      console.log('最近联系人------',res)
      this.setData({
        chatList: res
      })
    });
  },
  //进入聊天页面
  switchToChating:function(e){
    console.log(e)
    var info = e.currentTarget.dataset.session
    wx.navigateTo({
      url: `/pages/chatIM/chat/chat?roomId=${info.SessionId}&type=${info.SessionType}`,
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