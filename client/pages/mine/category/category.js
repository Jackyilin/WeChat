// pages/mine/category/category.js
var util = require('../../../utils/util.js');
Page({
  onLoad: function () {
    var that = this
    wx.request({
      url: util.APP_HOST + 'category/findall?level=1',
      method: 'get',
      success: function (res) {
        // console.log(res.data.categoryList)
        that.setData({
          category: res.data.categoryList
        })
      }
    })
  },
  data: {
    category: []
  }
})