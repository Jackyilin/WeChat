// pages/mine/category/cateSub/cateSub.js
var util = require('../../../../utils/util.js');
var openid = wx.getStorageSync('openid');
Page({
  data: {
    //查询到的2级品类
    sub: [],
    //保存选中的下标
    selectIndex: [],
    //保存每个品类选中的状态
    selectStu: [],
    //保存所有的category_id
    allId: []
  },
  onLoad: function (options) {
    var category_id = options.category_id
    var that = this
    //加载2级品类
    wx.request({
      url: util.APP_HOST + 'category/findall',
      method: 'get',
      data:{
        level: 2,
        parent_id: category_id
      },
      success: function (res) {
        var list = res.data.categoryList;
        var len = list.length;
        //初始化
        var selectStu = [];
        var allId = [];
        for (var i = 0; i < len; i++) {
          selectStu.push(false);
          allId.push(list[i].category_id);
        }
        that.setData({
          sub: list,
          selectStu: selectStu,
          allId: allId
        })
        // 修改页面标题
        wx.setNavigationBarTitle({
          title: options.category_name
        })
      }
    })
    
  },
  //选中品类事件
  click: function(e){ 
    var selectIndex = this.data.selectIndex;
    var selectStu = this.data.selectStu;
    //当前点击的下标
    var index = e.currentTarget.dataset.index;
    //判断当前点击的品类是否被已经被选中
    if (selectStu[index]){
      //如果已经被选中，从数组中移除
      selectIndex.splice(index, 1);
    } else {
      //如果未被选中，添加到数组中
      selectIndex.push(index);
    }
    //修改标识符
    selectStu[index] = !selectStu[index];
    //重新渲染数据
    this.setData({
      selectIndex: selectIndex,
      selectStu: selectStu
    })
  },
  //加入品类事件
  add: function(){
    //判断是否选中至少1个品类
    if(this.data.selectIndex.length){
      //根据selectIndex筛选selectId
      var allId = this.data.allId;
      var selectIndex = this.data.selectIndex;
      var selectId = [];
      for (var i in selectIndex) {
        var index = selectIndex[i]
        selectId.push(allId[index]);
      }
      //将选中的id转换成逗号分隔的字符串
      var cate = selectId.join(',');
      //发送请求
      var that = this
      wx.request({
        url: util.APP_HOST + 'my/catesave',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          cateParam: cate,
          user_oid: openid
        },
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: '成功',
            icon: 'success'
          })
          wx.navigateBack({
            delta: 2
          })
        }
      })
    }else{
      wx.showModal({
        title: '您未选择品类',
        content: '请选择至少1个品类',
      })
    }
  }
})