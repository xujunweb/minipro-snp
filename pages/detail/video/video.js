// pages/detail/video/video.js
import { updateArticle, getByArticleId } from '../../../api/article.js'
import { followUser } from '../../../api/user.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",  //文章id
    artInfo: null, //文章信息
    hideVideo: 1,   //隐藏视频， 2为隐藏
    spaceStyle: '', //占位block样式
    scrollStyle: '', //scroll-view样式
    scrollTop: 0, //控制scroll-view 滚动条位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
        userId: app.globalData.userInfo.id,
      })
      app.pageByFollow().then(() => {
        this.getByArticleId(options.id)
      })
    }
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

  //获取文章信息
  getByArticleId: function (id) {
    getByArticleId({
      status: '0',
      id: id,
    }).then((res) => {
      res.data.img_urls = res.data.img_urls.split(',')
      this.data.artInfo = res.data
      this.setData({
        artInfo: res.data
      })
      this.getVideoHeight()
      var followList = wx.getStorageSync('followUser')
      if (this.data.artInfo.user) {
        this.setData({
          isfollow: followList[this.data.artInfo.user.id] ? true : false
        })
      }
    })
  },
  //跳转到指定评论位置
  scollCommnet: function (e) {
    let that = this;
    console.log('scollCommnet---  e.detail=', e.detail);
    let query = wx.createSelectorQuery().in(this),
      id = e.detail == 'top' ? 'FlowMainAd' : 'discussBottom';
    query.select(`#${id}`).boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log('res=', res);
      //滚动到顶部，即标题+广告的高度
      that.setData({
        scrollTop: 57 + res[0].height
      });
      // wx.pageScrollTo({
      //     scrollTop: res[0].top + res[1].scrollTop,
      //     duration: 0
      // });
    });
  },
  /**
     * 获取视频区域高度，设置scrollview的高度
     */
  getVideoHeight: function (type) {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.select('#video-in').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (exec) {
      console.log('exec: ', exec);
      wx.getSystemInfo({
        success: function (res) {
          console.log('res: ', res);
          var pixelRatio = res.pixelRatio;
          console.log('pixelRatio=', pixelRatio);
          let nowSpaceHeight = (exec[0].height * pixelRatio) + 'rpx';
          console.log('height=', nowSpaceHeight);
          let scrollHeight = (res.windowHeight - exec[0].height) + 'px';
          console.log('scrollHeight=', scrollHeight);
          that.setData({ scrollStyle: 'height:' + scrollHeight + ';' }, () => {
            if (!type) {
              let tmpPlateInfo = that.data.artInfo;
              let tempData = {
                avatar: "",
                comment: "",
                commentTime: 0,
                createTime: 0,
                id: 0,
                isDelete: 1,
                mediaId: 566,
                nickName: "",
                openId: "",
                userId: 0
              };
            }
          });
        }
      });
    });
  },
  //关注用户
  followUser: function () {
    followUser({
      is_follow: this.data.isfollow ? '0' : '1',
      user_id: this.data.artInfo.user.id,
      follow_user_id: app.globalData.userInfo.id,
    }, this.data.artInfo.user).then((res) => {
      console.log('关注用户---')
      this.setData({
        isfollow: !this.data.isfollow
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})