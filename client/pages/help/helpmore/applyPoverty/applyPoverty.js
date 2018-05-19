// pages/help/applyPoverty/applyPoverty.js
var util = require('../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addData: '',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    focusInputn: '',
    focusInputp: '',
    freeBusinessesList:[],
    tel: '',
    address: '',
    requirement: '',
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  ressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  demInput: function (e) {
    this.setData({
      requirement: e.detail.value
    })
  },
  submit: function () {
    var that=this
    wx.navigateTo({
      url: '../helpmore',
      

      
    })
    wx.request({
      url: util.APP_HOST + 'wpoverty/insertwpoverty',
      data: {
        poorName: that.data.addData,
        tel: that.data.tel,
        address: that.data.address,
        requirement: that.data.requirement,
        region:that.data.areaInfo
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    
    var that = this;
    wx.getStorage({
      key: 'addData',
      success: function (res) {
        console.log(res.data);
        that.setData({
          addData: res.data
        })
      },
    })
  },
  OnMyEvent: function (e) {
    var that = this;
    this.setData({
      areaInfo: e.detail,
      areaname: e.detail.areaname,
      provincesCode: e.detail.provincesCode,
      citysCode: e.detail.citysCode,
      areas: e.detail.areas,
      areaInfo:e.detail.areaInfo
    })
    console.log(that.data.areaInfo)
  },
  onLoad: function(){
    this.address = this.selectComponent("#address")
    this.address.gps();
    this.address.init();
  },
})