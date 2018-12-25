
var app = getApp();
import { followUser } from '../../api/user.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {
        id:11,  //视频id
        title:'视频标题',   //标题
        cover_urls:'',  //封面图
        img_urls:'',  //视频地址
        comment:'', //评论数
        like:'',  //点赞数
        user:{    //用户信息

        },
        articleInfo:{
          like:'0',
          favorite:'0'
        }
      },
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    curPlayIdx :'no',       //当前播放的那一个的索引
    isJump: true,   //是否允许等到延迟的时间后进行跳转 true为允许 false为不允许
    videoId:'',    //视频的一些信息
    title:'',
    openid:'',
  },
  attached: function () {
    var followList = wx.getStorageSync('followUser')
    if (this.data.item.user) {
      this.setData({
        isfollow: followList[this.data.item.user.id] ? true : false
      })
    }
    this.setData({
      userId: app.globalData.userInfo.id
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    videoPlay :function(e){
      console.log('eee===',e)
      var that = this;
      let index = this.data.item.id;
      let coverImg = this.data.item.cover_urls
      let title = this.data.item.title
      this.updateViewNum(index);
      wx.setStorageSync('playIdx', index)
      this.setData({
        curPlayIdx: index,
        coverImg:coverImg,
        title: title,
        videoId: index
      },()=>{
        this.triggerEvent('curPlayIdx', index);
      }) ;
    },

    videoUpdate: function(event) {
      let that = this;
      let playIdx = wx.getStorageSync('playIdx')
      if(playIdx && playIdx != that.data.curPlayIdx){
        that.setData({
          curPlayIdx:'no'
        })
      }
    },

    videoEnd: function(){
      this.setData({
        curPlayIdx:'no'
      })
    },

    videoPlay2: function(e){
      var that = this
      let index = this.data.item.id;
      wx.setStorageSync('playIdx', index) ;
    },

    jumpToPage: function(e){
      console.log(e)
      this.setData({
        curPlayIdx:'no'
      },()=>{
        console.log('curPlayIdx',this.data.curPlayIdx)
      })
      wx.navigateTo({
        url: '/pages/detail/video/video?id=' + this.data.item.id
      })
    },
    //防止点击穿透 背景层
    preventD: function () { },
    /**
     * 更新浏览数量
     */
    updateViewNum: function(id) {
      let tJsons = {
          data: {
              mediaId: parseInt(id),
              xcxId: app.globalData.xcxId
          },
          ele: this,
          fn: function(res) {
              console.log('updateViewNum------     res=',res);
          }
      };
      // payPlateUpdateViewNumM(tJsons);
   },
    //关注用户
    followUser: function () {
      followUser({
        is_follow: this.data.isfollow ? '0' : '1',
        user_id: this.data.item.user.id,
        follow_user_id: app.globalData.userInfo.id,
      }).then((res) => {
        console.log('关注用户---')
        this.setData({
          isfollow: !this.data.isfollow
        })
      })
    },

  },
  ready:function(){
    // this.getVipFreeCount();
  }
})
