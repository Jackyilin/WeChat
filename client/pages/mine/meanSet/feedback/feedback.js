var util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    syn: '',
    namenum: 1,
    openid: '',
    items: [
      { name: '1', value: '意见', checked: 'true' },
      { name: '2', value: '建议' },
      { name: '3', value: '投诉' },
      { name: '4', value: '举报' },
    ]
  },
  
  radioChange: function (e) {
    this.setData({
      namenum: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  getValue: function (e) {
    this.setData({
      syn: e.detail.value
    })
  },
  log: function () {
    var _this = this;
    wx.request({
      url: util.APP_HOST + '/my/sugsave',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        comment: _this.data.syn,
        user_oid: _this.data.openid,
        type: _this.data.namenum,
      },
      success: function (res) {
        console.log(res.data);
        console.log(_this.data.openid);            
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var globalData = app.globalData;
    app.openidReadyCallback = function (globalData)   {
      that.setData({
        openid: globalData.openid
      })
      console.log(that.data.openid);
    }
  }
})
