// components/audio/audio.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type: Object, // 类型
      value:{},
      observer: function (newVal, oldVal) {
        // console.log('有了新值',newVal)
        if (newVal) {
          this.data.audioSl.src = newVal.img_urls
          this.setData({
            duration: Math.ceil(this.data.audioSl.duration)
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    audioSl:null, //音频实例
    progress:0, //播放进度
    start:false,  //播放状态
    duration:0, //音频长度
  },
  created: function () {
    this.data.audioSl = wx.createInnerAudioContext()
    this.data.audioSl.src = this.data.item.img_urls
    var setTime = null
    //监听播放
    this.data.audioSl.onPlay((e)=>{
      console.log('监听播放',e)
      this.setData({
        start:true
      })
      //每秒进度
      var tPress = (1 / this.data.audioSl.duration)*100
      setTime = setInterval(()=>{
        this.setData({
          progress: tPress+this.data.progress
        })
      },1000)
    })
    //监听暂停
    this.data.audioSl.onPause((e)=>{
      console.log('监听暂停',e)
      clearTimeout(setTime)
      this.setData({
        start: false
      })
    })
    //监听结束
    this.data.audioSl.onStop((e) => {
      console.log(e)
    })
    //监听错误
    this.data.audioSl.onError((e) => {
      console.log(e)
    })
  },
  attached:function(){
    setTimeout(() => {
      this.setData({
        duration: Math.ceil(this.data.audioSl.duration)
      })
    }, 200)
  },
  detached:function(){
    this.data.audioSl.destroy()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击播放
    playAudio:function(e){
      console.log('开始播放',e)
      this.data.audioSl.play()
    },
    //暂停播放
    pauseAudio:function(e){
      console.log('暂停播放', e)
      this.data.audioSl.pause()
    },
    //停止播放
    stopAudio:function(){

    }
  }
})
