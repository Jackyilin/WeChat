//index.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
// 获取openid
var openid = wx.getStorageSync("openid");
Page({
  data: {
    motto: '点击头像进入',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this;
    // 存储用户信息
    wx.setStorageSync("nickName", that.data.userInfo.nickName)
    wx.setStorageSync("avatarUrl", that.data.userInfo.avatarUrl)
    // 注册
    wx.request({
      url: util.APP_HOST + `customer/register?openid=${openid}`,
      success: function (res) {
        wx.request({
          url: util.APP_HOST + 'wuser/updatewuser',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            openid: openid,
            username: that.data.userInfo.nickName,
            wxHeadPottarat: that.data.userInfo.avatarUrl,
            personalIdentity: "1"
          },
          success: function (res) {
            // console.log(that.data.userInfo.nickName);
            // console.log(that.data.userInfo.avatarUrl);
          }
        })
      }
    })
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
              console.log(res.data.openid);
              //将openid存入storage
              wx.setStorageSync('openid', res.data.openid);
            }
          })
        }
      }
    })
    wx.switchTab({
      url: '../free/free',
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      var that = this;
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log("获取用户信息成功!")
    // 获取用户信息成功
    if (e.detail.rawData) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      
    }
  }
})
