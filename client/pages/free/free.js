// pages/free/free.js
var iutil = require('../../utils/util.js');
var util = require('../free/getTime.js');
// 获取openid
var openid = wx.getStorageSync("openid");
console.log(openid);
Page({
  data: {
    // 推荐列表
    recommend:[],
    // 即时列表
    realTime: [],
    // 历史列表
    history: [],
    // 买列表
    buy: [],
    // 卖列表
    sell: [],
    //
    swiper: [{
      "url": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524479692029&di=12b6f1843b0a4dd0c66bf4e4e40b86e0&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Ddf48815fa7345982d187edd1649d5bd8%2Fb3b7d0a20cf431ad837a56124136acaf2edd9874.jpg"
    }, {
      "url": "http://pic.58pic.com/58pic/15/39/36/99j58PICCF7_1024.jpg"
    }, {
      "url": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524479796086&di=32b72341eb4dd52d76d4550eb9257ec3&imgtype=0&src=http%3A%2F%2Fpic32.photophoto.cn%2F20140818%2F0035035646153001_b.jpg"
    }],
    // 当前选中的swiper
    currentTab: 0,
    date: '2016-09-01',
    time: '12:01',
    region: ['黑龙江'],
    customItem: '全部',
    // multiArray保存品类picker的列数据
    multiArray: [[], []],
    // multiIndex保存品类picker的每列选择的下标
    multiIndex: [0, 0],
    // multiData保存品类picker的每列选择的内容
    multiData: ['',''],
    // userid保存openid
    userid:[]
  },
  onLoad: function (options) {
    var that = this;
    // 获取当前时间
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });

    wx.showLoading({
      title: '加载中',
    })


    // 查询推荐
    wx.request({
      url: iutil.APP_HOST + 'freebusiness/findfreecate',
      success: function (res) {
        that.setData({
          recommend: res.data.freeBusinessesList.reverse()
        })
        console.log(res.data.freeBusinessesList)
        wx.hideLoading();
      }
    });
    // 加载品类picker
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    wx.request({
      url: iutil.APP_HOST + 'category/findall?level=1',
      success: function (res) {
        var arrays = res.data.categoryList;
        var array = [];
        for (var i in arrays) {
          array.push(arrays[i]['category_name']);
        }
        // data.multiArray[0]保存level=1的品类名称
        data.multiArray[0] = array;
        that.setData(data);
      }

    }),
      // data.multiArray[1]默认保存分类为水果的level=2的品类名称
      wx.request({
        url: iutil.APP_HOST + 'category/findbyparent?category_name=水果',
        success: function (res) {
          var arrays = res.data.categoryList;
          var array = [];
          for (var i in arrays) {
            array.push(arrays[i]['category_name']);
          }
          data.multiArray[1] = array;
          that.setData(data);
        }
      })
  },
  //品类picker更改列值事件
  bindMultiPickerColumnChange: function (e) {
    // e.detail.column表示当前更改的列的下标
    // e.detail.value表示当前列选中的下标
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      multiData: this.data.multiData
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    data.multiData[e.detail.column] = data.multiArray[e.detail.column][e.detail.value];
    // 每次修改1级品类，都要请求相应的2级品类
    if (e.detail.column == 0) {
      var that = this;
      var category = data.multiArray[0][e.detail.value];
      wx.request({
        url: iutil.APP_HOST + 'category/findbyparent?category_name=' + category,
        success: function (res) {
          var arrays = res.data.categoryList;
          // array数组保存请求的2级品类名称
          var array = [];
          for (var i in arrays) {
            array.push(arrays[i]['category_name']);
          }
          data.multiArray[1] = array;
          // 重新渲染品类picker
          that.setData(data);
        }
      })
    }
    // 给当前页数据赋值
    this.setData(data);
  },
  //品类picker确定事件
  bindMultiPickerChange: function (e) {
    // 根据选中的品类名称重新请求自由买卖列表
    var category = this.data.multiData[1];
    var that = this;
    wx.request({
      url: iutil.APP_HOST + 'freebusiness/findfreebus?category=' + category,
      success: function (res) {
        that.setData({
          realTime: res.data.freeBusinessesList
        })
      }
    })
  },
  //地区picker确定事件
  bindRegionChange: function (e) {
    var region = e.detail.value.join(",");
    var that =this
    console.log(region)
    this.setData({
      region: e.detail.value
    })
    wx.request({
      url: iutil.APP_HOST + 'freebusiness/findfreebus?place=' + region,
      success: function (res) {
        console.log(res.data.freeBusinessesList)
        that.setData({
          realTime: res.data.freeBusinessesList
        })
      }
    })
  },
  // 点击切换swiper
  swichNav: function (e) {
    var that = this;
    // 切换currentTab
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
    // 获取推荐
    if (e.target.dataset.current == 0){
      // 查询推荐
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreecate',
        success: function (res) {
          that.setData({
            recommend: res.data.freeBusinessesList.reverse()
          })
        }
      });
    }
    // 获取即使
    if (e.target.dataset.current == 1) {
      // 查询即时
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus',
        success: function (res) {
          that.setData({
            realTime: res.data.freeBusinessesList.reverse()
          });
        }
      });
    }    
    // 获取历史
    if (e.target.dataset.current == 2) {
      // 查询当前用户的历史
      wx.request({
        url: iutil.APP_HOST + `my/findhis?user_oid=${openid}`,
        success: function (res) {
          that.setData({
            history: res.data.freeBusinessesList
          })
        }
      })
    }
    // 获取买
    if (e.target.dataset.current == 3) {
      // 查询买
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus?type=1',
        success: function (res) {
          that.setData({
            buy: res.data.freeBusinessesList.reverse()
          })
        }
      });
    }
    // 获取卖
    if (e.target.dataset.current == 4) {
      // 查询卖
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus?type=2',
        success: function (res) {
          that.setData({
            sell: res.data.freeBusinessesList.reverse()
          })
        }
      });
    }   
  },
  // 左右滑动swiper
  swiperChange: function (e) {
    var that = this;
    // 切换currentTab
    this.setData({
      currentTab: e.detail.current
    })
    // 获取推荐
    if (e.target.dataset.current == 0) {
      // 查询推荐
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreecate',
        success: function (res) {
          that.setData({
            recommend: res.data.freeBusinessesList.reverse()
          })
        }
      });
    }
    // 获取即使
    if (e.target.dataset.current == 1) {
      // 查询即时
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus',
        success: function (res) {
          that.setData({
            realTime: res.data.freeBusinessesList.reverse()
          });
        }
      });
    }
    // 获取历史
    if (e.target.dataset.current == 2) {
      // 查询当前用户的历史
      wx.request({
        url: iutil.APP_HOST + `my/findhis?user_oid=${openid}`,
        success: function (res) {
          that.setData({
            history: res.data.freeBusinessesList
          })
        }
      })
    }
    // 获取买
    if (e.target.dataset.current == 3) {
      // 查询买
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus?type=1',
        success: function (res) {
          that.setData({
            buy: res.data.freeBusinessesList.reverse()
          })
        }
      });
    }
    // 获取卖
    if (e.target.dataset.current == 4) {
      // 查询卖
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findfreebus?type=2',
        success: function (res) {
          that.setData({
            sell: res.data.freeBusinessesList.reverse()
          })
        }
      });
    } 
  },
  toBuy: function (e) {
    // 添加到历史
    var that = this;
    var fb_id = e.currentTarget.dataset.fb;
    // console.log(fb_id)
    var his = e.currentTarget.dataset.history;
      wx.request({
        url: iutil.APP_HOST + 'my/hissave',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
          fb_id: fb_id,
          user_oid: openid
        },
        success: function(res){
          // console.log(res.data);
        }
      })
    // 跳转至买家详情
    wx.navigateTo({
      url: `../free/buy/buy?fb_id=${fb_id}`,
    })
  },
  tosellers: function (e) {
    // 添加到历史
    var that = this;
    var fb_id = e.currentTarget.dataset.fb;
    // var his = e.currentTarget.dataset.history;
    // console.log(his)
    wx.request({
      url: iutil.APP_HOST + 'my/hissave',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        fb_id: fb_id,
        user_oid: openid
      },
      success: function (res) {
        // console.log(res.data);
      }
    })
    // 跳转至卖家详情
    wx.navigateTo({
      url: `../free/sellers/sellers?fb_id=${fb_id}`,
    })
  },
  tosearch: function () {
    wx.navigateTo({
      url: '../free/search/search',
    })
  },
  toOrder: function () {
    wx.switchTab({
      url: '../order/order',
    })
  },
  toPublish: function () {
    wx.navigateTo({
      url: '../free/publish/publish',
    })
  }

})