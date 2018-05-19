// pages/free/buy/buy.js
var util = require('../../../utils/util.js');
// 获取openid
var openid = wx.getStorageSync("openid");
// console.log(openid);
Page({
  data: {
    collectStatus: false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    hourMinute: '',
    num: 1,
    // 商品信息
    goods: {},
    // 商品图片
    imgsUrl: [],
    // 卖家信息
    seller: {},
    // 卖家openid
    openId: '',
    // 推荐商品
    recommend: []
  },
  onLoad: function (options) {
    var fb_id = options.fb_id;
    var that = this;
    // 调用函数时，传入new Date()参数，返回值是日期和时间 
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据 
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var hourMinute = hour + ':' + minute;
    this.setData({
      time: time,
      hourMinute: hourMinute
    });
    // 查询商品
    wx.request({
      url: util.APP_HOST + `freebusiness/findfreebus?fb_id=${fb_id}`,
      success: function (res) {
        that.setData({
          goods: res.data.freeBusinessesList[0],
          openId: res.data.freeBusinessesList[0].user_oid,
          imgsUrl: res.data.freeBusinessesList[0].fbResourceList
        })
        console.log(res.data.freeBusinessesList[0].user_oid)
        console.log(that.data.openId)
        // 查询推荐
        wx.request({
          url: util.APP_HOST + `/freebusiness/findfreebus?category=${that.data.goods.category}`,
          success: function (res) {
            that.setData({
              recommend: res.data.freeBusinessesList.reverse()
            })
            // console.log(res.data.freeBusinessesList)
          }
        })
        // console.log(that.data.goods)  
        // 查询卖家
        wx.request({
          url: util.APP_HOST + `wuser/selectwuserbyuserid?openid=${that.data.openId}`,
          success: function (res) {
            that.setData({
              seller: res.data.wuser[0]
            })
            console.log(that.data.seller)
          }
        })      
      }
    })
  },
  onShow() {
    var that = this
    that.setData({
      num: that.data.num
    })
  },
  //拨打客服电话
  callService: function () {
    wx.makePhoneCall({
      phoneNumber: '400-400-XXXX',
    })
  },
  //拨打卖家电话
  callSeller: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.seller.tel
    })
  },
  points: function () {
    wx.showModal({
      title: '',
      content: '请确认订单是否完成',
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  tohome: function () {
    var openId = this.data.openId;
    wx.navigateTo({
      url: `../../mine/home/home?openid=${openId}`,
    })
  },
  
  tocollect: function () {

    var that = this;
    var info = wx.getStorageSync("key");
    var openId = that.data.openId;
    var fb_id = that.data.goods.fb_id;
    var fav = {
      'openid': openId,
      'fb_id': fb_id,
    };
    that.setData({
      num: that.data.num + 1
    })
    console.log(that.data.num)
    if (that.data.num % 2 == 0) {
      wx.request({
        url: util.APP_HOST + `my/favsave?user_oid=${openid}`,
        method: 'POST',
        data: fav,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(JSON.stringify(res.data));
        }
      })
    } else {
      wx.request({
        url: util.APP_HOST + `my/favdelete?user_oid=${openid}&fb_id=${fb_id}`,
        method: "POST",
        success: function (res) {
          console.log(res);
        }
      })
    };
    wx.showToast({
      title: that.data.num % 2 == 0 ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'success',
      mask: true
    })

  },
  toBuy: function (e) {
    // 添加到历史
    var that = this;
    var fb_id = e.currentTarget.dataset.fb;
    // console.log(fb_id)
    var his = e.currentTarget.dataset.history;
    wx.request({
      url: util.APP_HOST + 'my/hissave',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        fb_id: fb_id,
        user_oid: openid
      },
      success: function (res) {
        // console.log(res.data);
      }
    })
    // 跳转至买家详情
    wx.navigateTo({
      url: `../buy/buy?fb_id=${fb_id}`,
    })
  },
  tosellers: function (e) {
    // 添加到历史
    var that = this;
    var fb_id = e.currentTarget.dataset.fb;
    // var his = e.currentTarget.dataset.history;
    // console.log(his)
    wx.request({
      url: util.APP_HOST + 'my/hissave',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        fb_id: fb_id,
        user_oid: openid
      },
      success: function (res) {
        // console.log(res.data);
      }
    })
    // 跳转至卖家详情
    wx.navigateTo({
      url: `../sellers/sellers?fb_id=${fb_id}`,
    })
  }
})