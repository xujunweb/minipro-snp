//index.js
//获取应用实例
import webim from '../../../utils/webim_wx.js'
import webimhandler from '../../../utils/webim_handler.js'
var tls = require('../../../utils/tls.js');
// global.webim = webim;
// var Config = {
//   sdkappid: 1400181648,
//   accountType: 36862,
//   accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
// };

// tls.init({
//   sdkappid: Config.sdkappid
// })
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    msgs: [],
    Identifier: null,
    UserSig: null,
    msgContent: "",
    getPageC2CHistroyMsgInfo:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  clearInput: function() {
    this.setData({
      msgContent: ""
    })
  },

  bindConfirm: function(e) {
    var that = this;
    var content = e.detail.value;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function(msg) {
      that.clearInput();
      that.receiveMsgs(msg)
    })
  },

  bindTap: function() {
    webimhandler.sendGroupLoveMsg();
  },

  login: function(cb) {
    var that = this;
    tls.login({
      success: function(data) {
        that.setData({
          Identifier: data.Identifier,
          UserSig: data.UserSig
        })
        cb();
      }
    });
  },


  receiveMsgs: function(data) {
    if(!data)return
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    if (msgs.length > 10) {
      msgs.splice(0, msgs.length - 10)
    }

    this.setData({
      msgs: msgs
    })
  },

  initIM: function(userInfo) {
    var that = this;
  },
  //获取单聊历史记录
  getC2CHistoryMsgs:function(){
    webimhandler.getC2CHistoryMsgs(this.data.getPageC2CHistroyMsgInfo,(msgs,resp)=>{
      console.log('聊天记录------',msgs)
      this.data.getPageC2CHistroyMsgInfo = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
        'LastMsgTime': resp.LastMsgTime,
        'MsgKey': resp.MsgKey
      };
      for(let i = 0,msg;msg=msgs[i];i++){
        this.receiveMsgs(webimhandler.showMsg(msg))
      }
    },(err)=>{
      console.log(err)
    })
  },
  onShow:function(){
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
  },
  onLoad: function(ops) {
    if (ops.roomId) {
      webimhandler.init({
        avChatRoomId: ops.roomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom)
        selType: ops.type === 'C2C' ? webim.SESSION_TYPE.C2C : webim.SESSION_TYPE.GROUP,
        selToID: ops.roomId,
        selSess: null //当前聊天会话
      });
    }
    setTimeout(()=>{
      this.getC2CHistoryMsgs()
    },0)
  }
})