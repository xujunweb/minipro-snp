// components/likeCom/likeCom.js
import { articleLike } from '../../api/article.js'
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    height:{
      type:Number,
      value:50,
    },
    border:{
      type:Boolean,
      value:false,
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
    /**
     * 点击点赞
     */
    likeChange: function (e) {
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
        reClick: true
      });
      var is_like = '0'
      if (!this.data.item.articleInfo || this.data.item.articleInfo.like == '0'){
        is_like = '1'
      }
      articleLike({
        is_like: is_like,
        article_id: this.data.item.id,
        user_id: app.globalData.userInfo.id
      }).then((res) => {
        wx.showToast({
          title: '操作成功'
        })
        if (!this.data.item.articleInfo){
          this.data.item.articleInfo = {
            like: is_like
          }
        }else{
          this.data.item.articleInfo.like = is_like
        }
        this.data.item.like = is_like != 1 ? this.data.item.like - 1 : this.data.item.like + 1
        this.setData({
          reClick: false,
          isLikeDisabled: false,
          item: this.data.item
        })
      })
    },
  }
})
