// pages/order/showOrder/showOrder.js
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],//通过合作社id得到社员信息
    dataNum: [],//根据订单编号查询的信息
    region: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    var that = this;
    wx.request({
      url: util.APP_HOST + 'torder/selectbycooid?departmentId4=' + options.id,
      success: function(res){
        that.setData({
          data: res.data.users,
          region: options.region
        })
      }
    })
    wx.request({
      url: util.APP_HOST + 'torder/selectallaboutorder?orderId=110',
      success: function(res){
        that.setData({
          dataNum: res.data.tchemical[0]
        })
      }
    })
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