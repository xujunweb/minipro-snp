var app = getApp();
import { followUser} from '../../api/user.js'
Component({
    behaviors: [],
    options: {
    },
    data: {
      isfollow:false,
      isLikeDisabled:false,
      userId:'',
      classMap:{},
      userMap:{},
    },
    properties: { // 属性名
      item: {
        type: Object, // 类型 
        value:{
          id:'111', //文章id
          title:'标题标题',
          type:1,
          content:'',
          comment:20, //评论数量
          like:40,  //点赞数量
          favorite:30,  //收藏数
          img_urls:'',
          user:{
            nickname:'天天',
            type:'老师'
          },  //发帖的用户信息
          articleInfo:{
            like:0, //自己是否点赞
            favorite:0, //自己是否收藏
          },
        }
      }
    },
    attached:function(){
      var followList = wx.getStorageSync('followUser')
      if (this.data.item.user){
        this.setData({
          isfollow: followList[this.data.item.user.id] ? true : false
        })
      }
      this.setData({
        userId: app.globalData.userInfo.id,
        classMap:app.globalData.classMap,
        userMap: app.globalData.userMap,
      })
    },
    methods: {
      /**
       * 跳转到详情页
       */
      jumpNextPage: function (e) {
          wx.navigateTo({ 
            url: '/pages/detail/article/article?id=' + this.data.item.id
            });
      },
      /**
       * 点赞
       */
      onPraise: function (e) {
        var myEventDetail = { // detail对象，提供给事件监听函数
            index: e.currentTarget.dataset.index,
            momentId: e.currentTarget.dataset.momentId,
            userType: e.currentTarget.dataset.userType,
            likeStatus: e.currentTarget.dataset.likeStatus,
            likeId: e.currentTarget.dataset.likeId
        };
        var myEventOption = {}; // 触发事件的选项
        this.triggerEvent('praise', myEventDetail, myEventOption)
      },
      /**
     * 长按复制
     */
      longpress: function () {

      },
      //关注用户
      followUser:function(){
        followUser({
          is_follow: this.data.isfollow?'0':'1',
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

});