//input.js
var utils = require('../../../../utils/util');
var openid = wx.getStorageSync('openid');
Page({
  data: {
    focus: false,
    hisOpenid: '',
    shuliang: '',
    zonge: '',

    fb_id:""
  },
  onLoad: function (options) {
    console.log(openid)
    
    console.log(options.fb_id);
    console.log(options);
    this.setData({
      fb_id: options.fb_id

    })
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  hisOpenid: function (e) {
    this.setData({
      hisOpenid: e.detail.value
    })
  },
  shuliang: function (e) {
    this.setData({
      shuliang: e.detail.value
    })
  },
  zonge: function (e) {
    this.setData({
      zonge: e.detail.value
    })
  },
  queren: function (e) {
    console.log("wwode "+ this.data.fb_id);
    console.log(e);
    var that = this
    wx.request({
      url: utils.APP_HOST + "freebusiness/savedetail",
      method: "POST",
      data: {
        user_oid: openid,
        trade_user_oid: that.data.hisOpenid,
        fb_id: that.data.fb_id,
        amount: that.data.shuliang,
        money: that.data.zonge,
        status:1
      },
      success: function (res) {
        console.log(openid)
        console.log(that.data.hisOpenid)
        console.log(that.data.fb_id)
        console.log(that.data.shuliang)
        console.log(res);
      }

    }),
      wx.switchTab({
        url: `../../mine`,
      })
  }
})