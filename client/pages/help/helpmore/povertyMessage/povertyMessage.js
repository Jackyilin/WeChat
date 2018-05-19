// pages/help/helpmore/povertyMessage/povertyMessage.js
Page({
  /**
   * 页面的初始数据
   *  new Axja
   */
  data: {
    data: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'key',
      success(res) {
        that.setData({
          data: res.data
        })
      }
    })
  }
})