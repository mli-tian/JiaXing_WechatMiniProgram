// pages/me/me.js
var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'PH2BZ-VMXKW-4LERY-O6ESX-Y33AQ-T5BEU' // 必填
});  
const utils = require("../../utils/util");

Page({
  data:{
    name:'',
    Buser:'',
    city_code:'',
    latitude:'',
    longitude:'',
    localtion:'',
    cityName:'',
    weatherInfo: {},//天气信息
    lifeList: [] //生活指数列表
  },
  //首页天气情况所申请的位置信息腾讯位置服务获取
  getLocal() {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (addressRes) { //成功后的回调
            var addressRes = addressRes.result;
            console.log( addressRes.address);
            _this.setData({
              latitude:res.latitude.toFixed(2),
              longitude:res.longitude.toFixed(2),
              cityName:addressRes.ad_info.city
            })
            var alocaltion=_this.data.longitude+','+_this.data.latitude
            _this.setData({
              localtion:alocaltion
            })
            console.log(_this.data.localtion)
            },
          fail: function (error) {
            console.error(error);
          },
          complete: function (addressRes) {
           console.log(addressRes);
          }
        })
      }
    })
  },
  getWeather() {//获取今日天气
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var url="https://devapi.qweather.com/v7/weather/now"
    var params={
      localtion:that.data.localtion,
      key:"ae8fc55993674772bddce200067bd598"
    }
    wx.request({
      url: url,
      data:params,
      success(res){
        that.setData({
          weatherInfo:res.data.now
        })
      }
    })
    // let params = {};
    // Object.assign(params, {
    //   key: "ae8fc55993674772bddce200067bd598",
    //   localtion: that.data.localtion
    // });
    // utils.requestAjax.get('https://devapi.qweather.com/v7/weather/now', params)
    //   .then((res) => {
      //   wx.hideLoading();
      //   if (res.data.code != 200) {
      //     return
      //   }
      //   that.setData({
      //     weatherInfo: res.data.now
      //   })
      //   console.log(that.data.weatherInfo)
      // })
    that.getLifeList(params);
  },//生活指数
  getLifeList(params) {
    let that = this;
    Object.assign(params, {type: 0});
    utils.requestAjax.get('https://devapi.qweather.com/v7/indices/1d', params)
      .then((res) => {
        if (res.data.code != 200) {
          return
        }
        that.setData({
          lifeList: res.data.daily
        })
      })
  },
  onLoad(){
    var Buser = wx.getStorageSync('user');
    console.log(Buser)
    //将apikey和deviceid保存为全局变量
    app.globalData.gm_apikey = Buser.MAPIKEY
    app.globalData.gm_deviceid = Buser.MDEVICEID
    app.globalData.gh_apikey = Buser.HAPIKEY
    app.globalData.gh_deviceid = Buser.HDEVICEID
    console.log("保存全局变量成功")
    this.setData({
      name:Buser.NAME
    })
    this.getLocal();
    this.getWeather();
  },
  //退出登陆
  signOut(){
    wx.setStorageSync('user', null)
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  }
})