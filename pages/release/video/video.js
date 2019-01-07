/** 发布图文 */
import { uploadFile } from '../../../api/upload.js'
import { insertArticle } from '../../../api/article.js'
var app = getApp();
Page({
  data: {
    videoUrl: '', //本地视频
    postvideoUrl: '', //上传的视频
    usedDisabled: false, //禁止发布
    title: '', //标题
    width:'', //视频宽
    height:'',  //视频高
    article_type: '',  //文章类型
    category: '',  //文章分类
    mapType: {
      0: '资讯',
      1: '朋友圈'
    },
    classMap: {}
  },
  onLoad: function (op) {
    this.setData({
      classMap: app.globalData.classMap,
      article_type: op.artype,
      category: op.category || ''
    })
    if (op.artype == '1') {
      this.data.category = '0'
    }
  },
  onShow: function (e) {
  },
  //选择视频
  getImage: function () {
    if (this.data.videoUrl) {
      wx.showToast({
        title: '最多选择1个',
        icon: 'none'
      })
      return
    }
    wx.chooseVideo({
      compressed:true,  //是否压缩视频
      maxDuration:15, //拍摄视频的最大秒数
      success: (res) => {
        console.log('视频秒数---------',res.duration)
        console.log('视频信息',res)
        if (res.duration>15){
          wx.showToast({
            title: '视频过大',
            icon: 'none'
          })
          return
        }
        this.setData({
          videoUrl: res.tempFilePath,
          width: res.width,
          height: res.height,
        })
        this.taBlurImgList()
      }
    })
  },
  //删除视频
  deleteImg: function (e) {
    this.setData({
      videoUrl: ''
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
        if (!this.data.videoUrl) {
          return wx.showToast({
            title: '请上传视频'
          })
        }
        wx.showLoading({
          title: '发布中...',
          mask:true,
        })
        //文件上传
        uploadFile({
          url:'file/uploadVideo',
          filePath: this.data.videoUrl,
          name: 'file',
        }).then((res) => {
          var data = JSON.parse(res.data)
          this.continuePublish(data.data[0]);
        })
      }
    })
  },
  //调用发布接口
  continuePublish: function (url) {
    let data = {
      title: this.data.title,
      type: '1',
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
          if (this.data.article_type == '1'){
            wx.switchTab({
              url: '/pages/friends/friends'
            })
          }else{
            wx.switchTab({
              url: '/pages/newvideo/newvideo'
            })
          }
          
        }, 2000)
      }
    })
  },
  //判断文本框和图片列表
  taBlurImgList: function () {
    const { title, videoUrl,category, article_type } = this.data;
    if ((!title || this.data.article_type != '1') || !videoUrl || !category || !article_type) {
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