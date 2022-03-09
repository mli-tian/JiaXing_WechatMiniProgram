// pages/welcome/welcome.js
Page({
  data:{
    Buser:''
  },
  //去登录页
  login(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //去注册页
  index(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onShow(){
    var Buser=wx.getStorageSync('user')
    if(Buser&&Buser.NAME){
      wx.switchTab({
        url: '../me/me',
      })
    }
  }
})