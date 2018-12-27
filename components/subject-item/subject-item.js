// components/subject-item/subject-item.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object, // 类型 
      value: {
        id: '111', //文章id
        title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
        type: 1,
        content: '你是谁呢？',
        comment: 20, //评论数量
        like: 40,  //点赞数量
        favorite: 30,  //收藏数
        img_urls: '',
        user: {
          nickname: '天天',
          type: '老师'
        },  //发帖的用户信息
        articleInfo: {
          like: 0, //自己是否点赞
          favorite: 0, //自己是否收藏
        },
      }
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
       * 跳转到详情页
       */
    jumpNextPage: function (e) {
      wx.navigateTo({
        url: '/pages/detail/subject/subject?id=' + this.data.item.id
      });
    },
  }
})
