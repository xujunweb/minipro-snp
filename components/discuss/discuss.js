import { delComment, pageByArticleComment, addComment, articleLike} from '../../api/article.js'

let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    artid: {//文章id
      type: String,
      value: null,
      observer: function (newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.pageByArticleComment(1)
        }
      }
    },
    likeStatus: {//点赞状态（0未点）
      type:String,
      value:'0',
    },
    likeNum:{
      type:Number,
      value:0,
    },
    thisp:{ //第几页评论
      type:Number,
      value:1,
      observer: function (newVal, oldVal){
        if (newVal){
          this.pageByArticleComment(newVal)
        }
      }
    },
    type:{  //评论类型(主要用来区分题目详情下的评论)
      type:Number,
      value:0,
    },
    shareShow:{ //是否显示分享弹框
      type: Boolean,
      value: false,
    }
  },
  ready: function(){
    //请求列表
    // this.pageByArticleComment(1)
    app.getUserInfo(true).then((userinfo)=>{
      this.setData({
        openId: userinfo.openid
      })
    })
    let isMe = false;
    //iPhoneX手机特别处理底部
    wx.getSystemInfo({
      success: (res)=> {
        if (res && res.model.indexOf('iPhone X') > -1){
          this.setData({ isIPhoneX: true });
        }
      },
    });

    // 事件发布，用于刷新数据，  在置顶子组件中触发
    wx.eventBus.on('getFoucs',(data) => {
      let that = this;
      console.log('cccccccccccc')
      that.setData({
        getFocus: true
      })
    })

  },

  /**
   * 组件的初始数据
   */
  data: {
    comment: '',
    comments:[],  //评论列表
    openId: '',
    showTab: 1,
    inputStatus: 'blur',//输入框状态
    likeId: null, //当前点赞id
    isLikeDisabled: false, //控制点赞按钮是否可用，防止多次点击
    // shareShow: false,   //分享弹框显现
    posterShow: false,   //海报弹框显现
    posterImgSrc: '', //海报图片
    articleId: '', //用于确认海报传的地址
    boardHeigt:0,
    publishPopupShow: '', //发布成功弹框-显示
    publishPopupHide: '', //发布成功弹框-隐藏
    publishPopupParams: {
      title: {
        text1: '恭喜发布成功！',
        text2: '转发到群有助于提升帖子排名!',
      },
      isCallBack: true,
      calllBackName: 'boradimg',
    }, //发布成功弹框-传参
    footerShow: true,   //用于视频详情,隐藏底部
    getFocus: false,   // input 获取焦点
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取评论列表
    pageByArticleComment:function(p){
      pageByArticleComment({
        pageNum:p,
        pageSize:10,
        article_id:this.data.artid,
      }).then((res)=>{
        if(p === 1){
          this.data.comments = []
        }
        this.setData({
          comments: [...this.data.comments, ...res.data.list]
        })
      })
    },
    commentChange: function(e){
      let comment = e.detail.value;
      this.setData({ comment });
      if(this.data.page == 'plate-video'){
        this.triggerEvent('inputComment', comment);
      }
    },
    //滚动到指定位置
    doScollcommnet: function (type) {
      this.setData({ showTab: 1 }, () => {
        this.triggerEvent('scollcommnet', type);
      })
    },
    goToPay: function(){
      this.triggerEvent('topay');
    },
    //滚动到评论tab
    scollCommnet: function(){
      this.doScollcommnet('top');
    },
    inputFocus: function(e){
      let that = this;
      app.isAuthorize().then((data)=>{
        if (!data){
          //发布显示授权弹窗的事件(自定义的微信方法)
          wx.eventBus.trigger('showOnAuthShow')
          //失去焦点
          wx.hideKeyboard()
        }else{
          console.log('键盘高度---------', e.detail.height)
          //点击发布事件  用于隐藏视频
          if(that.data.page == 'plate-video'){
            that.setData({
              footerShow: true
            },()=>{
              that.triggerEvent('changeVideoHeight');
            })
          }
          that.setData({ inputStatus: 'focus', boardHeigt: e.detail.height });
        }
      })
    },

    inputBlur: function(){
      let that = this;
      //点击发布事件
      if(that.data.page == 'plate-video'){
        that.setData({
          footerShow: false
        },()=>{
          that.triggerEvent('changeVideoHeight1');
        })
      }
      that.setData({ inputStatus: 'blur', boardHeigt: 0});
    },

    sendDiscuss: function (e) {
      var that = this;
      console.log("#####################")
      console.log(that.data)
      var userType = this.data.userType;

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
        article_id: this.data.artid,
        user_id: app.globalData.userInfo.id,
        content: that.data.comment.trim()
      };
      console.log('pJsons=', pJsons);
      addComment(pJsons).then((res)=>{
        this.setData({
          comment:''
        })
        wx.showToast({
          title: '评论成功',
        })
        //新增评论成功，重新刷新评论列表
        this.pageByArticleComment(1)
      })

    },
    /**
     * 删除评论
     */
    deletComment: function(e){
      const that = this;
      let { id, index } = e.currentTarget.dataset;
       wx.showModal({
        title: '删除提醒',
        content: '确定删除该评论？',
        confirmColor: "#ff7800",
        success: (res)=> {
          if (res.confirm) {
            let params = null;
            params = { id };
            delComment({
              article_id:this.data.artid,
              id:id,
              user_id: app.globalData.userInfo.id
            }).then((res)=>{
              //删除评论成功，重新刷新评论列表
              this.pageByArticleComment(1)
            })
            // delCommentInPlate({
            //   data: params,
            //   ele: that,
            //   fn: function () {
            //     let { comments } = that.data;
            //     comments.splice(index, 1);
            //     that.setData({ comments }, () => {
            //       if (that.data.page == 'plate-video') {
            //         that.triggerEvent('commentsLen', that.data.comments);
            //       }
            //     });
            //   }
            // });
          } else if (res.cancel) {

          }
        }
      })

    },
    /**
     * 点击点赞
     */
    likeChange: function(e){
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
        reClick:true
      });
      articleLike({
        is_like: this.data.likeStatus == 1?'0':'1',
        article_id:this.data.artid,
        user_id: app.globalData.userInfo.id
      }).then((res)=>{
        this.setData({
          reClick: false,
          isLikeDisabled: false,
          likeStatus: this.data.likeStatus == 1 ? '0' : '1',
          likeNum: this.data.likeStatus == 1 ? this.data.likeNum - 1 : this.data.likeNum + 1
        })
      })
    },

    /**
     * 授权弹框回调处理
     */
    backHandle: function(data) {
      console.log('backHandle() : ');
      console.log(data);
      let tempUserInfo = data.detail.userInfo;
      this.setData({avatarUrl: tempUserInfo.avatarUrl,nickName: tempUserInfo.nickName});
    },

    //打开分享弹框
    shareBox: function(){
      this.setData({
        publishPopupShow: new Date().getTime(),
        videoShow: false,
      },()=>{
        this.triggerEvent('videoShow',this.data.videoShow);
      })
    },

    //关闭分享弹框
    closeBox: function(){
      this.setData({
        publishPopupHide: new Date().getTime(),
        videoShow: true
      },()=>{
        this.triggerEvent('videoShow',this.data.videoShow);
      })
    },

    // 防止移动阴影背后
    noMove: function(){},

    /**
     * 获取海报图，分享弹框回调处理事件
     */
    getBoardImage: function(e) {
      console.log('getBoardImage --------');
      this.shareHB();
    },

    //生成海报
    shareHB: function(){
      wx.showLoading({title: '加载中...',});
      var path = "";
      if(this.data.articleId){
        path = "subPackage/news/pages/news_detail/news_detail?action=goHome&id=" + this.data.newsId + "&userType=" + this.data.userType + "&originType=" + this.data.originType
      }else{
        if(this.data.originType == 3){
          if(this.data.page=="plate-article"){
            path = "subPackage/pay-plate/pages/article-info/article-info?action=goHome&id=" + this.data.newsId
          }else if(this.data.page=="plate-video"){
            path = "subPackage/pay-plate/pages/video-info/video-info?action=goHome&id=" + this.data.newsId
          }else if(this.data.page=="plate-file"){
            path = "subPackage/pay-plate/pages/file-info/file-info?action=goHome&id=" + this.data.newsId
          }
        }else{
          path = "subPackage/discover/pages/goods_detail/goods_detail?action=goHome&id=" + this.data.newsId + "&userType=" + this.data.userType
        }
      }
      console.log('path==' + path)
      console.log(imgUrl)
      var imgUrl = app.globalData.pcisHost + "xcx/platform/moment/qrcode/" + this.data.newsId + "/" + app.globalData.xcxId + "/" + app.globalData.openid + "/" + this.data.userType + "/" + Base64Encode(path) + '?time=' + new Date().getTime();
      var that = this;
      wx.request({
        url: imgUrl,
        method: "post",
        data: '',
        header: { 'content-type': 'application/json', codeVersion: app.globalData.codeVersion },
        success: function (datas) {
          console.log('datas=',datas);
          if(datas && datas.data.code == '000000'){
            that.setData({
              posterImgSrc: datas.data.data
            },()=>{
              wx.hideLoading();
              console.log('posterImgSrc = '+ that.data.posterImgSrc)
            })
          }
        },
        fail: function () {
          wx.hideLoading();
        }
      })

      this.setData({
        publishPopupHide: new Date().getTime(),
        posterShow: true,
        // posterImgSrc: [imgUrl]
      })
    },

    //关闭海报弹框
    posterBtn: function(){
      this.setData({
        publishPopupShow: new Date().getTime(),
        posterShow: false
      })
    },

    saveImage: function(e){
      var imageUrl = e.currentTarget.dataset.src;
      wx.previewImage({
        current: '',
        urls: [imageUrl]
      });
    },

  }
})
