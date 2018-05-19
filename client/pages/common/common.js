// pages/area/area.js
var util = require('../../utils/util');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js')
var address = [];
Component({
  properties: {
  },
  data: {
    areaInfo: '',
    // 通过that.animation.export()把动画效果导入
    animationAddressMenu: {},
    // 三步运算符初始值为false
    addressMenuIsShow: false,
    value: [0, 0, 0],
    // 省
    provinces: [],
    // 市
    citys: [],
    // 县
    areas: [],
    // 对应的CODE
    currentProCode: '',
    currentCityCode: '',
    currentAreaCode: '',
    // 对应选择的索引
    // 初始隐藏
    display: 'none',
  },
  methods: {
    getProvince: function () {
      var that = this;
      var PIndex = this.data.val0;
      wx.request({
        url: util.APP_HOST + '/tarea/getallprovince',
        success: function (res) {
          var result = res.data;
          that.setData({
            provinces: result.province
          })
        }
      })
    },
    getCity: function () {
      var that = this;
      wx.request({
        url: util.APP_HOST + '/tarea/getallcity?province=230000',
        success: function (res) {
          var result = res.data;
          that.setData({
            citys: res.data.citys
          })
        }
      })
    },
    getArea: function () {
      var that = this;
      wx.request({
        url: util.APP_HOST + '/tarea/getcounty?city=' + that.data.currentCityCode,
        success: function (res) {
          var result = res.data;
          that.setData({
            areas: result.county

          })
        }
      })
    },
    // 省市县
    cityChange: function (e) {
      var val = e.detail.value
      var provinces = this.data.provinces
      var citys = this.data.citys
      var county = this.data.areas
      var valPro = val[0]
      var valCity = val[1]
      var valCounty = val[2]
      if (this.data.value[0] != valPro) {
        this.setData({
          value: [valPro, 0, 0],
        })
      } else if (this.data.value[1] != valCity) {
        var Cindex = this.data.citys[valCity].code
        this.setData({
          value: [valPro, valCity, 0],
          currentCityCode: Cindex
        })
        this.getArea();
      } else if (this.data.value[2] != valCounty) {
        this.setData({
          value: [valPro, valCity, valCounty]
        })
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    gps: function (e) {
      var that = this;
      //调用地图接口
      //实例化腾讯地图API核心类
      var qqmapsdk = new QQMapWX({
        key: '4X3BZ-C4ICK-IKRJU-APRF3-MXCLF-T7BEH'
      });
      //1.获取当前位置坐标
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          //2.根据坐标获取当前位置名称（腾讯地图逆解析）
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (addressRes) {
              var areaInfo = addressRes.result.address_component.province + ',' + addressRes.result.address_component.city + ',' + addressRes.result.address_component.district;
              var cityname = addressRes.result.address_component.city;
              var areaname = addressRes.result.address_component.district;
              that.setData({
                areaInfo: areaInfo,
                areaname: areaname
              })
              var cit = that.data.citys
              for (var i = 0; i < cit.length; i++) {
                if (cityname == cit[i].name) {
                  var idx = cit[i].code
                  wx.request({
                    url: util.APP_HOST + '/tarea/getcounty?city=' + idx,
                    success(res) {
                      console.log(res.data.county)
                      that.setData({
                        areas: res.data.county,
                        citysCode: idx
                      })
                      that.onon();
                    }
                  })
                }
              }
              console.log(that.data.areaInfo);
            }
          })
        }
      })
    },
    onon: function () {
      var that = this
      var myEventDetail = {
        provinces: that.data.provinces,
        citys: that.data.citys,
        areas: that.data.areas,
        areaname: that.data.areaname,
        provincesCode: '230000',
        citysCode: that.data.citysCode,
        areaInfo:that.data.areaInfo
      }
      var myEventOption = {}
      that.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    init: function (options) {

      var that = this;
      //调用省市数据
      that.getProvince();
      that.getCity();
      // 初始化动画变量  
      var animation = wx.createAnimation({
        duration: 500,
        transformOrigin: "50% 50%",
        timingFunction: 'ease',
      })
      that.animation = animation;
    },
    selectDistrict: function (e) {
      var that = this
      // 如果已经显示，不在执行显示动画  
      if (that.data.addressMenuIsShow) {
        return
      }
      // 执行显示动画  
      that.startAddressAnimation(true)
    },
    // 执行动画  
    startAddressAnimation: function (isShow) {
      var that = this
      if (isShow) {
        // vh是用来表示尺寸的单位，高度全屏是100vh  
        that.animation.translateY(0 + 'vh').step();
        //显示遮罩层  
        that.setData({
          display: "block"
        })
      } else {
        that.animation.translateY(40 + 'vh').step();
        //隐藏遮罩层  
        that.setData({
          display: "none"
        })
      }
      that.setData({
        animationAddressMenu: that.animation.export(),
        addressMenuIsShow: isShow,
      })
    },
    // 点击地区选择取消按钮  
    cityCancel: function (e) {
      this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮  
    citySure: function (e) {
      var that = this
      var city = that.data.city
      var value = that.data.value
      that.startAddressAnimation(false)
      // 将选择的城市信息显示到输入框  
      var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name;
      that.setData({
        areaInfo: areaInfo,
        areaname: that.data.areas[value[2]].name
      })
      var myEventDetail = {
        provinces: that.data.provinces,
        citys: that.data.citys,
        areas: that.data.areas,
        areaname: that.data.areaname,
        provincesCode: '230000',
        citysCode: that.data.currentCityCode,
        areaInfo: that.data.areaInfo
      }
      var myEventOption = {}
      that.triggerEvent('myevent', myEventDetail, myEventOption);
    },
  }
})