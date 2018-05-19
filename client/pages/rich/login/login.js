// pages/rich/login/login.js
var util = require('../../../utils/util.js');
Page({
  data: {
    // snsMsgWait:'',
    // snsCodeMsg:'获取验证码',
    usertelphone: '',
    usercode: '',
    currentTime: 60,
    time: '获取验证码'
  },
  userNameInput: function (e) {
    this.setData({
      usertelphone: e.detail.value
    })
    // console.log(this.data.usertelphone)
  },
  userCodeInput: function (e) {
    this.setData({
      usercode: e.detail.value
    })
    // console.log(this.data.usercode)
  },
  priBotton: function () {
    wx.navigateTo({
      url: '../../order/dredge/dredge',
    })
  },
  headerBack: function () {
    wx.switchTab({
      url: '../rich'
    })
  },
  index: function () {
    wx.switchTab({
      url: 'index/index'
    })
  },
  code: function () {
    var that = this;
    if (this.data.usertelphone.length != 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.request({
        url: util.APP_HOST + 'customer/getVerifyCode',
        data: {
          phoneNumbers: that.data.usertelphone
        },
        success: function (res) {
          console.log(res)
        }
      })
      // 倒计时
      var currentTime = that.data.currentTime;
      that.setData({
        time: currentTime + '秒'
      })
      var timer = setInterval(function () {
        that.setData({
          time: (currentTime - 1) +
          '秒'
        })
        currentTime--;
        if (currentTime <=
          0) {
          clearInterval(timer)
          that.setData({
            time: '重新获取',
            currentTime: 60,
            // disabled: false
          })
        }
      }, 1000)
    }
  },
  loginin: function () {
    var that = this;
    wx.request({
      url: util.APP_HOST + 'customer/login',
      data: {
        verifyCode: that.data.usercode,
        phoneNumbers: that.data.usertelphone
      },
      success: function (res) {
        console.log(res)
        if (res.data.returnMsg ==
          "验证码错误，请重新获取"
        ) {
          wx.showToast({
            title: '验证码错误',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.loginMsg ==
          "用户不存在!"
        ) {
          wx.showToast({
            title: '用户不存在',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.setStorage({
            key: 'flag',
            data: 'yes',
            success: function (res) {
              console.log(res)
            }
          }),
            wx.switchTab({
              url: '../../free/free',
              success: function () {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) {
                  page.onShow();
                }
              }

            })
        }
      }
    })
  }
})




