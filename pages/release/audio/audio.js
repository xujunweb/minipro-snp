// pages/release/audio/audio.js
/** 发布音频 */
import { uploadFile } from '../../../api/upload.js'
import { insertArticle } from '../../../api/article.js'
var app = getApp();
let recorderManager = null
let innerAudioContext = null
Page({
  data: {
    audioUrl: '', //本地音频
    postvideoUrl: '', //上传的视频
    usedDisabled: false, //禁止发布
    title: '', //标题
    width: '', //视频宽
    height: '',  //视频高
    article_type: '0',  //文章类型
    category: '',  //文章分类
    mapType: {
      0: '资讯',
    },
    classMap: {},
    record:false, //录音状态
  },
  onLoad: function (op) {
    this.setData({
      classMap: app.globalData.classMap,
      article_type: op.artype,
      category: op.category || ''
    })
    recorderManager = wx.getRecorderManager()
    //监听录音开始
    recorderManager.onStart(() => {
      console.log('recorder start')
      this.setData({
        record: true
      })
    })
    //监听录音结束
    recorderManager.onStop((res) => {
      console.log('结束录音', res)
      const { tempFilePath } = res
      this.setData({
        audioUrl: tempFilePath,
        record: false
      })
      this.taBlurImgList()
      // innerAudioContext = wx.createInnerAudioContext()
      // innerAudioContext.src = tempFilePath
    })
  },
  onUnload:function(){
    innerAudioContext.destroy()
    recorderManager = null
  },
  onShow: function (e) {
    
  },
  //录制音频
  startRecord:function(){
    recorderManager.start({
      duration:600000,
      // audioSource:'auto',
    })
  },
  //结束录制
  endRecord:function(){
    recorderManager.stop()
  },
  //删除音频
  deleteImg: function (e) {
    this.setData({
      audioUrl: ''
    })
  },
  //发布
  quicklyPublish: function (e) {
    app.isAuthorize().then((data) => {
      if (!data) {
        //发布显示授权弹窗的事件
        wx.eventBus.trigger('showOnAuthShow')
      } else {
        if (!this.data.title) {
          return wx.showToast({
            title: '请输入标题'
          })
        }
        if (!this.data.audioUrl) {
          return wx.showToast({
            title: '请录制音频'
          })
        }
        wx.showLoading({
          title: '发布中...',
          mask: true,
        })
        //文件上传
        uploadFile({
          url: 'file/uploadVideo',
          filePath: this.data.audioUrl,
          name: 'file',
        }).then((res) => {
          if (typeof res.data === 'string'){
            var data = JSON.parse(res.data)
          }else{
            var data = res.data
          }
          this.continuePublish(data.data[0]);
        })
      }
    })
  },
  //调用发布接口
  continuePublish: function (url) {
    let data = {
      title: this.data.title,
      type: '2',
      img_urls: url.url,
      cover_urls: url.cover_url,
      category: this.data.category,
      article_type: this.data.article_type
    }
    insertArticle(data).then((res) => {
      console.log(res)
      wx.hideLoading()
      if (res.code === 100) {
        wx.showToast({
          title: '发布成功,待审核',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/audiolist/audiolist',
          })
        }, 2000)
      }
    })
  },
  //判断文本框和图片列表
  taBlurImgList: function () {
    const { title, audioUrl, category } = this.data;
    if (!title || !audioUrl || !category) {
      //禁止发布
      this.setData({ usedDisabled: false });
    } else {
      this.setData({ usedDisabled: true });
    }
  },
  //打开协议
  openAgreement: function () {
    wx.navigateTo({
      url: '/subPackage/message/pages/agreement/agreement'
    })
  },
  //textarea失去焦点
  bindTextAreablur: function (e) {
    this.taBlurImgList()
  },
  //获取标题
  getTitle: function (e) {
    this.setData({ title: e.detail.value });
  },
  //选择类型
  chooseType: function () {
    var typeArry = []
    for (let i in this.data.mapType) {
      typeArry[i] = this.data.mapType[i]
    }
    wx.showActionSheet({
      itemList: typeArry,
      success: (res) => {
        console.log(res)
        this.setData({
          article_type: '' + res.tapIndex
        })
        this.taBlurImgList()
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  //选择分类
  chooseClass: function () {
    // var typeArry = []
    // for (let i in this.data.classMap) {
    //   typeArry[i] = this.data.classMap[i]
    // }
    // wx.showActionSheet({
    //   itemList: typeArry,
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       category: '' + res.tapIndex
    //     })
    //     this.taBlurImgList()
    //   },
    //   fail: (err) => {
    //     console.log(err)
    //   }
    // })
    wx.navigateTo({
      url: '/pages/release/chooseClass/chooseClass'
    })
  },
});