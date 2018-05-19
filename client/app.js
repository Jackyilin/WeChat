var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('utils/util.js')
App({
  globalData: {
    openid: '',
    nickName: '',
    avatarUrl: '',
    userInfo: null
  },
  onLaunch: function () {
    var that = this;
    qcloud.setLoginUrl(config.service.loginUrl)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //获取openid
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx10031d2233afbcba&secret=759c54e1f897391b2f9bfb07a0fb66fd&js_code=${res.code}&grant_type=authorization_code`,
            success(res) {
              console.log("获取openid成功！");
              //将openid存入storage
              wx.setStorageSync('openid', res.data.openid);
              that.globalData.openid = res.data.openid;
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }

})
