// pages/control/control.js
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'PH2BZ-VMXKW-4LERY-O6ESX-Y33AQ-T5BEU' // 必填
});  

Page({
  /**
   * 页面的初始数据
   */
  data: {
    online:'',
    alcohol:'',
    heartRate:'',
    latitude:'',
    longitude:'',
    spo2:'',
    title1:'登录成功',
    title2:'自动刷新成功',
    title3:'下拉刷新成功',
  },
  /**
   * 获取数据函数
   * 参数t为打印数据
   * 可以获取是否在线以及其他传感器数据
   **/
  getData:function(t){
    var that = this;
    wx.request({
      url: 'https://api.heclouds.com/devices/' + app.globalData.gm_deviceid,
      header: {
        'api-key': app.globalData.gm_apikey
      },
      method: 'get',
      success: function (res) {
        if(res.data.errno==0){
          console.log(res),
          app.globalData.gm_online = res.data.data.online,
          that.setData({ 
            online : res.data.data.online
          })
          wx.showToast({
            title: t,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail(res) {
        console.log("请求失败", res)
        wx.showToast({
          title: '设备ID或API-key错误，请联系经销商',
          icon: 'none',
          duration: 1500
        })
      }
    })
    wx.request({
      url: 'https://api.heclouds.com/devices/'+ app.globalData.gm_deviceid+'/datastreams',
      header: {
        'api-key': app.globalData.gm_apikey
      },
      method:"GET",
      success: function (res) {
        console.log(res.data)
        that.setData({ 
          alcohol: res.data.data[0].current_value,
          heartRate: res.data.data[3].current_value,
          spo2: res.data.data[4].current_value,
          latitude:res.data.data[2].current_value,
          longitude:res.data.data[1].current_value,
        })
      },
      fail(res) {
        console.log("请求失败",res)
      }
    })
  },
  //从小程序获取位置信息
  getMap() {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) { //成功后的回调
            var addressRes = addressRes.result;
            console.log( addressRes.address)
            console.log(_this.data.latitude)
            _this.setData({
              latitude:res.latitude,
              longitude:res.longitude
            })
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
  onLoad: function (option) {
    //加载时完成  将数据显示在界面
    console.log(app.globalData.gm_apikey)
    var that = this //将当前对象赋值
    setInterval(function () {
      if (that.data.online == true){   //判断设备在线再请求更新数据
        that.getData(that.data.title2);
        //console.log("轮播请求1秒触发一次");
      }else{
        console.log("设备不在线或者其他错误")
      }
      if(that.data.latitude==0||that.data.longitude==0){
        that.getMap()
      }
    }, 20000)    //代表20秒钟发送一次请求
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    /**
     * 加入了自动刷新功能，无需一下代码更新数据
     */
    that.getData(that.data.title1);
    console.log("OnReady在运行")
    if(that.data.latitude==0||that.data.longitude==0){
      that.getMap()
    }
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.getData(that.data.title3);
    wx.stopPullDownRefresh();
  }

})

