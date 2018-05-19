//publish.js
// const app = getApp()
var iutil = require('../../../utils/util.js');
var util = require('../../free/getTime.js');
var openid = wx.getStorageSync("openid");
console.log(openid)
Page({
  data: {
    region: ['省', '市', '区/县'],
    customItem: '全部',
    region2: ['省', '市', '区/县'],
    customItem2: '全部',
    tempFilePath: '../../../mock/images/publish/addPic.png',
    // tempFilePath2: '../../../mock/images/publish/addPic.png',
    // tempFilePath3: '../../../mock/images/publish/addPic.png',
    catecory: [], 
    array: ['选择服务', '我要收购', '我要出售'],
    index: 0,
    multiArray: [[], []],
    multiIndex: [0, 0],
    // resData:'',
    // fb_id:[],
  },
  /*上传图片*/
  getImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        that.setData({
          tempFilePath: res.tempFilePaths
        })
        console.log(that.data.tempFilePath);
        wx.uploadFile({
          url: iutil.APP_HOST + '/freebusiness/save?user_oid=' + openid,
          filePath: tempFilePaths[0],
          name: 'headPortraitFile',
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data)
            that.setData({
              a: data.fb_id
            })
            console.log(that.data.a)
          },
        })
      },
    })
  },

  /* button交互/跳转 */
  formSubmit: function (data) {
    var that = this;
    // console.log("");
    var typ = data.detail.value.ser;
    var category = this.data.category;
    var amount = data.detail.value.count;
    var standard = data.detail.value.spec;
    var price = data.detail.value.price;
    var unit = data.detail.value.unit;
    var brand = data.detail.value.brand;
    var fb_id = that.data.a;
    var place = data.detail.value.place;
    var region = data.detail.value.region;
    var params = {
      "type": typ,
      "category": category,
      "amount": amount,
      "standard": standard,
      "price": price,
      "unit": unit,
      "brand": brand,
      "place": place,
      "fb_id": fb_id,
      "region": region,
      "status": 0
    };
    if (that.data.tempFilePath == '../../../mock/images/publish/addPic.png'){
      wx.showModal({
        showCancel:false,
        title: '提示',
        content: '必须添加图片',
        success: function (res) {

        }
      })
    }else{
      wx.navigateBack({
        url: '../free',
      })

    wx.request({
      url: iutil.APP_HOST + '/freebusiness/saveanother?user_oid=' + openid,
      method: "POST", 
      data: params,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
      }
    })
  }
    

    /* 上传图片 */
    // if (that.data.imgArray != '') {
    //   console.log(that.data.imgArray[0])
    //   var address = that.data.imgArray[0];
    //   wx.uploadFile({
    //     url: iutil.APP_HOST + '/freebusiness/save',
    //     filePath: address,
    //     name: 'file',
    //     formData: {
    //       userId: 1,
    //       headPortrait: that.data.imgArray[0]
    //     },
    //     success: function (res) {
    //       var data = res.data
    //       //do something
    //     }
    //   })
    // }
  },

  /* 获取图片 */
  // getImage: function () {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 3,
  //     sizeType: ['original', 'compressed'],
  //     success: function (res) {
  //       //do sth
  //       // console.log(res.tempFilePaths)
  //       // console.log(res)
  //       that.setData({
  //         imgArray: res.tempFilePaths
  //       })
  //       console.log(that.data.imgArray[0])
  //     }
  //   })
  // },

  /* 选择服务picker */
  bindPickerChange: function (data) {
    console.log(data.detail.value)
    this.setData({
      index: data.detail.value
    })
  },


  /* 省市区选择器 */
  bindRegionChange: function (data) {
    console.log(data.detail.value)
    this.setData({
      region: data.detail.value
    })
  },

  bindRegionChange2: function (data) {
    console.log(data.detail.value)
    this.setData({
      region2: data.detail.value
    })
  },

  /* 获取品类 */
  onLoad: function (options) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    var that = this;
    wx.request({
      url: iutil.APP_HOST + '/category/findall?level=1',
      success: function (res) {
        // console.log(res.data.categoryList);
        var arrays = res.data.categoryList;
        var array = [];
        for (var i in arrays) {
          array.push(arrays[i]['category_name']);
        }
        data.multiArray[0] = array;
        that.setData(data);
      }
    }),
      // 默认
    wx.request({
      url: iutil.APP_HOST + '/category/findbyparent?category_name=水果',
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

  bindMultiPickerChange: function (data) {
    // console.log(data)
    this.setData({
      multiIndex: data.detail.value
    })
    var currentIndex = data.detail.value[1];
    var category = this.data.multiArray[1][currentIndex];
    var that = this;
    wx.request({
      url: iutil.APP_HOST + '/freebusiness/findfreebus?category=' + category,
      success: function (res) {
        that.setData({
          freeBusinessesList: res.data.freeBusinessesList
        })
        // console.log(that.data.freeBusinessesList)
      }
    })
    var a = this.data.multiIndex[0]
    var b = this.data.multiIndex[1]
    var c = this.data.multiArray[0][a]
    var d = this.data.multiArray[1][b]
    console.log(c,d)
    var cate = [d]
    this.setData({
      category: cate
    })
  },

  bindMultiPickerColumnChange: function (e) {
    // console.log(e.detail.column);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      var that = this;
      var category = data.multiArray[0][e.detail.value];
      // console.log(category);
      wx.request({
        url: iutil.APP_HOST + '/category/findbyparent?category_name=' + category,
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
    }
    this.setData(data);
  },
  // preview:function(){
  //   extraLine.push("")
  // }
})