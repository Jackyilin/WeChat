// pages/mine/recIntent/recIntent.js
var util = require('../../../utils/util.js');
var openid = wx.getStorageSync('openid');
Page({
  data: {
    notices: []
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: util.APP_HOST + `my/findcon?user_oid=${openid}`,
      method: 'get',
      success: function (res) {
        console.log(res.data.userList)
        that.setData({
          notices: res.data.userList
        })
      }
    })
  },
  call: function (e) {
    var tel = e.currentTarget.dataset.tel;
    console.log(tel);
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})