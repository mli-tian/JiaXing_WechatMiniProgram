// pages/welcome/welcome.js
Page({
  data:{
    Buser:'',
    BackgroundImg:'https://636c-cloud1-4gemaq12664412e4-1309899523.tcb.qcloud.la/background/background1.png?sign=d89e4215778f3948381362c4b398a578&t=1648343698',
    num:1,
  },
  //跳转去登录页
  login(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //跳转去注册页
  index(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  changeImg(){
    var img1='https://636c-cloud1-4gemaq12664412e4-1309899523.tcb.qcloud.la/background/background1.png?sign=d89e4215778f3948381362c4b398a578&t=1648343698';
    var img2='https://636c-cloud1-4gemaq12664412e4-1309899523.tcb.qcloud.la/background/background2.png?sign=171b6bdf5b95890caf16981ad9d50215&t=16484419595';
    var img3='https://636c-cloud1-4gemaq12664412e4-1309899523.tcb.qcloud.la/background/background3.png?sign=d497488460f259d7109a9eff943c0780&t=1648343680';
    if(this.data.num==1){
      this.setData({
        BackgroundImg:img2,
        num:2
      })
    }else if(this.data.num==2){
      this.setData({
        BackgroundImg:img3,
        num:3
      })
    }else{
      this.setData({
        BackgroundImg:img1,
        num:1
      })
    }

  },
  onLoad(){
    var that=this;
    setInterval(function () {
      that.changeImg()
    }, 8000)   
  },
  //存储登录信息后的跳转
  onShow(){
    var Buser=wx.getStorageSync('user')
    if(Buser&&Buser.NAME){
      wx.switchTab({
        url: '../control/control',
      })
    }
  }
})