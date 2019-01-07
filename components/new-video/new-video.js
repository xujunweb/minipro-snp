
var app = getApp();
import { followUser } from '../../api/user.js'
import { articleLike, delComment, pageByArticleComment, addComment} from '../../api/article.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {
        id: 11,  //视频id
        title: '视频标题',   //标题
        cover_urls: '',  //封面图
        img_urls: '',  //视频地址
        comment: '', //评论数
        like: '',  //点赞数
        user: {    //用户信息

        },
        articleInfo: {
          like: '0',
          favorite: '0'
        }
      },
      observer: function (newVal, oldVal) {
        if (newVal) {
          var followList = wx.getStorageSync('followUser')
          if (newVal.user) {
            this.setData({
              isfollow: followList[newVal.user.id] ? true : false,
              comments:[],
              iscomment:false,
            })
          }
        }
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    curPlayIdx: 'no',       //当前播放的那一个的索引
    isJump: true,   //是否允许等到延迟的时间后进行跳转 true为允许 false为不允许
    videoId: '',    //视频的一些信息
    title: '',
    openid: '',
    classMap: {},
    userMap: {},
    isfollow:false,
    comment:'',   //评论内容
    comments:[],  //评论数组
    iscomment:false,  //显示评论
    openId:'',
    boardHeigt:0,
    isIPhoneX:false,
  },
  ready:function(){
    //iPhoneX手机特别处理底部
    wx.getSystemInfo({
      success: (res) => {
        if (res && res.model.indexOf('iPhone X') > -1) {
          this.setData({ isIPhoneX: true });
        }
      },
    })
  },
  attached: function () {
    console.log('组件渲染')
    this.setData({
      userId: app.globalData.userInfo.id,
      classMap: app.globalData.classMap,
      userMap: app.globalData.userMap,
      height: wx.getSystemInfoSync().screenHeight + 'px',
      openId:app.globalData.openid
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //下一个视频
    nextVideo:function(){
      this.triggerEvent('nextVideo')
    },
    befoVideo:function(){
      this.triggerEvent('befoVideo')
    },
    //发布
    fabu:function(){
      wx.navigateTo({
        url: '/pages/release/video/video?artype=0',
      })
    },
    jumpToPage: function (e) {
      console.log(e)
      this.setData({
        curPlayIdx: 'no'
      }, () => {
        console.log('curPlayIdx', this.data.curPlayIdx)
      })
      wx.navigateTo({
        url: '/pages/detail/video/video?id=' + this.data.item.id
      })
    },
    //防止点击穿透 背景层
    preventD: function () { },
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
    /**
     * 点击点赞
     */
    likeChange: function (e) {
      var that = this;
      if (this.data.isLikeDisabled) {
        return false; //防止点击多次
      }
      // wx.showLoading({
      //   title: '加载中...',
      // });
      that.setData({
        isLikeDisabled: true, //控制按钮不可用
      });
      var url = '';
      var data = {};
      that.setData({
        reClick: true
      });
      var is_like = '0'
      if (!this.data.item.articleInfo || this.data.item.articleInfo.like == '0') {
        is_like = '1'
      }
      articleLike({
        is_like: is_like,
        article_id: this.data.item.id,
        user_id: app.globalData.userInfo.id
      }).then((res) => {
        wx.showToast({
          title: '操作成功'
        })
        if (!this.data.item.articleInfo) {
          this.data.item.articleInfo = {
            like: is_like
          }
        } else {
          this.data.item.articleInfo.like = is_like
        }
        this.data.item.like = is_like != 1 ? this.data.item.like - 1 : this.data.item.like + 1
        this.setData({
          reClick: false,
          isLikeDisabled: false,
          item: this.data.item
        })
      })
    },
    //获取评论列表
    pageByArticleComment: function (p) {
      pageByArticleComment({
        pageNum: p,
        pageSize: 100,
        article_id: this.data.item.id,
      }).then((res) => {
        if (p === 1) {
          this.data.comments = []
        }
        this.setData({
          comments: [...this.data.comments, ...res.data.list],
          iscomment:true,
          total: res.data.total,
        })
      })
    },
    inputFocus: function (e) {
      this.setData({ boardHeigt: e.detail.height });
    },

    inputBlur: function () {
      this.setData({ boardHeigt: 0 });
    },
    sendDiscuss: function (e) {
      var that = this;
      console.log("#####################")
      console.log(that.data)
      if (that.data.comment.replace(/\s+/g, "") == '') {
        wx.showModal({
          title: '温馨提示',
          confirmColor: "#ff7800",
          showCancel: false,
          content: '请输入评论内容',
        });
        return;
      }
      // 调用新增评论接口
      let pJsons = {
        article_id: this.data.item.id,
        user_id: app.globalData.userInfo.id,
        content: that.data.comment.trim()
      };
      console.log('pJsons=', pJsons);
      addComment(pJsons).then((res) => {
        this.setData({
          comment: ''
        })
        wx.showToast({
          title: '评论成功',
        })
        //新增评论成功，重新刷新评论列表
        this.pageByArticleComment(1)
      })

    },
    commentChange: function (e) {
      let comment = e.detail.value;
      this.setData({ comment });
    },
    /**
     * 删除评论
     */
    deletComment: function (e) {
      const that = this;
      let { id, index } = e.currentTarget.dataset;
      wx.showModal({
        title: '删除提醒',
        content: '确定删除该评论？',
        confirmColor: "#ff7800",
        success: (res) => {
          if (res.confirm) {
            let params = null;
            params = { id };
            delComment({
              article_id: this.data.item.id,
              id: id,
              user_id: app.globalData.userInfo.id
            }).then((res) => {
              //删除评论成功，重新刷新评论列表
              this.pageByArticleComment(1)
            })
          } else if (res.cancel) {

          }
        }
      })
    },
    clickEvent:function(e){
      console.log('点击事件',e)
      this.pageByArticleComment(1)
    },
    //关闭评论
    closeCom:function(){
      this.setData({
        iscomment:false,
      })
    },
  },
  ready: function () {
    // this.getVipFreeCount();
  }
})
