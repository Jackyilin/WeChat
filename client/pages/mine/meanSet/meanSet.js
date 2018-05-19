// pages/mine/meanSet/meanSet.js
var login = wx.getStorageSync("flag");
Page({
  data: {
    login: ''
  },
  clearCache:function(){
    // wx.clearStorage();
    wx.showModal({
      title: '清空缓存',
      content: '缓存清理完成',
      cancelText: '返回',
      confirmColor: '#1'
    })
  },
  logout: function () {
    wx.showModal({
      title: '注销账号',
      content: '是否退出当前账号',
      confirmColor: '#1AAD19',
      success: function(res){
        if(res.confirm){
          wx.removeStorageSync("flag");
          wx.navigateBack();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(login=="yes"){
      this.setData({
        login: true
      })
    }else{
        this.setData({
            login: false
        })
    }
    console.log(this.data.login);
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