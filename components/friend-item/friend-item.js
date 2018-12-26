// components/friend-item/friend-item.js
import { delComment, addComment, articleLike, updateArticle } from '../../api/article.js'
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{
        like:1,
        comment:1,
        articleInfo:{
          like:0,
        },
        user:{
          nickname:'墨迹墨迹'
        },
        content:'内容',
        id:111,
        img_urls:'',
        cover_urls:'',  
        title:'标题标题标题',
      }
    },
    arIndex:{
      type:Number,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation:'',
    discussInfo: {//点击评论相关数据(评论操作)
      inputShow: false,//是否显示输入框
      goodsId: 0,//评论的商品ID
      inputText: '',//输入框内容
      placeHolder: "请输入评论内容",//评论的输入框提示
      shopListIndex: '',//shopList的index索引
      userType: 1,
      userMap:{},
      classMap:{},
    },
  },
  attached:function(){
    this.setData({
      userId: app.globalData.userInfo.id,
      classMap: app.globalData.classMap,
      userMap: app.globalData.userMap,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDiscuss: function (e) {
      console.log('显示点赞----------------')
      // var nowClickId = e.currentTarget.dataset.nowclickid;
      var that = this;

      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'linear',
      });

      this.data.animation = animation;
      console.log(this.data.item)
      if (this.data.item) {
        // this.data.discussInfo.shopListIndex = nowClickId;

        if (!this.data.item.animationDataShow) {
          animation.translateX('-100%').step();
          this.data.item.animationData = this.data.animation.export();
          this.data.item.animationDataShow = true;//已经显示
        }
        else {
          animation.translateX(360).step()
          this.data.item.animationData = this.data.animation.export();
          this.data.item.animationDataShow = false;//已经隐藏
          // that._setData(that.data)
        }
        //隐藏其他的
        // this.data.item.animationDataShow = false
        // animation.translateX(360).step()
        // this.data.item.animationData = this.data.animation.export();
        // this.data.item.animationDataShow = false;//已经隐藏
        this.setData(this.data)
      }

    },
    delGoods: function (e) { //删除好友圈
      var that = this;
      wx.showModal({
        title: '删除提醒',
        content: '确定删除该动态？',
        confirmColor: "#ff7800",
        success: function (res) {
          if (res.confirm) {
            that.confirmDelGoods();
          }
        }
      });
    },

    confirmDelGoods: function () { //确认删除
      updateArticle({
        id:this.data.item.id,
        state:'1',
        update_author: this.data.item.id,
      }).then(()=>{
        //删除成功，通知父级删除对应索引的
        this.triggerEvent('deleArticle',this.data.arIndex)
      })
    },
    /**
     * 显示评论输入框
     */
    showDiscussInput: function (ev) {
      var that = this;
      app.isAuthorize().then((data) => {
        if (!data) {
          //发布显示授权弹窗的事件(自定义的微信方法)
          wx.eventBus.trigger('showOnAuthShow')
        } else {
          //这里执行需要授权后才能执行的代码//添加访问记录
          clearTimeout(outTime)
          var outTime = setTimeout( ()=> {
            if (!that.data.discussInfo.inputShow) {

              var animation = wx.createAnimation({
                duration: 200,
                timingFunction: 'ease-out',
              })

              that.animation = animation;
              animation.translateX(360).step()
              this.data.item.animationData = that.animation.export();
              this.data.item.animationDataShow = false;//已经隐藏
              this.data.discussInfo.inputShow = true;
              // that.data.discussInfo.inputText = ''; 
              this.data.discussInfo.placeHolder = "请输入评论内容";
              this.setData(this.data);
            }
          }, 300)

        }
      })


    },
    /**
     *评论输入保存状态
    */
    DiscussInputState: function (e) {
      var value = e.detail.value;
      this.data.discussInfo.inputText = value;
      this.setData(this.data);
    },
    /**
     *发送评论
    */
    sendDiscuss: function (e) {
      var that = this;
      var userType = e.currentTarget.dataset.usertype;

      if (that.data.discussInfo.inputText.replace(/\s+/g, "") == '') {
        wx.showModal({
          title: '温馨提示',
          confirmColor: "#ff7800",
          showCancel: false,
          content: '请输入评论内容',
          success: function (res) {
          }
        })
        return;
      }

      let pJsons = {
        article_id: this.data.item.id,
        user_id: app.globalData.userInfo.id,
        content: that.data.discussInfo.inputText.trim()
      };
      console.log('pJsons=', pJsons);
      addComment(pJsons).then((res) => {
        this.setData({
          comment: ''
        })
        wx.showToast({
          title: '评论成功',
        })
        //给评论数组插入一条数据
        that.data.item.comments.unshift({
          article_id: this.data.item.id,
          user_id: app.globalData.userInfo.id,
          id:res.data.id
        })
        that.hideDiscussInput();
      })
    },
    /**
     * 删除评论
     */
    delDiscuss: function (e) {
      var that = this;
      var info = e.currentTarget.dataset.info
      var index = e.currentTarget.dataset.index
      if (info.user_id == this.data.userId) {
        wx.showModal({
          title: '删除提醒',
          content: '确定删除该评论？',
          confirmColor: "#ff7800",
          success:  (res)=> {
            if (res.confirm) {
              console.log('用户点击确定')
              delComment({
                article_id: info.article_id,
                id: info.id,
                user_id: info.user_id,
              }).then(()=>{
                wx.showToast({
                  title: '删除成功',
                })
                this.data.item.articleComment.splice(index,1)
                this.setData({
                  item: this.data.item
                })
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    },
    /**
     * 点击点赞
     */
    clickToLick: function (e) {

      //添加访问记录
      app.addRecord();

      var goodsId = e.currentTarget.dataset.goodsid;
      var index = e.currentTarget.dataset.nowclickid;
      var that = this;
      var userType = e.currentTarget.dataset.usertype;

      console.log(e.currentTarget.dataset)

      DiscoverListLikesOnM({
        data: {
          momentId: goodsId,
          openId: app.globalData.openid,
          userType: userType,
          xcxId: app.globalData.xcxId,
        },
        ele: that,
        index: index,
        fn: function () {
          that.showDiscuss(e);
        }
      })

    },
    /**
     * 取消点赞
     */
    clickToCancelLick: function (e) {
      var nowClickId = e.currentTarget.dataset.nowclickid;
      var likeId = e.currentTarget.dataset.likeid;
      var index = e.currentTarget.dataset.nowclickid;
      var userType = e.currentTarget.dataset.usertype;
      var goodsId = e.currentTarget.dataset.goodsid;

      var that = this;

      DiscoverListLikesOffM({
        data: {
          id: likeId,
          userType: userType,
          xcxId: app.globalData.xcxId,
          momentId: goodsId
        },
        ele: that,
        index: index,
        fn: function () {
          that.showDiscuss(e);
        }
      })

    },
    /**
     * 隐藏评论输入框
     */
    hideDiscussInput: function () {
      this.data.discussInfo.inputShow = false;
      this.data.discussInfo.inputText = '';
      this.setData(this.data);
    },
  }
})
