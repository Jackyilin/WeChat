// pages/help/showMore/showMore.js
var util = require('../../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  iknow:function(){
    wx.navigateBack({
      
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: util.APP_HOST + 'wpovertypolicy/getallwpovertypolicy',
      success: function (res) {
        // console.log(r);
        that.setData({
          helpdata: res.data.wPovertyPolicys
        });
      }
    })
  }
})
