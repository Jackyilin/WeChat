// pages/help/helpmore/helpmore.js
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: [],//已解决未解决接口返回的数据存储在这
    helpdata: [],//白皮书接口返回的数据存储在这
    date: util.now(new Date()),//获取当前时间戳
    active: 'active',//设置样式
    none: '',
    bol: true,
    bool: false,
    mask: false,
    true: '用户名或扶贫码存在',//用来与接口返回的数据的值进行判断
    false: '用户名或扶贫码不存在',//同上
    joincodec: 'join-code',//设置样式
    joincoden: 'join-code',//同上
    code: '',//扶贫码
    name: '',//姓名
    isHelpTime: [],//用来存储帮扶时间
    isFoundTime: [],//用来存储创建时间
    hiddenLeft: true,//已解决图片隐藏
    hiddenRight: true//未解决图片隐藏
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'addData',
      success: function (res) {
        var time = util.now(new Date());
        that.setData({
          addData: res.data
        })
      }
    })
  },
  //动态的更改扶贫码
  watchCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //动态的更改姓名
  watchName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 点击跳转验证成功页面
  verifySuccess: function (e) {
    var that = this;
    //验证是否为空或者是空格 trim方法用来去除前后空格
    if (this.data.code.trim() && this.data.name.trim()) {
      wx.setStorage({
        key: 'addData',
        data: this.data.name.trim(),
      })
      //验证成功之后发送数据给后台
      wx.request({
        url: util.APP_HOST + 'wpovertycode/selectwpcodecount',
        data: {
          code: that.data.code,
          name: that.data.name
        },
        method: 'GET',
        success: function (res) {
          // console.log(res.data);
          //如果验证之后用户名或者扶贫码存在，则进行跳转
          if (res.data.errmess == that.data.true) {//根据接口返回的数据errmess来判断是否进行跳转
            wx.navigateTo({
                url: 'applyPoverty/applyPoverty'
            })          
          }else if(res.data.errmess == that.data.false){
            wx.showModal({
              title: '验证失败',
              content: '您输入的扶贫码或姓名不存在',
              success: function(res){
                if(res.confirm){
                  that.setData({
                    code: '',
                    name: ''
                  })
                }else if(res.cancel){
                  console.log('用户点击取消');
                }
              }
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    } else {
      wx.showModal({
        title: '请重新输入',
        content: '扶贫码或姓名为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
          }
        }
      })
    }
  },
  // 当前日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    var assist = [];
    var create = [];
    for (var i = 0; i < this.data.data.length; i++) {
      assist.push(this.data.data[i].assistTime);//把扶贫时间取出来放入数组
      if (assist[i] == this.data.date) {//如果扶贫时间和选择时间相等
        this.setData({
          hiddenLeft: false
        })
      } else if (assist.indexOf(this.data.date) == -1) {//如果扶贫时间中不存在选择的时间
        this.setData({
          hiddenLeft: true
        })
      }
      create.push(this.data.data[i].createTime);//把创建时间取出来放入数组            
      if (create[i] == this.data.date) {
        this.setData({
          hiddenRight: false
        })
      } else if (create.indexOf(this.data.date) == -1) {//如果创建时间中不存在选择的时间
        this.setData({
          hiddenRight: true          
        })
      }
    }
    this.setData({
      isHelpTime: assist,
      isFoundTime: create
    })
  },
  //已解决
  closeok: function () {
    var active = 'active';
    var none = '';
    var bol = this.data.bol;
    var bool = this.data.bool;
    if (bool == true) {
      this.setData({
        bool: false,
        active,
        none
      })
    }
    if (bol == false) {
      this.setData({
        bol: true
      })
    }
  },
  //未解决
  closeno: function () {
    var active = '';
    var none = 'active';
    var bol = this.data.bol;
    var bool = this.data.bool;
    if (bool == false) {
      this.setData({
        active,
        none,
        bool: true
      })
    }
    if (bol == true) {
      this.setData({
        bol: false
      })
    }
  },
  joinin: function () {
    var mask = this.data.mask;
    this.setData({
      mask: true
    })
  },
  close: function () {
    var mask = this.data.mask;
    this.setData({
      mask: false
    })
  },
  //扶贫码
  focusInputc: function () {
    this.setData({
      code: ''
    })
  },
  focusInputn: function () {
    this.setData({
      name: ''
    })
  },
  //跳转回扶贫省页
  backhelp: function () {
    wx.switchTab({
      url: '../help',
    })
  },
  // 点击跳转扶贫个人信息
  presonal_poverty: function (e) {
    var that = this;
    wx.setStorage({
      key: 'key',
      data: that.data.data[e.target.dataset.set]
    })
    wx.navigateTo({
      url: 'povertyMessage/povertyMessage'
    })
  },
  //点击跳转扶贫政策
  showMore: function () {
    wx.navigateTo({
      url: '../showMore/showMore',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      //上方白皮书数据渲染
       var idx = wx.getStorageSync("areaCode");
      wx.request({
        url: util.APP_HOST + '/wpovertypolicy/getallwpovertypolicy?areaId='+idx,
        success: function (res) {
          var arr = [];
          arr.push(res.data.page.list);
          var arr1 = arr[0];
          var hdata = arr1.slice(0, 3)
          that.setData({
            helpdata: hdata
          });
        }
      })
      // 下方已解决未解决数据渲染
      wx.request({
        url: util.APP_HOST + 'wpoverty/getallwpoverty',
        success: function (res) {
          that.setData({
            data: res.data.page.list
          });
         
        }
      });
  }
})