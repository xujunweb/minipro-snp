
let app = getApp()
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
    // 是否需要触发调用组件，进行授权成功后的回调处理
    isCallBack:{
      type: Boolean,
      value: false,
    }
  },
  data: {
    isClose: false, // 是否关闭弹框
  },
  methods: {
    /**
     * 隐藏自定义授权弹框
     */
    hideAlert: function () {
      this.setData({ isClose: false })
    },
    /**
     * 点击我知道了按钮
     */
    getUserInfo: function (e) {
      if (e.detail.userInfo) {
        app.globalData.isCouldAuth = 1; //标记用户点击允许授权
        let tempUserInfo = { 
          ...app.globalData.userInfo, 
          nickname: e.detail.userInfo.nickName, 
          avatar: e.detail.userInfo.avatarUrl,
        }
        // app.updataUser(tempUserInfo);
        this.chooseType(tempUserInfo)
        this.closePopup();
        if (this.data.isCallBack) {
          this.triggerEvent('backhandle', { userInfo: e.detail.userInfo }, {});
        }
      } else { //用户点击了拒绝
        // this.closePopup();
        this.triggerEvent('backhandle', { userInfo: { avatarUrl: "", nickname: "微信用户" } }, {});
        app.globalData.isCouldAuth = 2; //标记用户点击拒绝授权
      }
      // app.globalData.showGetUserInfoAlert = false; //拒绝之后不再显示授权弹框
    },
    // 设置是否关闭弹框
    setDataValue: function (value) {
      this.setData({ isClose: value })
    },
    //选择身份
    chooseType: function (tempUserInfo){
      wx.showActionSheet({
        itemList:['教师','家长','学生','头条用户(默认)'],
        itemColor:'#9da3f1',
        success:(res)=>{
          console.log(res.tapIndex)
          app.updataUser({ ...tempUserInfo, type:''+ res.tapIndex})
        },
        fail:()=>{
          app.updataUser({ ...tempUserInfo, type: '3' })
        }
      })
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
    /**
     * 是否需要判断弹窗
     */
    isAuthorize:function(){
      app.isAuthorize(true).then((res)=>{
        if (!res) { this.showPopup()}
      })
    }
  },
  created:function(){
      // console.log("组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData")
  },
  attached:function(){
      // console.log("组件生命周期函数，在组件实例进入页面节点树时执行")
    this.isAuthorize()
  },
  ready:function(){
      // console.log("组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息")
  }
});