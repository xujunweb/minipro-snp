/** 发布图文 */
import {uploadFile} from '../../../api/upload.js'
import { insertArticle } from '../../../api/article.js'
var app = getApp();
Page({
  data: {
    imgList:[], //本地图片
    postImgList: [], //上传的图片
    checkCodeDisabled: true, //验证按钮的禁用状态（true禁用，false启用）
    uploadDisabled: false,  //图片上传禁用启用
    imgUrlsz: [],
    content: "", //输入框的内容
    usedDisabled: false, //禁止发布
    textareaNum: 0,  //文本框字的个数
    article: '',
    nickName:'',  //用户昵称
    shareFree: 1,   //是否已转发标识  1：否，2：是
    isOpen: 1,   //支付开通状态  1:不开通，2：开通
    title:'', //标题
  },
  onLoad: function (e) {
  },
  onShow: function (e) {
  },
  //选择相片
  getImage: function () {
    if (this.data.imgList.length == 9) {
      wx.showToast({
        title: '最多选择9张图片',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 9 - this.data.imgList.length,
      success: (res) => {
        this.setData({
          imgList: [...this.data.imgList, ...res.tempFilePaths],
        })
      }
    })
  },
  //文件上传
  uploadFile: function (file) {
    return uploadFile({
      filePath: file,
      name: 'file',
    }).then((res)=>{
      var data = JSON.parse(res.data)
      this.data.postImgList = [...this.data.postImgList, ...[data.data[0].url]]
    })
  },
  //删除图片
  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.imgList.splice(index, 1)
    this.data.postImgList.splice(index, 1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  //发布
  quicklyPublish: function (e) {
    app.isAuthorize().then((data) => {
      if (!data) {
        //发布显示授权弹窗的事件
        wx.eventBus.trigger('showOnAuthShow')
      } else {
        if(!this.data.title){
          return wx.showToast({
            title: '请输入标题'
          })
        }
        if (!this.data.content){
          return wx.showToast({
            title: '请输入标题'
          })
        }
        this.continuePublish();
      }
    })
  },
  //调用发布接口
  continuePublish: function(){
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    var pro = []
    for (let i = 0, img; img = this.data.imgList[i]; i++) {
      pro.push(this.uploadFile(img))
    }
    Promise.all(pro).then(() => {
      let data = {
        title: this.data.title,
        type: '0',
        content: this.data.content,
        img_urls: this.data.postImgList.join(','),
        cover_urls: this.data.postImgList[0]
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
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 2000)
        }
      })
    }) 
  },
  /*
  *文本框输入
  */
  bindTextAreaFocus: function (e) {
    var textareavalue = e.detail.value.trim();
    //大于0
    if (textareavalue.length > 0) {
      this.data.usedDisabled = true;
      this.data.textareaNum = textareavalue.length;
      this.data.content = textareavalue;
    } else if (textareavalue.length <= 0) {
      this.data.textareaNum = 0;
    }
    this.setData(this.data);
    this.taBlurImgList();
  },
  //textarea失去焦点
  bindTextAreablur: function (e) {
    this.taBlurImgList()
  },
  //判断文本框和图片列表
  taBlurImgList: function () {
    const {title, content} = this.data;
    if (!title || !content) {
      //禁止发布
      this.setData({ usedDisabled: false });
    }else{
      this.setData({ usedDisabled: true });
    }
  },
  //打开协议
  openAgreement: function () {
    wx.navigateTo({
        url: '/subPackage/message/pages/agreement/agreement'
    })
  },
  //获取标题
  getTitle: function (e) {
    this.setData({ title: e.detail.value });
  },
  clickSure:function(e){
      this.setData({
          showLimitCount:!that.data.showLimitCount,
          topSwitch:1
      })
  },
  //根据输入的字符串计算长度：中文长度为2，英文为1
  getLengthByText: function(text){
    var len = 0;
    for (var i in text){
      var codeIndex = text.charCodeAt(i);
      if (codeIndex >= 0 && codeIndex < 128){
        len += 1;
      }
      else{
        len += 2;
      }
    }
    return len;
  },
});