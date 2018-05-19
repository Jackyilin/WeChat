// pages/rich/rich.js
var util = require('../../utils/util.js');
var openid = wx.getStorageSync("openid");
console.log(openid)
Page({
  data: {
    isLogin: false,
    // add
    // richRule: [],
    hiddenData: true,
    objectRich: [],
    navbar: ['致富光荣榜', '我要致富'],
    currentTab: 0,
    // myrich
    myrich: {
      real: false,
      cofco: false,
      service: false,
      person: false,
      realName: '',
      realphoto: '',
      richRuleShow: false,
      textDisabled: false,
      suggetionContent: "",
      defaultContent: "",
      //传过来的数据
      myWtorich: null
    },
    // suggetionContent: "",
    multiIndex: [0, 0, 0],
    date: '2016-09-01',
    time: '12:01',
    region: ['黑龙江省', '哈尔滨市', '南岗区'],
    customItem: '全部',
  },
  // 地点
  bindFormSubmit(e) {
    var that = this;
    var str = "myrich.suggetionContent"
    // 获取需求
    var suggestion = e.detail.value.suggestion;
    this.setData({
      [str]: ""
    });
    wx.request({
      url: util.APP_HOST + 'wtorich/updatewtorich',
      method: 'POST',
      data: {
        userOid: 88888,
        requirement: suggestion
      },
      success(res) {
        wx.showModal({
          title: '提交成功...'
        })
        console.log(res)
      }
    })
    console.log(1)
  },
  // 弹出框的显示隐藏
  hideRichRule() {
    var richRuleShow = true;
    var textDisabled = true;
    this.setData({
      ["myrich.richRuleShow"]: richRuleShow,
      ["myrich.textDisabled"]: textDisabled
    });
  },
  textareaBlur(e) {
    var suggetionContent = e.detail.value;
    this.setData({
      ['myrich.suggetionContent']: suggetionContent
    });
  },
  showRichRule() {
    var richRuleShow = false;
    var textDisabled = false;
    this.setData({
      ["myrich.richRuleShow"]: richRuleShow,
      ["myrich.textDisabled"]: textDisabled
    });
  },
  navbarTap: function (e) {
    var that = this;
    //获取数据的key
    var res = wx.getStorageSync('flag');
    console.log(res);
    if (res == "yes") {
      that.setData({
        isLogin: true
      })
    } 
    console.log(this.data.isLogin);
    // 是否登录
    //真为不跳转 假跳转到登录页面
    if (this.data.isLogin == false) {
      if (e.currentTarget.dataset.idx == 1) {
        wx.navigateTo({
          url: './login/login',
        })
      }
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.idx
      })
      // 个人身份  add
      wx.request({
        url: util.APP_HOST + 'wuser/selectwuserbyuserid',
        method: 'get',
        data: {
          openid: openid,
        },
        success: function (res) {
          console.log(res)
          that.setData({
              ["myrich.realName"]: res.data.wuser[0].username,
            ["myrich.realphoto"]: res.data.wuser[0].wxHeadPottarat,
          });
          if (res.data.wuser[0].personalIdentity != null) {
            that.setData({
              ["myrich.person"]: true,
            });
          }
          if (res.data.wuser[0].realNameIdentity != null) {
            that.setData({
              ["myrich.real"]: true,
            });
          }
          if (res.data.wuser[0].touristIdentity != null) {
            that.setData({
              ["myrich.cofco"]: true,
            });
          }
          if (res.data.wuser[0].serviceIdentity != null) {
            that.setData({
              ["myrich.service"]: true,
            });
          }
          // console.log(that.data.myrich.myWtorich)
        }
      })
    }
  },
  bindRegionChange: function (e) {
    var that = this;
    this.setData({
      region: e.detail.value
    })
    console.log(e.detail.value[0]);
    console.log(e.detail.value[1]);
    console.log(e.detail.value[2]);
    wx.request({
      url: 'http://39.107.253.90:60001/wtorich/getallbyregion',
      data: {
        region1: e.detail.value[0].substring(0, e.detail.value[0].length - 1),
        region2: e.detail.value[1].substring(0, e.detail.value[1].length - 1),
        region3: e.detail.value[2]
      },
      success: function (res) {
        if (res.data.wtorich.length != 0) {
          that.setData({
            objectRich: res.data.wtorich,
            hiddenData: false
          })
        } else {
          that.setData({
            hiddenData: true,
            objectRich: null,
          })
        }
      }
    })
  },
  catch: function () {
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: util.APP_HOST + 'wtorichrule/getallwtorichrule',
      method: 'get',
      success: function (res) {
        // console.log(res)
        that.setData({
          ["myrich.myWtorich"]: res.data.wtorichrule,
        });
        // console.log(that.data.myrich.myWtorich)
      }
    })
    // 页面加载
    wx.request({
      url: util.APP_HOST + 'wtorich/getallbyregion',
      data: {
        region1: this.data.region[0].substring(0, this.data.region[0].length - 1),
        region2: this.data.region[1].substring(0, this.data.region[1].length - 1),
        region3: this.data.region[2]
      },
      method: 'get',
      success: function (res) {
        // console.log(res.data.wtorich.length);
        if (res.data.wtorich.length != 0) {
          that.setData({
            hiddenData: false,
            objectRich: res.data.wtorich
          })
        } else {
          that.setData({
            hiddenData: true
          })
        }
      }
    })
  },
})