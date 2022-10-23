// pages/me/me.js
var app = getApp();
Page({
  data:{
    name:'',
    Buser:'',
    weather:[],
    weatherInfo: {},//天气信息
    lifeList: [], //生活指数列表
    isSafe:true,
    imgUrl: [
      'cloud://cloud1-4gemaq12664412e4.636c-cloud1-4gemaq12664412e4-1309899523/boimage/a.jpg',
      'cloud://cloud1-4gemaq12664412e4.636c-cloud1-4gemaq12664412e4-1309899523/boimage/b.png',
      'cloud://cloud1-4gemaq12664412e4.636c-cloud1-4gemaq12664412e4-1309899523/boimage/c.png'
    ], //轮播图 
    latitude:'',
    longitude:''
  },
  onLoad(){
    var that=this;
    that.setData({
      latitude:app.globalData.latitude,
      longitude:app.globalData.longitude
    })
    setInterval(function () {
      that.setData({
        latitude:app.globalData.latitude,
        longitude:app.globalData.longitude
      })
    },20000)
    var Buser = wx.getStorageSync('user');
    that.setData({
      name:Buser.NAME
    })
  },
  //退出登陆
  signOut(){
    wx.setStorageSync('user', null)
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  }
})