// pages/free/exchange/exchange.js
var util = require('../../../utils/util.js'); 
var openid = wx.getStorageSync('openid');
Page({
  data:{
    array:[],
    needIntegral:'',
  },
  onLoad: function () {
    var that = this;
      wx.request({
      url: util.APP_HOST +'wcreditsexchange/getallwcreditsexchange',
        success: function (res) {
          that.setData({
            array: res.data.wcredits
          })
          console.log(res.data.wcredits)
        }
      }),

      wx.request({
        url: util.APP_HOST +`my/mypoint?user_oid=12345678`,
        success:function(res){
          console.log(openid)
          console.log(res)
          that.setData({
            myPoint: res.data.myPoint
          })
        }
      }),

      wx.request({
        url: util.APP_HOST + `wuser/selectwuserbyuserid?openid=35841`,
        success:function(res){
          console.log(res)
          that.setData({
            identity: res.data.wuser[0]
          })
          console.log(that.data.identity.wxHeadPottarat)

        }
      })      
  },
  myId:function(e){
    var index = e.currentTarget.dataset.id;
    var giftId = this.data.array[index].id;
    var giftName = this.data.array[index].giftName;
    var myPoint = this.data.myPoint;
    console.log(this.data.array)
    var needIntegral = this.data.array[index].needIntegral;
    console.log(needIntegral);
    if (myPoint > needIntegral){
      wx.showModal({
        title: '确认兑换',
        content: '',
        success: function (res) {
          if(res.confirm){
            wx.navigateTo({
              url: '../success/success',
            })
          }
          //console.log(openid);
          //console.log(this.data.array[index]);
          wx.request({
          url: util.APP_HOST + 'wcreditsexchange/countMyPoint',
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              giftName: giftName,
              user_oid: openid,
              needIntegral: needIntegral,
            },
            success: function (res) {
              console.log(res.data);
            }
            
          }),

          wx.setStorageSync("giftId", giftId);
          wx.setStorageSync("giftName", giftName);
         
        },
      })
    }else{
      wx.showModal({
        title: '积分不足',
        content: '',
      })
    }
    
    
  }
})