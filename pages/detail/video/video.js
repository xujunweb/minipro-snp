// pages/detail/video/video.js
import { updateArticle, getByArticleId } from '../../../api/article.js'
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
        id: options.id
      })
      this.getByArticleId(options.id)
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
      this.setData({
        artInfo: res.data
      })
      this.getVideoHeight()
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
              //解决scrollview不能滚动的问题，故多加一条空数据再删除
              // if (tmpPlateInfo.comment > 3) {
              //   setTimeout(function () {
              //     tmpPlateInfo.comment.length += 1
              //     console.log('add ++++++++');
              //     that.setData({
              //       artInfo: tmpPlateInfo
              //     }, () => {
              //       setTimeout(function () {
              //         let tmpPlateInfo2 = that.data.artInfo;
              //         let dIndex = -1;
              //         tmpPlateInfo2.payMediaCommentDtos.map((item, index) => {
              //           if (item.id == 0) {
              //             dIndex = index;
              //           }
              //         });
              //         console.log('dIndex=', dIndex);
              //         if (dIndex > -1) {
              //           tmpPlateInfo2.payMediaCommentDtos.splice(dIndex, 1);
              //           // console.log('tmpPlateInfo2=',tmpPlateInfo2);
              //           that.setData({
              //             artInfo: tmpPlateInfo2
              //           });
              //         }
              //       }, 500);
              //     });
              //   }, 1500);
              // }
            }
          });
        }
      });
    });
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