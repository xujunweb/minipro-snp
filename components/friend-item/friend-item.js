// components/friend-item/friend-item.js
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
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation:''
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
    /**
     * 显示评论输入框
     */
    showDiscussInput: function (ev) {
      var that = this;
      app.userInfoMiddleWare().then((data) => {
        if (!data.isGetUserInfo) {
          //发布显示授权弹窗的事件(自定义的微信方法)
          wx.eventBus.trigger('showOnAuthShow')
        } else {
          //这里执行需要授权后才能执行的代码//添加访问记录
          app.addRecord();
          var nowClickId = ev.currentTarget.dataset.nowid;
          var goodsId = ev.currentTarget.dataset.goodsid;
          var userType = ev.currentTarget.dataset.usertype;

          clearTimeout(outTime)
          var outTime = setTimeout(function () {
            if (!that.data.discussInfo.inputShow) {

              var animation = wx.createAnimation({
                duration: 200,
                timingFunction: 'ease-out',
              })

              that.animation = animation;
              animation.translateX(360).step()
              that.data.shopList[nowClickId].animationData = that.animation.export();
              that.data.shopList[nowClickId].animationDataShow = false;//已经隐藏
              that._setData(that.data)

              that.data.discussInfo.inputShow = true;
              // that.data.discussInfo.inputText = ''; 
              that.data.discussInfo.placeHolder = "请输入评论内容";
              that.data.discussInfo.goodsId = goodsId;
              that.data.discussInfo.shopListIndex = nowClickId;
              that.data.discussInfo.userType = userType;
              that._setData(that.data);
            }
          }, 300)

        }
      })


    },
    /**
     *评论输入保存状态
    */
    DiscussInputState: function (e) {

      var that = this;
      var value = e.detail.value;
      that.data.discussInfo.inputText = value;
      that._setData(that.data);
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

      DiscoverListCommentPublishM({
        data: {
          comment: that.data.discussInfo.inputText.trim(),
          momentId: that.data.discussInfo.goodsId,
          openId: app.globalData.openid,
          userType: userType,
          xcxId: app.globalData.xcxId,
        },
        ele: that,
        fn: function (msg) {
          (typeof msg == 'string') && app.showDialog(that, msg, 3000);
          that.hideDiscussInput();
        }
      })
    },
    /**
     * 删除评论
     */
    delDiscuss: function (e) {
      var that = this;
      var belongto = e.currentTarget.dataset.belongto;
      var outindex = e.currentTarget.dataset.outindex;
      var selfindex = e.currentTarget.dataset.selfindex;
      var id = e.currentTarget.dataset.id;
      var userType = e.currentTarget.dataset.usertype;

      if (belongto == 1) {
        wx.showModal({
          title: '删除提醒',
          content: '确定删除该评论？',
          confirmColor: "#ff7800",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              DiscoverListCommentDelM({
                data: {
                  id: id,
                  userType: userType,
                  xcxId: app.globalData.xcxId,
                  openId: app.globalData.openid
                },
                ele: that,
                fn: function () {
                  that.data.shopList[outindex].comments.splice(selfindex, 1);
                  that._setData(that.data)
                }
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
      var that = this;
      that.data.discussInfo.inputShow = false;
      that.data.discussInfo.goodsId = 0;
      that.data.discussInfo.inputText = '';
      that.data.discussInfo.shopListIndex = '';
      that.data.discussInfo.userType = 1;
      that._setData(that.data);
    },
  }
})
