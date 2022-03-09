// pages/login/login.js
Page({
  data:{
    account:'',
    password:'',
  },
  //获取手机号
  getAccount(event){
    this.setData({
      account:event.detail.value
    })
  },
  //获取密码
  getPassword(event){
    this.setData({
      password:event.detail.value
    })
  },
  getDeviceInfo(){
    
  },
  login(){
    let account=this.data.account
    let password=this.data.password
    console.log('登陆')
    console.log('手机号码:',account)
    console.log('密码:',password)
    //校验手机号码
    if(account.length!=11){
      wx.showToast({
        icon:'none',
        title: '手机号码应为11位',
      })
      return
    }
    if(password.length<4){
      wx.showToast({
        icon:'none',
        title: '密码至少4位',
      })
      return
    }
    //注册功能的实现
    wx.cloud.database().collection('user').where({
      ACCOUNT:account
    }).get({
      success(res){
        console.log("获取数据成功",res)
        let user=res.data[0]
        let loginin=-1
        if(password==user.PASSWORD){
          //尝试连接平台，并刷新各数据状态
          //连接onenet-mqtt
          wx.request({
            url: "https://api.heclouds.com/devices/" + user.MDEVICEID,
            header: {
              "api-key": user.MAPIKEY,
            },
            method:'GET',
            success(res) {
              console.log(res)
              if (res.data.errno===0) {
                console.log("成功连接onenet-mqtt平台")
                loginin=loginin+1
                console.log("loginin",loginin)
              } else {
                console.log("设备还未连接")
                wx.showToast({
                  icon:'none',
                  title: 'mqtt-apikey或mqtt-deviceid出错',
                })
              }
            },
            fail(res) {
              console.log("连接平台失败",res)
            },
          })
          //连接onenet-http
          wx.request({
            url: "https://api.heclouds.com/devices/" + user.HDEVICEID,
            header: {
              "api-key": user.HAPIKEY,
            },
            method:'GET',
            success(res) {
              console.log(res)
              if (res.data.errno===0) {
                console.log("成功连接onenet-http平台")
                wx.setStorageSync('user', user)
              } else {
                console.log("设备还未连接")
                wx.showToast({
                  icon:'none',
                  title: 'http-apikey或http-deviceid出错',
                })
              }
            },
            fail(res) {
              console.log("连接平台失败",res)
            },
          })
          //登陆
          if(loginin){
            wx.showToast({
              title: '登陆成功',
            })
            wx.switchTab({
              url: '../me/me'
            })
            wx.setStorageSync('user', user)
          }
        }else{
          console.log("登陆失败")
          wx.showToast({
            icon:'none',
            title: '登陆失败',
          })
        }
      },
      fail(res){
        console.log("获取数据失败",res)
        wx.showToast({
          icon:'none',
          title: '手机号码不存在',
        })
      }
    })
  }
})