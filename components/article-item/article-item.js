var app = getApp();

Component({
    behaviors: [],
    options: {
    },
    data: {
      showTipData: {//弱提示
        show: false,
        content: "网络连接失败"
      },
    },
    properties: { // 属性名
        shopList: {
          type: Array, // 类型 
          value:[
            {
              id:'111', //文章id
              title:'标题标题',
              type:1,
              content:'',
              comment:20, //评论数量
              like:40,  //点赞数量
              favorite:30,  //收藏数
              img_urls:'',
              user:{
                nickname:'天天',
                type:'老师'
              },  //发帖的用户信息
              articleInfo:{
                like:0, //自己是否点赞
                favorite:0, //自己是否收藏
              },
            }
          ]
        },
        shopDt: {
            type: Boolean //是否为平台门店的动态不是发现页的动态
        },
        tabList: {
            type: Object
        },
        haveData: {
            type: Boolean
        },
        scrollLeft: {
            type: Number
        }
    },
    methods: {
        seeShopMap: function (e) { //查看门店地图
            var item = e.currentTarget.dataset.item;
            var latitude = item.latitude;
            var longitude = item.longitude;
            var address = item.address;
            if (latitude > 0 && longitude > 0) {
                wx.openLocation({
                    //当前经纬度
                    latitude: latitude,
                    longitude: longitude,
                    //缩放级别默认28
                    scale: 28,
                    //位置名
                    name: "",
                    //详细地址
                    address: address
                })
            }
        },

        /*
        * 拨打电话
        * */
        contactHe: function (e) {
            app.addRecord();

            var tel = e.currentTarget.dataset.tel;
            if (tel) {
                wx.makePhoneCall({
                    phoneNumber: tel
                })
            }
        },
        /**
         * 私信ta
         */
        jumpPersonLetterHim: function (e) {
          
          var that = this;
          var index = e.currentTarget.dataset.index;
          var obj = that.data.shopList[index];
          var userId, avatar = obj.avatar, userName = obj.nickName;

          if (obj.userType == 2) { //付费门店
            userId = obj.orgId;

            wx.navigateTo({
              url: '/subPackage/person-card/pages/person-letter-org/person-letter-org?userId=' + userId + '&userName=' + userName + '&avatar=' + avatar
            });
          }
          else {
            //其他为用户和免费入驻门店
            userId = obj.publishBy;

            if (obj.openId == app.globalData.openid) {
              wx.showModal({
                content: '不支持给自己发私信',
                confirmText: '我知道了',
                showCancel: false
              });
              return;
            }

            wx.navigateTo({
              url: '/subPackage/person-card/pages/person-letter-him/person-letter-him?userId=' + userId + '&userName=' + userName + '&avatar=' + avatar
            });
          }
        },

        /**
         * 跳转到详情页
         */
        jumpNextPage: function (e) {
            var id = e.currentTarget.dataset.id;
            var userType = e.currentTarget.dataset.usertype;
            var orgId = e.currentTarget.dataset.orgId;
            var isNews = e.currentTarget.dataset.isNews;
            let url = '';

            if (!userType) userType = 1;

            if (isNews) {
                url = `/subPackage/news/pages/news_detail/news_detail?id=${id}&originType=2&userType=` + userType;
            } else {
                url = "/subPackage/discover/pages/goods_detail/goods_detail?id=" + id + "&userType=" + userType + "&orgId=" + orgId;
            }

            wx.navigateTo({ url });
        },

        /**
         * 点赞
         */
        onPraise: function (e) {
            if (e.detail.formId) {
                app.submitFormIdM(e.detail.formId, app.globalData.orgId)
            }
            var myEventDetail = { // detail对象，提供给事件监听函数
                index: e.currentTarget.dataset.index,
                momentId: e.currentTarget.dataset.momentId,
                userType: e.currentTarget.dataset.userType,
                likeStatus: e.currentTarget.dataset.likeStatus,
                likeId: e.currentTarget.dataset.likeId
            };
            var myEventOption = {}; // 触发事件的选项
            this.triggerEvent('praise', myEventDetail, myEventOption)

        },

        /*
        * 展开
        * */
        onSpread: function (e) {
            if (e.detail.formId) {
                app.submitFormIdM(e.detail.formId, app.globalData.orgId)
            }
            var myEventDetail = { // detail对象，提供给事件监听函数
                index: e.currentTarget.dataset.index, // 当前下标
                descrIsHide: e.currentTarget.dataset.descrIsHide, // 当前下标
            };
            var myEventOption = {}; // 触发事件的选项
            this.triggerEvent('spread', myEventDetail, myEventOption)

        },
        /**
       * 跳转门店页面
       */
        jumpToShop: function (e) {
            app.submitFormIdM(e.detail.formId, app.globalData.orgId);
            var userType = parseInt(e.currentTarget.dataset.type);
            var isCreated = parseInt(e.currentTarget.dataset.isCreated);
            var publishBy = parseInt(e.currentTarget.dataset.publishBy);
            var url = '';
            var dataset = e.currentTarget.dataset;
            if (userType == 2) { // 付费门店
                var orgId = dataset.orgid;
                url = '/subPackage/message/pages/pages/charge_shop_detail/charge_shop_detail?orgId=' + orgId + '&page=discover';
            }
            else if (isCreated == 2) { // 已创建名片
                url = '/subPackage/person-card/pages/person-card-detail/person-card-detail?isCreated=' + isCreated + '&userId=' + publishBy;
            }
            else if (isCreated == 1) { // 未创建名片
                url = '/subPackage/person-card/pages/person-card-detail/person-card-detail?isCreated=' + isCreated + '&userId=' + publishBy;
            }
            wx.navigateTo({
                url: url
            });
        },
        /**
       * 长按复制
       */
        longpress: function () {

        },
        /**
 * 提交表单id
 */
        submitFormId: function (e) {
            app.submitFormIdM(e.detail.formId, app.globalData.orgId)
        }
    },

});