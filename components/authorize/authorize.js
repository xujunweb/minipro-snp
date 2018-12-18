Component({
  properties: { // 属性名
    onShow: {//显示
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal) {
          // this.onShow()
          this.setDataValue(true)
        }
      }
    },
  },
  data: {
    orgId: '', //orgId
    showTipData: { // 弱提示
      show: false,
      content: "网络连接失败"
    },
    isClose: false, // 是否关闭弹框
    isCallBackHandle: false, // 是否需要触发调用组件，进行授权成功后的回调处理
  },
  methods: {
    /**
     * 隐藏自定义授权弹框
     */
    hideAlert: function () {
      var that = this;
      that.setData({ isClose: false })
    },
    /**
     * 点击我知道了按钮
     */
    getUserInfo: function (e) {
      if (e.detail.userInfo) {
        app.globalData.isCouldAuth = 1; //标记用户点击允许授权
        let tempUserInfo = app.globalData.userInfo;
        tempUserInfo = Object.assign({}, tempUserInfo, e.detail.userInfo);
        app.newSaveUserInfo(tempUserInfo);
        this.closePopup();
        if (this.data.isCallBackHandle) {
          this.triggerEvent('backhandle', { userInfo: e.detail.userInfo }, {});
        }
      } else { //用户点击了拒绝
        this.closePopup();
        this.triggerEvent('backhandle', { userInfo: { avatarUrl: "", nickName: "微信用户" } }, {});
        app.globalData.isCouldAuth = 2; //标记用户点击拒绝授权
      }
      // app.globalData.showGetUserInfoAlert = false; //拒绝之后不再显示授权弹框
    },
    // 设置是否关闭弹框
    setDataValue: function (value) {
      this.setData({ isClose: value })
    },

    /**
     * 点击弹框内容区域
     */
    showPopup: function () {
      this.setData({ isClose: true })
    },

    /**
     * 点击弹框阴影区域
     */
    closePopup: function () {
      this.setData({ isClose: false })
    },
    //判断服务器是否有用户信息
    isUserInfor() {
      app.userInfoMiddleWare().then(data => {
        if (!data.isGetUserInfo) {
          let timestamp = new Date().getTime();
          this.setData({ onShow: timestamp });
        }
      })
    }
  },
  created:function(){
      // console.log("组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData")
  },
  attached:function(){
      // console.log("组件生命周期函数，在组件实例进入页面节点树时执行")
  },
  ready:function(){
      // console.log("组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息")
  }
});