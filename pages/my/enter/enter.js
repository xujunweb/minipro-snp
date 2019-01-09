// pages/my/enter/enter.js
var app = getApp()
import { uploadFile} from '../../../api/upload.js'
import { insertInstitute} from '../../../api/bodies.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: true,
    orgImages: [],  //介绍图片
    address: '',
    logo:'',    //封面图
    name:'',  //机构名称
    describe:'',  //机构介绍
    phone:'', //手机号码
    type:'',  //机构描述
    inputMap:{
      0:'name',
      1:'type',
      2:"phone",
      3:'describe'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //文本输入
  textInput:function(e){
    //0=机构名称，1=机构描述，2=电话号码，3=机构介绍
    var typeVal = e.currentTarget.dataset.type;
    var value = e.detail.value;
    var obj = {}
    obj[this.data.inputMap[typeVal]] = value
    this.setData(obj)
  },
  uploadImg: function(e) { //上传门店logo和门店图片
    if (this.data.uploadDisabled) return;
    this.data.uploadDisabled = true
    var typeVal = e.currentTarget.dataset.type; //0=上传logo, 1=上传门店图片
    var uploadNum = 1; //这次可以选择的最大照片数量
    if (typeVal == 1) uploadNum = 9 - this.data.orgImages.length;
    //小于9张才可以上传
    wx.chooseImage({
      count: uploadNum, // 默认9
      sizeType: ['compressed'], // ['original', 'compressed']可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res)=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: "上传中...",
          mask:true,
        });
        var pro = []
        var len = this.data.orgImages.length
        for (let i = 0, img; img = tempFilePaths[i]; i++) {
          ((i) => {
            pro.push(this.uploadFile(img, i, typeVal, len))
          })(i)
        }
        Promise.all(pro).then(() => {
          wx.hideLoading()
          this.data.uploadDisabled = false
          this.setData({
            orgImages: this.data.orgImages
          })
        }).catch(()=>{
          wx.hideLoading()
          this.data.uploadDisabled = false
        })
      },
      fail:()=>{
        this.data.uploadDisabled = false
      }
    });
  },
  //文件上传
  uploadFile: function (file, i, typeVal,len) {
    return uploadFile({
      filePath: file,
      name: 'file',
    }).then((res) => {
      var fileUrl = "";
      var data = null;
      if (typeof res.data == "string") {
        data = JSON.parse(res.data);
      } else {
        data = res.data;
      }
      var fileUrl = data.data[0].url;
      if (typeVal == 0) {
        this.setData({
          logo: fileUrl
        });
      } else {
        this.data.orgImages[i + len] = fileUrl
      }
    })
  },
  //删除门店图片
  delShopImg: function(e) { 
    var id = e.currentTarget.dataset.id;
    var imgArr = this.data.orgImages;
    imgArr.splice(id, 1);
    // for (var i = 0, l = imgArr.length; i < l; i++) {
    //   imgArr[i].id = i;
    // }
    this.setData({
      orgImages: imgArr
    });
  },
  //设置门店地图位置
  setShopLocation: function() { 
    var that = this;
    wx.chooseLocation({
      success: (res1) => {
        console.log("...chooseLocation...success...")
        console.log(res1)
        var address = this.data.address;
        this.setData({
          lat: res1.latitude,
          lng: res1.longitude
        });
        // if (address.length < 1) {
        this.setData({
          address: res1.address
        });
        // }
      },
      complete: function(res) {
        console.log('...chooseLocation..complete...')
        console.log(res)
      },
      fail: function(err) {
        console.log("...chooseLocation...fail...")
        console.log(err)
      }
    });
  },
  //提交入驻
  insertInstitute:function(){
    var data = {
      name: this.data.name,
      describe: this.data.describe,
      phone: this.data.phone,
      type: this.data.type,
      address: this.data.address,
      cover_urls: this.data.logo,
      img_urls: this.data.orgImages.join(','),
    }
    var pass = true
    for(let key in data){
      if(!data[key]){
        pass = false
        break
      }
    }
    if (!pass){
      wx.showToast({
        title: '信息有误',
        icon:'none'
      })
      return
    }
    insertInstitute(data).then((res)=>{
      console.log('入驻结果-------',res)
      wx.showToast({
        title: '入驻成功',
        duration:1500,
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/subject/bodies/bodies',
        })
      },1500)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
})