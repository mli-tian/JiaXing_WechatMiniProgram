// pages/about/about.js
Page({
  /*页面的初始数据*/
  data: {
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
  },
  /* 用户点击右上角分享*/
  onShareAppMessage: function () {
  },
  copyEmail: function(){
    wx.setClipboardData({
      data: '	iian55lt@126.com',
      success: function (res) {
        wx.showToast({
          title: '已复制邮箱',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  copy: function (e) {
    var data = ""
    var title = ""
    switch (e.currentTarget.dataset.index){
      case "0":
        data = "iian55lt@126.com"
        title = "已复制邮箱"
        break;
      case "1":
        data = "https://blog.csdn.net/hhhhhzl?spm=1000.2115.3001.5343"
        title = "已复制CSDN"
        break;
    }
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})