// components/release.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,
      value:''
    },
    artype:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump:function(){
      var url = '/pages/release/publish/publish?artype='
      switch(this.data.type){
        case '0':
          url = '/pages/release/aticle/aticle?artype='
          break
        case '1':
          url = '/pages/release/video/video?artype='
          break
        default:
          url = '/pages/release/publish/publish?artype='
      }
      wx.navigateTo({
        url: url + this.data.artype,
      })
    }
  }
})
