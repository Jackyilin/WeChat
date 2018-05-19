// pages/mine/means/personal/personal.js
var util = require('../../../../utils/util.js');
var openid = wx.getStorageSync("openid");
console.log(openid)
Page({
  data: {
    username: '',
    relName: '',
    tel: '',
    detailPlace: '',
    // picker
    areaInfo: '',
    areaname: '',
    provincesCode: '',
    citysCode: '',
    areas: [],
    areaCode: ''
  },
  onLoad: function (options) {
    this.address = this.selectComponent("#address")
    this.address.gps();
    this.address.init();
    // 获取用户名
    var that = this;
    wx.request({
      url: util.APP_HOST + `wuser/selectwuserbyuserid?openid=${openid}`,
      success: function (res) {
        console.log(res);
        that.setData({
          username: res.data.wuser[0].username
        })
      }
    })
  },
  // 组件方法
  cityCancel: function () {
    this.address.cityCancel()
  },
  citySure: function () {
    this.address.citySure()
    console.log(this.address.data)    
  },
  selectDistrict: function () {
    this.address.selectDistrict()
  },
  cityChange() {
    this.address.cityChange()
  },
  // 获取地区编码
  OnMyEvent: function (e) {
    // console.log(this.data.areaInfo)
    // console.log(this.data.areaname)
    // console.log(this.data.provincesCode)
    // console.log(this.data.citysCode)
    // console.log(this.data.areas)
    var areas = this.data.areas;
    var areaname = this.data.areaname;
    var areaCode = '';
    for (var i in areas){
      if (areaname == areas[i].name){
        areaCode = areas[i].code;
        // console.log(areaCode)
      }
    }
    this.setData({
      areaInfo: e.detail,
      areaname: e.detail.areaname,
      provincesCode: e.detail.provincesCode,
      citysCode: e.detail.citysCode,
      areas: e.detail.areas,
      areaCode: areaCode
    })
  },
  // 获取真实姓名
  saveName: function(e){
    this.setData({
      relName: e.detail.value
    })
    // console.log(this.data.relName)
  },
  // 获取联系电话
  saveTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
    // console.log(this.data.tel)
  },
  // 获取详细地址
  saveDetailPlace: function(e){
    this.setData({
      detailPlace: e.detail.value
    })
    // console.log(this.data.detailPlace)
  },
  // 提交
  submit: function(){
    var that = this;
    wx.request({
      url: util.APP_HOST + 'wuser/updatewuser',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        openid: openid,
        relName: that.data.relName,
        tel: that.data.tel,
        detailedAddress: that.data.detailedAddress,
        region1: that.data.provincesCode,
        region2: that.data.citysCode,
        region3: that.data.areaCode
      },
      success: function(res){
        console.log(res.data)
        wx.showToast({
          title: '成功',
          icon: 'success'
        })
        wx.navigateBack();
      }
    })
  },
  notice: function () {
    wx.showToast({
      title: '用户名不可更改',
      icon: "none"
    })
  }
})