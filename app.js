// app.js
App({
  onLaunch() {
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
  globalData: {
    gm_apikey:'',
    gm_deviceid:'',
    gm_online:'',
    gh_apikey:'',
    gh_deviceid:'',
    gh_online:''
  }
})
