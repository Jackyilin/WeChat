var util = require('../../utils/util');
Page({
  data: {
    helpdata: {},
    choice:'',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  OnMyEvent: function (e) {
    var that = this;
    this.setData({
      areaInfo: e.detail,
      areaname: e.detail.areaname,
      provincesCode: e.detail.provincesCode,
      citysCode: e.detail.citysCode,
      areas: e.detail.areas
    })
  },
  change: function () {
    var that = this;
    var areaArr = that.data.areas;
    var areaname = that.data.areaname;
    for (var i = 0; i < areaArr.length; i++) {
      if (areaname == areaArr[i].name) {
        var idx = areaArr[i].code;
        wx.setStorageSync("areaCode", idx );
        console.log(idx)
        wx.navigateTo({
          url: '../help/helpmore/helpmore',
          success: function () {

          }
        })
      }
    }
  },
  showMore: function () {
    wx.navigateTo({
      url: '../help/showMore/showMore'

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.address = this.selectComponent("#address")
    this.address.gps();
    this.address.init();
    var that = this;
    wx.request({
      url: util.APP_HOST + 'wpovertypolicy/getallwpovertypolicy',
      success: function (res) {
        that.setData({
          helpdata: res.data.page.list
        });
        console.log(that.data.helpdata);
      }
    })
  }
})