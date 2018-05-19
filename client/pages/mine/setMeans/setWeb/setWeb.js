// pages/mine/setMeans/setMail/setMail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    web: ''
  },
  getValue: function (e) {
    this.setData({
      web: e.detail.value
    })
  },
  yes: function () {
    var _this = this;
    var reg = new RegExp('^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$')
    // return reg.test(this.email);
    console.log(reg.test(this.data.web));
    if (reg.test(this.data.web)) {
      wx.request({
        url: 'http://39.107.253.90:60001/wuser/insertwuser',
        method: 'POST',
        data: {
          companySites: _this.data.web
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
        content: '请输入正确网址',
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