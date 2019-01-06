// components/audio-item/audio-item.js
var app = getApp();
Component({
  behaviors: [],
  options: {
  },
  data: {
    isfollow: false,
    isLikeDisabled: false,
    userId: '',
    classMap: {},
    userMap: {},
  },
  properties: { // 属性名
    item: {
      type: Object, // 类型 
    }
  },
  attached: function () {
    this.setData({
      userId: app.globalData.userInfo.id,
      classMap: app.globalData.classMap,
      userMap: app.globalData.userMap,
    })
  },
  methods: {
    /**
   * 长按复制
   */
    longpress: function () {

    },
  },

});
