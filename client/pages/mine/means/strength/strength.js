// pages/mine/means/strength/strength.js
var util = require('../../../../utils/util.js');
var openid = wx.getStorageSync("openid");
//图片上传个数
var i = 1;
Page({
  data: {
    my_photo: [],
    full: false
  },
  onLoad: function (options) {
    
  },
  //上传图片
  upload: function(){
    var that = this;
    var arr = that.data.my_photo;
    //剩余可选择的照片数量
    var len = 4-arr.length;
    //是否可以继续选择的标识符
    var full = false;
    wx.chooseImage({
      count: len,
      success: function(res) {
        var newArr = res.tempFilePaths;
        //拼接数组
        arr = arr.concat(newArr);
        if (arr.length == 4) {
          full = true;
        }
        that.setData({
          my_photo: arr,
          full: full
        })
      }
    })
  },
  // 更改图片
  update: function(e){
    var that = this;
    var arr = that.data.my_photo;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var newUrl = res.tempFilePaths[0];
        //替换数组元素
        arr.splice(index, 1, newUrl);
        that.setData({
          my_photo: arr
        })
      }
    })
  },
  // 删除图片
  del: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除图片',
      success: function(res){
        if(res.confirm){
          var arr = that.data.my_photo;
          var index = e.currentTarget.dataset.index;
          //删除数组元素
          arr.splice(index, 1);
          that.setData({
            my_photo: arr,
            full: false
          })
        }
      }
    })
  },
  // 提交
  
  submit: function(){
    var that = this;
    var files = this.data.my_photo;
    console.log(files)
    var name = `certificate${i}File`;
    wx.uploadFile({
      url: util.APP_HOST + `wuser/updatewuser?openid=${openid}`,
      filePath: files[i-1],
      name: name,
      complete: function (res) {
        console.log(res);
        console.log(i);
        if(i==files.length){
          // 图片全部上传完成
          wx.showToast({
            title: '成功',
            icon: 'success'
          })
          wx.navigateBack()
        } else if (i < files.length){
          //图片还没有传完，继续调用函数  
          that.submit();
        }
        i++;
        
      }
    })
    wx.navigateBack();
  }
})