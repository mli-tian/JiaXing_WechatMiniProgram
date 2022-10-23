// app.js
App({
  onLaunch() {
    // 云存储空间的加载
    wx.cloud.init({
      env:'cloud1-4gemaq12664412e4'
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  //全局变量
  globalData: {
    latitude:'',
    longitude:'',
    gm_apikey:'',
    gm_deviceid:'',
    gm_online:'',
    gh_apikey:'',
    gh_deviceid:'',
    g_isSafe:true,
  }
})
