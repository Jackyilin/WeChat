var util = require('../../../utils/util.js');
Page({
  data: {
    total: '',
    openid: "",
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx10031d2233afbcba&secret=759c54e1f897391b2f9bfb07a0fb66fd&js_code=${res.code}&grant_type=authorization_code`,
            success: function (res) {
              that.setData({
                openid: res.data.openid
              })
              console.log(res.data.openid)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }),
      wx.request({
        url: util.APP_HOST + 'my/mypoint',
        data: {
          user_oid: that.data.openid,
        },
        success: function (res) {
          that.setData({
            total: res.data.myPoint
          })
        }
      })
  }
})