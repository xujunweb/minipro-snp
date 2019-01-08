// pages/my/enter/enter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: true,
    orgImages:[],
    address:'',
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
  setShopLocation: function () { //设置门店地图位置
    var that = this;
    wx.chooseLocation({
      success:(res1)=> {
        console.log("...chooseLocation...success...")
        console.log(res1)
        var address = this.data.address;
        this.setData({ lat: res1.latitude, lng: res1.longitude });
        // if (address.length < 1) {
        this.setData({ address: res1.address });
        // }
      },
      complete: function (res) {
        console.log('...chooseLocation..complete...')
        console.log(res)
      },
      fail: function (err) {
        console.log("...chooseLocation...fail...")
        console.log(err)
      }
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
})