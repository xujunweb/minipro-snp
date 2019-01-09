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
    title:'', //标题
    article_type:'',  //文章类型
    category:'',  //文章分类
    mapType: {
      0: '资讯',
      1: '朋友圈',
      2: '题目'
    },
    classMap:{}
  },
  onLoad: function (op) {
    wx.setNavigationBarTitle({
      title: '发布'+this.data.mapType[op.artype]
    })
    this.setData({
      classMap: app.globalData.classMap,
      article_type: op.artype,
      category: op.category||''
    })
    if (op.artype=='1'){
      this.data.category = '0'
    }
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
  uploadFile: function (file,i) {
    return uploadFile({
      filePath: file,
      name: 'file',
    }).then((res)=>{
      var data = null;
      if (typeof res.data == "string") {
        data = JSON.parse(res.data);
      } else {
        data = res.data;
      }
      // this.data.postImgList = [...this.data.postImgList, ...[data.data[0].url]]
      this.data.postImgList[i] = data.data[0].url
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
        if (!this.data.title && this.data.article_type != '1'){
          return wx.showToast({
            title: '请输入标题'
          })
        }
        if (!this.data.content){
          return wx.showToast({
            title: '请输入内容'
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
      ((i)=>{
        pro.push(this.uploadFile(img, i))
      })(i)
      
    }
    Promise.all(pro).then(() => {
      let data = {
        title: this.data.title,
        type: '0',
        content: this.data.content,
        img_urls: this.data.postImgList.join(','),
        cover_urls: this.data.postImgList[0],
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
            if (this.data.article_type == '1') {
              wx.switchTab({
                url: '/pages/friends/friends'
              })
            } else if (this.data.article_type == '2'){
              wx.switchTab({
                url: '/pages/subject/subject'
              })
            }else{
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
            
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
    const { title, content, category, article_type} = this.data;
    if ((!title && this.data.article_type != '1') || !content || !article_type) {
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
  //选择类型
  chooseType:function(){
    var typeArry = []
    for(let i in this.data.mapType){
      typeArry[i] = this.data.mapType[i]
    }
    wx.showActionSheet({
      itemList: typeArry,
      success:(res)=>{
        console.log(res)
        this.setData({
          article_type: ''+res.tapIndex
        })
        this.taBlurImgList()
      },
      fail:(err)=>{
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