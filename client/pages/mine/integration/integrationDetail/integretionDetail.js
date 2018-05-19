// pages/mine/integration/integrationDetail/integretionDetail.js
var util = require('../../../../utils/util.js');
var app = getApp();
var openid = wx.getStorageSync('openid');
console.log(openid);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:1,
    detail:[],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据 
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hourMinute = hour + ':' + minute;
    var nyr = year +'-' + month + '-' +day;
    this.setData({
      time: time,
      hourMinute: hourMinute,
      nyr : nyr,
    });
    console.log(this.data.nyr);

    var that = this;
    var globalData = app.globalData;
    app.openidReadyCallback = function (globalData) {
      that.setData({
        openid: globalData.openid
      })
      console.log(that.data.openid);
    }

    wx.request({
      url: util.APP_HOST+`my/pointdetail?user_oid=${openid}`,
            
      method: 'get',
      success: function(res) {
        console.log(res.data)
        that.setData({
          detail: res.data.myPoint
        })
        console.log(that.data.detail)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})