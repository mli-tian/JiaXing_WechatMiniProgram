// pages/control/control.js
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'PH2BZ-VMXKW-4LERY-O6ESX-Y33AQ-T5BEU' // 必填
});  
//语音播报
var myPlugin = requirePlugin('WechatSI'); 
//图表配置
import * as echarts from '../../ec-canvas/echarts';

function line_set(chart, xdata, ydata) {
  var option = {
    title: {
      text: '心率随时间变化图',
      left: 'center',
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      name:'日期',
      axisLabel: {  
        interval:0,  
        rotate:40  
     } ,
      type: 'category',
      boundaryGap: false,
      data: xdata,
      // show: false
    },
    yAxis: {
      name:'心率 次/s',
      x: 'center',
      type: 'value',
      splitNumber:5,
      min: 40,
      max: 130,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '心率',
      type: 'line',
      smooth: true,
      data: ydata
    }]
  };
  chart.setOption(option);
}
function line_set_two(chart, xdata, ydata) {
  var option = {
    title: {
      text: 'SpO2随时间变化图',
      left: 'center',
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      name:'日期',
      axisLabel: {  
        interval:0,  
        rotate:40  
     } ,
      type: 'category',
      boundaryGap: false,
      data: xdata,
      // show: false
    },
    yAxis: {
      name:'血氧 %',
      x: 'center',
      type: 'value',
      splitNumber:2,
      min: 80,
      max: 100,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '血氧',
      type: 'line',
      smooth: true,
      data: ydata
    }]
  };
  chart.setOption(option);
}

