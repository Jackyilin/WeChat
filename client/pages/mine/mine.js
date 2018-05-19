var util = require('../../utils/util.js');
var openid = wx.getStorageSync("openid");
var login = wx.getStorageSync("flag");

console.log(login);
Page({
  data: {
    openid: '',
    id: '',
    status: '',
    wuser:[],
    login: false,
    ismember:''
  },
  ToPubInfo: function () {
    wx.navigateTo({
      url: "pubInfor/pubInfor",
    })
  },
  goWuyang: function () {
    wx.navigateTo({
      url: '../order/dredge/dredge',
    })
  },
  phoneUs: function () {
    wx.makePhoneCall({
      phoneNumber: '400-888-3008',
    })
  },
  onLoad: function (options) {
    var that=this;
    console.log(openid);
    wx.request({
      url: util.APP_HOST + 'wuser/selectwuserbyuserid?openid=' +openid,
      success(res){
        // console.log(res.data.wuser.ismember)
        that.setData({
          wuser: res.data,
          openid:openid,
          ismember: res.data.ismember
        });
        console.log(res.data.wuser[0].ismember);
      }
    })
    
  },
  onShow: function(){
    // 判断是否登录
    if (login == "yes") {
      this.setData({
        login: true
      })
    }
  },
  isLogin: function(){
    if(login){
      return true;
    }else{
      wx.showModal({
        title: '请先登录',
        content: '',
      })
      return false;
    }
    
  }
})