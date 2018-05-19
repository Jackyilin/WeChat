// pages/order/dredge/dredge.js
var util = require('../../../utils/util.js');
var arrAreas = [];
var index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    openod:'',
    name:'',//姓名
    phone:'',//手机号
    choice: '',//选择地区
    address: '',//详细地址
    currentTime: '60',//验证码倒计时
    time: '获取验证码',//说明
    identifying: '',//输入的验证码
    saveCode: '',//返回的验证码
    areaname: '',//地区名称
    provincesCode: null,//省编码
    citysCode: null,//市编码
    areas: null,//区对象
    areasCode: null//区编码
  },
  now: function(){
    wx.navigateBack({})
  },
  //获取输入的值
  nameValue:function(e){this.setData({name: e.detail.value})},
  phoneValue: function (e) {this.setData({phone: e.detail.value})},
  addressValue: function (e) {this.setData({address: e.detail.value})},
  identifyingValue:function(e){this.setData({identifying: e.detail.value})},
  //省市县编码
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
  //无央会员注册
  submit: function(){
    for (var i = 0; i < this.data.areas.length; i++) {
      arrAreas.push(this.data.areas[i].code)
      if (this.data.areas[i].name == this.data.areaname){
        index = arrAreas[i]
      }
    }    
    var that = this;
      if (this.data.name == ''){
        wx.showModal({
          title: '输入姓名为空',
          content: '请重新输入',
          showCancel: false//不显示取消按钮
        });
      } else if (this.data.phone == ''){
        wx.showModal({
          title: '输入手机号为空',
          content: '请重新输入',
          showCancel: false//不显示取消按钮
        });
      } else if (this.data.address == ''){
        wx.showModal({
          title: '输入地址为空',
          content: '请重新输入',
          showCancel: false//不显示取消按钮
        });
      } else {
        wx.request({
          url: util.APP_HOST + 'wuser/updatewuser',
          data: {
            openid: that.data.openid,//openid        
            username: that.data.name,//用户名
            tel: that.data.phone,//联系电话
            detailedAddress: that.data.address,//详细地址
            region1: that.data.provincesCode,//省编码
            region2: that.data.citysCode,//市编码
            region3: index,//区编码
            ismember: "1"
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              newflag: res.data.status
            })
            wx.showModal({
              title: '确定注册吗？',
              content: '如果确定请您点击注册',
              success: function (res) {
                if (res.confirm) {
                  console.log(that.data.openid)
                  wx.navigateTo({//点击确定的操作
                    url: '../../rich/login/login',
                    success: function(){
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) {
                        page.onShow();
                      }
                    }
                  })
                } else if (res.cancel) {//点击取消的操作
                  that.setData({
                    name: '',//姓名
                    phone: '',//手机号
                    address: '',//详细地址
                  })
                }
              }
            })
          }
        });
      }  
  },
  auth: function () {//发送验证码
    var that = this;
    if(this.data.phone.length == 11){
      wx.request({
        url: util.APP_HOST + 'customer/getVerifyCode',
        data: {
          phoneNumbers: that.data.phone,
          serviceAuthority: "1"
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            saveCode: res.data.verifyCode
          })
        }
      })
      var currentTime = that.data.currentTime;
      that.setData({
        time: ' 倒计时' + currentTime + '秒'
      })
      var timer = setInterval(function () {
        that.setData({
          time: ' 倒计时' + (currentTime - 1) + '秒'
        })
        currentTime--;
        if (currentTime <= 0) {
          clearInterval(timer)
          that.setData({
            time: '重新获取',
            currentTime: 60,
          })
        }
      }, 1000)
    }else{
      wx.showToast({
        title: '手机号错误',
      })
    }
  },
  //贸易商注册
  submitMerchant: function(){
    var that = this;    
    if (this.data.phone == '' || this.data.identifying == ''){//验证输入为空
      wx.showModal({
        title: '手机号或验证码为空',
        content: '请重新输入',
        showCancel: false//不显示取消按钮
      })
    }else{
      wx.request({
        url: util.APP_HOST + 'wuser/updatewuser',
        data: {
          openid: that.data.openid,//openid       
          tel: that.data.phone,//联系电话
        },
        method: 'POST',
        success: function (res) {
          wx.setStorage({
            key: 'flag',
            data: res.data.status
          })
          if (that.data.identifying == that.data.saveCode) {//判断输入的验证码与接口返回的验证码的值是否相同
            wx.showModal({
              title: '确定注册吗？',
              content: '如果确定请您点击注册',
              success: function (res) {
                if (res.confirm) {//点击确定的操作
                  wx.switchTab({
                    url: '../order',
                    success: function(e){
                      var page = getCurrentPages().pop();
                      if(page == undefined || page == null){
                        page.onShow();
                      }
                    }
                  })
                } else if (res.cancel) {//点击取消的操作
                  that.setData({
                    phone: '',
                    identifying: ''
                  })
                }
              }
            })
          } else {//验证码验证失败的操作
            wx.showModal({
              title: '验证码输入错误',
              content:'请重新输入',
              showCancel: false,//不显示取消按钮
              success: function () {
                that.setData({
                  phone: '',
                  identifying: ''
                })
              }
            })
          }
        }
      })
    }
  },
  swichTab: function(e){//查看详细显示相应数据信息
    var current = e.target.dataset.current;
    this.setData({
      currentTab: current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.address = this.selectComponent("#address");
    this.address.gps();
    this.address.init();
    //获取openid
    var openid = wx.getStorageSync("openid");    
    this.setData({
      openid: openid
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