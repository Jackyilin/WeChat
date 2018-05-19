// pages/mine/means/status/status.js
var util = require('../../../../utils/util.js');
var openid = wx.getStorageSync('openid');
Page({
  data: {
    statu: ['粮点', '直属库', '贸易商', '经销商', '代理商', '面粉厂', '饲料厂', '淀粉厂', '米厂', '油厂', '养殖场', '粮库', '物流', '酒精厂', '粮油机械', '综合经营', '其他']
  },
  goReturn: function(e){
    var that = this;
    var index = e.currentTarget.dataset.id;
    wx.request({
      url: util.APP_HOST + 'wuser/updatewuser',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        openid: openid,
        identityStatus: that.data.statu[index]
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
  }
})