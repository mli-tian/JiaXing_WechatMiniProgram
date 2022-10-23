// pages/camera/camera.js
var util = require('../../utils/util.js');
//语音播报
var myPlugin = requirePlugin('WechatSI'); 
const app = getApp()
Page({
  data: {
    firstimg:'',
    img:'',
    title2:'自动刷新成功',
    title3:'下拉刷新成功',
    marker:[{
      gallery:false,
      id:0,
      imagesrc:'',
      date:'',
      index:''
    },{
      gallery:false,
      id:1,
      imagesrc:'',
      date:'',
      index:''
    },{
      gallery:false,
      id:2,
      imagesrc:'',
      date:'',
      index:''
    },{
      gallery:false,
      id:3,
      imagesrc:'',
      date:'',
      index:''
    },{
      gallery:false,
      id:4,
      imagesrc:'',
      date:'',
      index:''
    }]
  },
  /**
   * 获取数据函数
   * 参数t为打印数据
   * 可以获取是否在线以及其他传感器数据
   **/
  getData:function(t){
    var that = this;
    var imgIndex;
    wx.request({
      url: 'https://api.heclouds.com/devices/'+app.globalData.gh_deviceid+'/datapoints?datastream_id=img&start=2022-01-01T00:00:00&limit=100&sort=DESC',
      header: {
        'api-key': app.globalData.gh_apikey
      },
      method:"GET",
      success: function (res) {
        console.log(res.data)
        var _data = res.data.data.datastreams[0]
        var _length = _data.datapoints.length
        for(var i=0;i<5;i++){
          that.data.marker[i].index=_data.datapoints[i].value.index
          that.data.marker[i].date=_data.datapoints[i].at
          that.setData({
            marker:that.data.marker
          })
        }
        wx.request({
          url: 'https://api.heclouds.com/bindata/'+that.data.marker[0].index,
          header:{
            'api-key': app.globalData.gh_apikey
          },
          method:"GET",
          responseType: 'arraybuffer',
          success: function (res) {
            console.log("res",res.data)
            const base64=wx.arrayBufferToBase64(res.data)        
            that.data.marker[0].imagesrc='data:image/png;base64,'+base64
            that.setData({
              marker:that.data.marker
            });
            console.log(that.data.marker)
          }
        })
      },
      fail(res) {
        console.log("请求失败",res)
      }
    })
  },
  openSrc(imgIndex){
    var that=this;
    wx.request({
      url: 'https://api.heclouds.com/bindata/'+imgIndex,
      header:{
        'api-key': app.globalData.gh_apikey
      },
      method:"GET",
      responseType: 'arraybuffer',
      success: function (res) {
        const base64=wx.arrayBufferToBase64(res.data)        
        that.setData({
          img:'data:image/png;base64,'+base64
        });
      }
    })
  },
  judge(){
    var that=this;
    var TIME = util.formatTime(new Date());
    TIME = parseInt(TIME);  
    console.log('TIME',TIME);
    var time = this.data.marker[0].date;
    time = time.replace(/-/g,'');
    time = time.replace(/ /g,'');
    time = time.replace(/:/g,''); 
    time = parseInt(time);
    console.log('time',time);
    var a=TIME-time;
    console.log(a);
    if(a<=200){
      myPlugin.textToSpeech({   // 调用插件的方法
        lang: 'zh_CN',
        content:'您存在违规行为请停车调整',
         success: function (res) {
           that.errorStart(res.filename);
         },
      })
    }
  },
  errorStart(e){
    this.innerAudioContext.src = e //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },
  open1(){
    this.data.marker[1].gallery=true;
    var index=this.data.marker[1].index
    this.openSrc(index)
    this.setData({
      marker:this.data.marker
    })
  },
  open2(){
    this.data.marker[2].gallery=true;
    var index=this.data.marker[2].index;
    this.openSrc(index);
    this.setData({
      marker:this.data.marker
    })
  },
  open3(){
    this.data.marker[3].gallery=true;
    var index=this.data.marker[3].index;
    this.openSrc(index);
    this.setData({
      marker:this.data.marker
    })
  },
  open4(){
    this.data.marker[4].gallery=true;
    var index=this.data.marker[4].index;
    this.openSrc(index);
    this.setData({
      marker:this.data.marker
    })
  },
  close1(){
    this.data.marker[1].gallery=false;
    this.setData({
      marker:this.data.marker
    })
  },
  close2(){
    this.data.marker[2].gallery=false;
    this.setData({
      marker:this.data.marker
    })
  },
  close3(){
    this.data.marker[3].gallery=false;
    this.setData({
      marker:this.data.marker
    })
  },
  close4(){
    this.data.marker[4].gallery=false;
    this.setData({
      marker:this.data.marker
    })
  },
  onLoad: function (option) {
    //加载时完成  将数据显示在界面
    console.log(app.globalData.gh_apikey)
    var that = this //将当前对象赋值
    setInterval(function () {
        that.getData(that.data.title2);
        that.judge();
    }, 30000)    //代表20秒钟发送一次请求
  },
  /*生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
    var that = this;
    that.innerAudioContext = wx.createInnerAudioContext();
    /*加入了自动刷新功能，无需一下代码更新数据 */
    that.getData(that.data.title2);
    console.log("OnReady在运行")
  },
   /* 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    var that = this;
    that.getData(that.data.title3);
    wx.stopPullDownRefresh();
  }
})