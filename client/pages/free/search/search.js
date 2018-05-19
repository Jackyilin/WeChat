// pages/rich/search/search.js
var iutil = require('../../../utils/util.js');
Page({
  data:{
    keyWord:[],
    key:'',
    hotWord:[]
  },
  keyInput:function(e){
    this.setData({
      key: e.detail.value
    })
  },
  clear:function(){
    this.setData({
      keyWord:[]
    })
    wx.setStorageSync('keyWord', this.data.keyWord);
  },
  hisSearch:function(e){
    var hisKey=e.currentTarget.dataset.text;
    this.setData({
      key: hisKey
      });  
    wx.setStorageSync('key', this.data.key);        
    wx.navigateTo({
      url: '../look/look',
    })
  }, 
  hotSearch: function (e) {
    var hotKey = e.currentTarget.dataset.text;
    this.setData({
      key: hotKey
    });
    // wx.setStorageSync('key', this.data.key);
    wx.navigateTo({
      url: '../look/look',
    });
  },
  search:function(){
    var arr=[];
    // arr = this.data.keyWord;
    console.log(this.data)
    // console.log(arr);
    arr.push(this.data.key);
    // console.log(arr);
    var set=new Set(arr);
    var newArr=Array.from(set);
    console.log(newArr)
    wx.setStorageSync('key', this.data.key);
    wx.setStorageSync('keyWord', newArr);
    wx.navigateTo({
      url: '../look/look',
    })
  },
  onShow:function(){
      var that = this;
      var keyWord = wx.getStorageSync('keyWord');
      this.setData({
        keyWord: keyWord
      });
      wx.request({
        url: iutil.APP_HOST + 'freebusiness/findhot',
        success:function(res){
          that.setData({
            hotWord:res.data.hotList
          })
        }
      })
  }
})