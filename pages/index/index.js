// index.js
// 获取应用实例
const app = getApp()
Page({
  data:{
    name:'',
    account:'',
    password:'',
    mapikey:'',
    mdeviceid:'',
    hapikey:'',
    hdeviceid:''
  },
  //获取用户名
  getName(event){
    this.setData({
      name:event.detail.value
    })
  },
  //获取手机号
  getAccount(event){
    this.setData({
      account:event.detail.value
    })
  },
  //获取密码
  getPassword(event){
    let value = (event.detail.value || "").trim()
    if(value){
      const reg=/[\u4e00-\u9fa5]/ig
      if(reg.test(value)){
        value=value.replace(reg,'')
        wx.showToast({
          icon:'none',
          title: '不能输入中文！',
        })
        this.setData({
          password:event.detail.value
        })
      }
      else{
        this.setData({
          password:event.detail.value
        })
      }
     }
  },
  //获取MQTT-APIKey
  getMAPIKey(event){
    let value = (event.detail.value || "").trim()
    if(value){
      const reg=/[\u4e00-\u9fa5]/ig
      if(reg.test(value)){
        value=value.replace(reg,'')
        wx.showToast({
          icon:'none',
          title: '不能输入中文！',
        })
        this.setData({
          mapikey:event.detail.value
        })
      }
      else{
        this.setData({
          mapikey:event.detail.value
        })
      }
     }
  },
   //获取MQTT-DeviceID
   getMDeviceID(event){
    let value = (event.detail.value || "").trim()
    if(value){
      const reg=/[\u4e00-\u9fa5]/ig
      if(reg.test(value)){
        value=value.replace(reg,'')
        wx.showToast({
          icon:'none',
          title: '不能输入中文！',
        })
        this.setData({
          mdeviceid:event.detail.value
        })
      }
      else{
        this.setData({
          mdeviceid:event.detail.value
        })
      }
     }
  }, 
   //获取HTTP-APIKey
  getHAPIKey(event){
    let value = (event.detail.value || "").trim()
    if(value){
      const reg=/[\u4e00-\u9fa5]/ig
      if(reg.test(value)){
        value=value.replace(reg,'')
        wx.showToast({
          icon:'none',
          title: '不能输入中文！',
        })
        this.setData({
          hapikey:event.detail.value
        })
      }
      else{
        this.setData({
          hapikey:event.detail.value
        })
      }
     }
  },
   //获取HTTP-DeviceID
   getHDeviceID(event){
    let value = (event.detail.value || "").trim()
    if(value){
      const reg=/[\u4e00-\u9fa5]/ig
      if(reg.test(value)){
        value=value.replace(reg,'')
        wx.showToast({
          icon:'none',
          title: '不能输入中文！',
        })
        this.setData({
          hdeviceid:event.detail.value
        })
      }
      else{
        this.setData({
          hdeviceid:event.detail.value
        })
      }
     }
  },
  //注册
  register(){
    let name=this.data.name
    let account=this.data.account
    let password=this.data.password
    let mapikey=this.data.mapikey
    let mdeviceid=this.data.mdeviceid
    let hapikey=this.data.hapikey
    let hdeviceid=this.data.hdeviceid
    console.log('注册')
    console.log('昵称:',name)
    console.log('手机号码:',account)
    console.log('mapikey:',mapikey)
    console.log('mdeviceid',mdeviceid)
    console.log('hapikey:',hapikey)
    console.log('hdeviceid:',hdeviceid)
    //校验昵称
    if(name.length<2){
      wx.showToast({
        icon:'none',
        title: '昵称至少2位',
      })
      return
    }else if(name.length>10)
    {
      wx.showToast({
        icon:'none',
        title: '昵称至多10位',
      })
      return
    }
    //校验手机号码
    if(account.length!=11){
      wx.showToast({
        icon:'none',
        title: '手机号码应为11位',
      })
      return
    }
    // wx.cloud.database().collection('user').where({
    //   ACCOUNT:account
    // }).get({
    //   success:function(res){
    //       repeat=true
    //   }
    // })
    // if(repeat){
    //   wx.showToast({
    //     icon:'none',
    //     title: '手机号码已注册',
    //   })
    //   return
    // }
    //校验api和deviceid
    if(mapikey==''){
      wx.showToast({
        icon:'none',
        title: 'mapikey不能为空',
      })
      return
    }
    if(mdeviceid==''){
      wx.showToast({
        icon:'none',
        title: 'mdeviceid不能为空',
      })
      return
    }
    if(hapikey==''){
      wx.showToast({
        icon:'none',
        title: 'hapikey不能为空',
      })
      return
    }
    if(hdeviceid==''){
      wx.showToast({
        icon:'none',
        title: 'hdeviceid不能为空',
      })
      return
    }
    //注册功能的实现
    wx.cloud.database().collection('user').add({
      data:{
        NAME:name,
        ACCOUNT:account,
        PASSWORD:password,
        MAPIKEY:mapikey,
        MDEVICEID:mdeviceid,
        HAPIKEY:hapikey,
        HDEVICEID:hdeviceid
      },
      success(res){
        console.log('注册成功',res)
        wx.showToast({
          title: '注册成功',
        })
        wx.navigateTo({
          url: '../login/login',
        })
      },
      fail(res){
        console.log('注册失败',res)
      }
    })
  }
})