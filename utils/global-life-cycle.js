var newPage=function (jsons) {
var J = Page;
let globalapp = {}
function lifeCycle(pageJson, event) {
    if (pageJson[event]) {
        var s = pageJson[event];
            pageJson[event] = function(pageJson) {
                s.call(this, pageJson);//继承父级

                if(event=="onLoad"){//监听onLoad事件
                    if(jsons&&jsons.onLoad){
                        jsons.onLoad(this,pageJson)
                    }
                }
                else if(event=="unLoad"){//离开页面
                    if(jsons&&jsons.unLoad){
                        jsons.unLoad()
                    }
                }

                else if(event=="onShow"){//展示的时候
                    if(jsons&&jsons.onShow){
                      jsons.onShow(this, globalapp)
                    }
                }
                else if(event=="onHide"){//隐藏的时候
                    if(jsons&&jsons.onHide){
                        jsons.onHide(this)
                    }
                }
                else if(event=="onReachBottom"){//向上加载更多
                    if(jsons&&jsons.onReachBottom){
                        jsons.onReachBottom(this)
                    }
                }
                else if(event=="onPullDownRefresh"){//下拉刷新
                    if(jsons&&jsons.onPullDownRefresh){
                      jsons.onPullDownRefresh(this, pageJson)
                    }
                }
                // else if(event=="onShareAppMessage"){//分享
                //     if(jsons&&jsons.onShareAppMessage){
                //         jsons.onShareAppMessage(this)
                //     }
                // }
            }
    }
    else {

    }
}
Page = function(pageJson) {
  globalapp = getApp()
    /**
     * 额外添加监听的生命周期
     */
    lifeCycle(pageJson, "onLoad");
    lifeCycle(pageJson, "unLoad");
    lifeCycle(pageJson, "onShow");
    lifeCycle(pageJson, "onHide");
    lifeCycle(pageJson, "onReachBottom");
    lifeCycle(pageJson, "onPullDownRefresh");
    // if (typeof pageJson["onShareAppMessage"] != "undefined") {
    //     lifeCycle(pageJson, "onShareAppMessage");
    // }
    /**
     * 执行当前页面的page方法,里面包含了各个生命周期
     */
    J({...pageJson,...jsons.methods});
}
};

/**
 * 一个简单的自定义事件库
 * wx.eventBus.on('事件名'，回调) //注册事件
 * wx.eventBus.trigger('事件名'，参数对象)
 */
var eventBus = {
  eventsMap: {},
  on: function (eventName, callback) {
    this.eventsMap[eventName] = callback
  },
  trigger: function (eventName, options) {
    if (!this.eventsMap[eventName]) {
      // throw new Error('没有此事件' + eventName)
      console.log('事件为定义 ' + eventName)
      return
    }
    this.eventsMap[eventName](options)
    return this;
  }
}

export { newPage, eventBus};