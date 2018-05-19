var iutil = require('../../../utils/util.js'); 

Page({
    data:{
        freeBusinessesList:[],
        array: [],
        indexCorn: 0,
        arrayBusiness: ['买','卖'],
        indexBusiness: 0,
        showModal: false,
        keyWord:'',
        key:'',
        currentTab: 0,

        region: ['', '', ''],
        customItem: '全部',

        currentUnit: 0,

        unit: ['全部', '吨', '公斤', '升','斤'],
        // multiArray保存品类picker的列数据
        multiArray: [[], []],
        // multiIndex保存品类picker的每列选择的下标
        multiIndex: [0, 0],
        // multiData保存品类picker的每列选择的内容
        multiData: ['', '']
    },
    onLoad: function (options) {
      var keyWord = wx.getStorageSync('key');
      console.log(keyWord)
      this.setData({ keyWord: keyWord });
      var that = this;
      wx.request({
        url: iutil.APP_HOST + '/freebusiness/findbykey?keyWord=' + keyWord,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data),
            that.setData({
              freeBusinessesList: res.data.freeBusinessesList.reverse(),
            }),
            console.log(res.data.freeBusinessesList)
        }
      })
      // 加载品类picker
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      wx.request({
        url: iutil.APP_HOST + '/category/findall?level=1',
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
    keyInput: function (e) {
      this.setData({
        key: e.detail.value
      })
    },
    search: function () {
      var arr = [];
      arr = this.data.keyWord;
      // console.log(arr);
      // arr.push(this.data.key);
      // console.log(arr);
      var set = new Set(arr);
      var newArr = Array.from(set);
      wx.setStorageSync('key', this.data.key);
      wx.setStorageSync('keyWord', newArr);
    },
    changeUnit: function(e){
      this.setData({
        currentUnit: e.currentTarget.dataset.unit
      })
        // console.log(e.currentTarget.dataset.unit);
    },
    toBuy: function () {
      wx.navigateTo({
        url: '../../free/buy/buy',
      })
    },
    tosellers: function () {
      wx.navigateTo({
        url: '../../free/sellers/sellers',
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
          url: iutil.APP_HOST + '/category/findbyparent?category_name=' + category,
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
        url: iutil.APP_HOST + '/freebusiness/findfreebus?category=' + category,
        success: function (res) {
          that.setData({
            freeBusinessesList: res.data.freeBusinessesList
          })
        }
      })
    },
    bindRegionChange: function(e){
      var that=this;
      var region = e.detail.value[2];
      console.log(e.detail.value)
      wx.request({
        url: iutil.APP_HOST + '/freebusiness/findfreebus?region='+region,
        success:function(res){
          that.setData({
            freeBusinessesList: res.data.freeBusinessesList
          })
        }
      })
    },
    listenerCornPickerSelected: function (e) {
        this.setData({
            indexCorn: e.detail.value
        });
    },
    listenerBusinessPickerSelected: function (e) {
      var bustype = e.detail.value;
      var bustypes = parseInt(bustype)+1
      console.log(bustypes)
      var that = this;
      wx.request({
        url: iutil.APP_HOST + '/freebusiness/findfreebus?type=' + bustypes,
        success: function (res) {
          that.setData({
            freeBusinessesList: res.data.freeBusinessesList
          })
          console.log(that.data.freeBusinessesList)
        }
      }) 
    },
    showDialogBtn: function () {
         this.setData({
              showModal: true
         })
    },
    hideDialogBtn:function(){
         this.setData({
              showModal: false
          })
    },
    hideModal: function () {
         this.setData({
              showModal: false
         });
    }
})