Page({
  /* 页面的初始数据*/
  data: {
    Buser:'',
    online:'',
    alcohol:'',
    heartRate:'',
    latitude:'',
    longitude:'',
    spo2:'',
    unHealty:0,
    times:0,
    title1:'登录成功',
    title2:'自动刷新成功',
    title3:'下拉刷新成功',
    econe: {
      lazyLoad: true
    },
    ectwo: {
      lazyLoad: true
    },
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
      url: 'https://api.heclouds.com/devices/'+ app.globalData.gm_deviceid +'/datastreams',
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
        app.globalData.latitude=that.data.latitude;
        app.globalData.longitude=that.data.longitude;
        if(that.data.alcohol>=20){
          app.globalData.g_isSafe=false
          that.setData({
            unHealty:1
          })
        }else if(that.data.heartRate<60||that.data.heartRate>100){
          app.globalData.g_isSafe=false
          that.setData({
            unHealty:2
          })
        }else if(that.data.spo2<=94){
          app.globalData.g_isSafe=false
          that.setData({
            unHealty:3
          })
        }else{
          app.globalData.g_isSafe=true
          that.setData({
            unHealty:0
          })
        }
        console.log("unHealty",that.data.unHealty)
      },
      fail(res) {
        console.log("请求失败",res)
      }
    })
  },
  init_chart: function (xdata, ydata) {           //初始化第一个图表
    this.oneComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
        });
        line_set(chart, xdata, ydata)
        this.chart = chart;
        return chart;
    });
  },
  init_chart_two: function (xdata, ydata) {           //初始化第一个图表
    this.twoComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
        });
        line_set_two(chart, xdata, ydata)
        this.chart = chart;
        return chart;
    });
  },
  getOption: function () {        
    var _this = this;
    wx.request({
        url: 'https://api.heclouds.com/devices/'+app.globalData.gm_deviceid+'/datapoints?datastream_id=HeartRate&start=2021-01-01T00:00:00&limit=10&sort=DESC',//你请求数据的接口地址
        header: {
          'api-key':app.globalData.gm_apikey,
        },
        method: 'GET',
        success: function (res) {
          var _data =  res.data.data.datastreams[0];
          console.log("points:",_data)
          var heart=[];
          var heart_date=[];
          var temp='';
          for (var i = 0; i < 10; ++i) {
              heart[i]=_data.datapoints[i].value;
              temp=_data.datapoints[i].at.substring(0, 19);
              heart_date[i]=temp;
          }
          _this.init_chart(heart_date,heart)           
        },   
    })  
  },
  getOptionTwo: function () {        
    var _this = this;
    wx.request({
        url: 'https://api.heclouds.com/devices/'+app.globalData.gm_deviceid+'/datapoints?datastream_id=SpO2&start=2021-01-01T00:00:00&limit=10&sort=DESC',//你请求数据的接口地址
        header: {
          'api-key':app.globalData.gm_apikey,
        },
        method: 'GET',
        success: function (res) {
          var _data =  res.data.data.datastreams[0];
          console.log("points:",_data)
          var spo2=[];
          var spo2_date=[];
          var temp='';
          for (var i = 0; i < 10; ++i) {
              spo2[i]=_data.datapoints[i].value;
              temp=_data.datapoints[i].at.substring(0, 19);
              spo2_date[i]=temp;
          }
          _this.init_chart_two(spo2_date,spo2)           
        },   
    })  
  },
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
            app.globalData.latitude=_this.data.latitude;
            app.globalData.longitude=_this.data.longitude;
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
  yuyiplay(){
    var that=this;
    var content ='';
    if(that.data.unHealty==1){
      content='警告经测试酒精含量超标请停止驾驶';
    }else if(that.data.unHealty==2){
      content='警告经测试心率不正常请停止驾驶';
    }else if(that.data.unHealty==3){
      content='警告经测试血氧不正常请停止驾驶';
    }
    myPlugin.textToSpeech({   // 调用插件的方法
      lang: 'zh_CN',
      content:content,
       success: function (res) {
         that.errorStart(res.filename);
       },
    })
  },
  errorStart(e){
    this.innerAudioContext.src = e //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },
  onLoad: function (option) {
    //加载时完成  将数据显示在界面
    console.log(app.globalData.gm_apikey)
    var that = this //将当前对象赋值
    that.getOption()
    that.getOptionTwo()
    setInterval(function () {
      if (that.data.online == true){   //判断设备在线再请求更新数据
        that.getData(that.data.title2);
        that.getOption();
        that.getOptionTwo();
        if(that.data.unHealty!=0){
          that.setData({
            times:that.data.times+1,
          })
          console.log("times:",that.data.times)
          if(that.data.times==3){
            that.yuyiplay()
            console.log("语音警告")
            that.setData({
              times:0,
            })
          }
        }else{
          that.setData({
            times:0
          })
        }
      }else{
        console.log("设备不在线或者其他错误")
      }
      if(that.data.latitude==0||that.data.longitude==0){
        that.getMap()
      }
    }, 20000)    //代表20秒钟发送一次请求
  },
  /* 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
    var Buser = wx.getStorageSync('user');
    console.log(Buser)
    //将apikey和deviceid保存为全局变量
    app.globalData.gm_apikey = Buser.MAPIKEY
    app.globalData.gm_deviceid = Buser.MDEVICEID
    app.globalData.gh_apikey = Buser.HAPIKEY
    app.globalData.gh_deviceid = Buser.HDEVICEID
    console.log("保存全局变量成功")
    this.innerAudioContext = wx.createInnerAudioContext();
    var that = this;
    /*加入了自动刷新功能，无需一下代码更新数据 */
    that.getData(that.data.title1);
    /*折线图功能*/
    that.oneComponent = that.selectComponent('#mychart-dom-bar');
    that.twoComponent = that.selectComponent('#mychart-dom-bar-two');
    that.init_chart();
    that.init_chart_two();
    that.getOption();
    that.getOptionTwo();

    console.log("OnReady在运行")
    if(that.data.latitude==0||that.data.longitude==0){
      that.getMap()
    }
  },
   /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    var that = this;
    that.getData(that.data.title3);
    wx.stopPullDownRefresh();
  }
})

