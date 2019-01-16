// pages/my/class/class.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [], //总分类
    postBigClass:[],  //选中的一级分类
    postLitClass: [],  //选中的二级分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var classMap = []
    // for (let i in app.globalData.classMap) {
    //   classMap[i] = { id: i, classifyName: app.globalData.classMap[i] }
    // }
    
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
    this.setData({
      classifyList: [
        ...app.globalData.instClass
      ]
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
  chooseOk:function(e){
    let pages = getCurrentPages(),
      prevPage = pages[pages.length - 2];  //上一个页面
    for (let i = 0, big; big = this.data.classifyList[i];i++){
      if(big.num && big.num>0){
        this.data.postBigClass.push(big.key)
      }
    }
    prevPage.setData({
      postLitClass: [...this.data.postLitClass],
      postBigClass: [...this.data.postBigClass]
    });
    wx.navigateBack();
  },
  choose: function (e) {
    let bigindex = e.currentTarget.dataset.bigindex,
      litindex = e.currentTarget.dataset.litindex
    if (!this.data.classifyList[bigindex].child[litindex].select){
      this.data.classifyList[bigindex].child[litindex].select = true
      this.data.postLitClass.push(this.data.classifyList[bigindex].child[litindex].key)
      //添加大分类
      if (!this.data.classifyList[bigindex].num){
        this.data.classifyList[bigindex].num = 1
      }else{
        this.data.classifyList[bigindex].num += 1
      }
    }else{
      this.data.classifyList[bigindex].child[litindex].select = false
      var index = this.data.postLitClass.indexOf(this.data.classifyList[bigindex].child[litindex].key)
      if (index > -1) {
        this.data.postLitClass.splice(index, 1);
      }
      //减少大分类
      this.data.classifyList[bigindex].num -= 1
    }
    this.setData({
      classifyList: this.data.classifyList
    })
  },
})