// pages/mine/setMeans/setMail/setMail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    syn: ''
  },
  getValue: function (e) {
    this.setData({
      syn: e.detail.value
    })
  },
  yes: function () {
    var _this = this;
    console.log(_this.data.syn);
    if (_this.data.syn) {
      wx.request({
        url: 'http://39.107.253.90:60001/wuser/insertwuser',
        method: 'POST',
        data: {
          companyInfo: _this.data.syn
        },
        success: function (res) {
          // console.log(res.data);
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateBack({

          })
        }
      })
    } else {
      wx.showModal({
        title: '输入错误',
        content: '不能为空',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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