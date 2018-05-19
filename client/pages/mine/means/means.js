// pages/mine/means/means.js
var util = require('../../../utils/util.js');
var openid = wx.getStorageSync('openid');
// console.log(openid);
Page({
  data: {
    //头像路径
    myPortrait: ''
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: util.APP_HOST + `wuser/selectwuserbyuserid?openid=${openid}`,
      success: function (res) {
        console.log(res);
        //如果用户上传过头像
        if (res.data.wuser[0] && res.data.wuser[0].headPortrait) {
          that.setData({
            myPortrait: "http://" + res.data.wuser[0].headPortrait
          })
        }else{
          // 否则加载微信头像
          that.setData({
            myPortrait: res.data.wuser[0].wxHeadPottarat
          })
        }
      }
    })
  },
  goPhoto: function () {
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 1, //最多可以选择1张图片
      success: function (res) {
        // console.log(res.tempFilePaths);
        var tempFilePaths = res.tempFilePaths
        //上传图片
        wx.uploadFile({
          url: util.APP_HOST + `wuser/updatewuser?openid=${openid}`,
          filePath: tempFilePaths[0],
          name: 'headPortraitFile',
          success: function (res) {
            console.log(res);
            that.setData({
              myPortrait: tempFilePaths[0]
            })
            wx.showToast({
              title: '成功',
              icon: 'success'
            })
          }
        })
      }
    })
  },
  goWuyang: function () {
    wx.showModal({
      title: '跳转到',
      content: '无央平台注册/登录',
      cancelText: '返回',
      confirmColor: '#1AAD19'
    })
  }
})
