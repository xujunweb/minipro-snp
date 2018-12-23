var app = getApp();
var sharePopupFn = Behavior({
  behaviors: [],
  properties: {
    onShow: {//显示
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        console.log(newVal + '子组件显示')
        if (newVal) {
          let that = this;
          this.setData({
            shareShow: true
          },() => {
            that.onShow();
          });
        }
      }
    },
    onHide: {//隐藏
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        console.log(newVal + '子组件隐藏')
        if (newVal) {
          this.setData({
            shareShow: false
          });
        }
      }
    },
    params: { // 页面传参
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        console.log('share-popup-fn.js:       params= ', newVal);
        if (newVal) {
          let tmpParams = newVal;
          tmpParams["shareText"] = newVal.shareText ? newVal.shareText : '分享到群';
          this.setData({
            params: tmpParams
          });
        }
      }
    }
  },
  data: {
    params: {
      title: {
        text1: '', //第一行文案
        text2: '', //第二行文案
      }, //顶部文案
      shareText: '', //分享文案
      isCallBack: false, //是否需要回调
      calllBackName: '', //回调事件名
    }, //传递数据
    isIPhoneX: false, //标记是否为iPhoneX手机
    shareShow: false, //是否显示弹框
  },
  methods: {
    onShow: function() {
      this.getIsPhone();
    },
    // 防止移动阴影背后
    noMove: function () {},
    // 是否为iPhoneX手机（iPhoneX手机特别处理底部）
    getIsPhone: function() {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          if (res && res.model.indexOf('iPhone X') > -1) {
            that.setData({ isIPhoneX: true });
          }
        },
      });
    },
    //关闭分享弹框
    closeBox: function () {
      this.setData({
        shareShow: false
      });
    },
    //生成海报
    shareHB: function () {
      let that = this;
      that.setData({
        shareShow: false
      },() => {
        console.log('that.data.params=',that.data.params);
        if(that.data.params.isCallBack) {
          that.triggerEvent(that.data.params.calllBackName, {}, {});
        }
      });
    },
  },
  ready: function () {
  }
});
export { sharePopupFn }