// pages/free/adress/adress.js
var util = require('../../../utils/util.js'); 
var openid = wx.getStorageSync('openid');
var giftId = wx.getStorageSync('giftId');
var giftName = wx.getStorageSync('giftName');
Page({
  data: {
    userName: '',
    userNumber: '',
    userAddress:"",
    userCode:'',
    id:"",
    areaInfo:'',
    region: ['黑龙江省', '哈尔滨市', '南岗区'],
    customItem: '全部',
    
  },
  toIndex:function(){
   wx.switchTab({
     url: '../free',
   })
    var that = this;
    // var linkman = that.data.userName;
     var phone = that.data.userNumeber;
    // var address = that.data.region.join(',') + that.data.userAddress;
    // var userCode = that.data.userCode;
    // console.log(that.data.userNumeber)
    wx.request({
      url: util.APP_HOST + `wplacereceipt/insertwplacereceipt`,
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      data:{
        // linkman: linkman,
        // phone: phone,
        // address: address,
        // openid:openid,
        // giftName:"aaa"

      },
      success:function(res){
        // console.log(res.data.phone)
      },
      fail:function(){
        console.log(111)
      }
    })
   
    // console.log(this.data.userNumber)
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      userNumber: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      userAddress: e.detail.value
    })
  },
  codeInput:function(e){
    this.setData({
      userCode: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    
  }


})