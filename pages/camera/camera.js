// pages/camera/camera.js
const app = getApp()

Page({
  data: {
    time:'',
    img:'',
    online:'',
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
      url: 'https://api.heclouds.com/devices/' + app.globalData.gh_deviceid,
      header: {
        'api-key': app.globalData.gh_apikey
      },
      method: 'get',
      success: function (res) {
        if(res.data.errno==0){
          console.log(res),
          app.globalData.gh_online = res.data.data.online,
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
      url: 'https://api.heclouds.com/devices/'+ app.globalData.gh_deviceid+'/datastreams',
      header: {
        'api-key': app.globalData.gh_apikey
      },
      method:"GET",
      success: function (res) {
        console.log(res.data)
        that.setData({ 
          img:res.data.data[0].current_value.index,
          time:res.data.data[0].update_at
        })
      },
      fail(res) {
        console.log("请求失败",res)
      }
    })
  },
  onLoad: function (option) {
    //加载时完成  将数据显示在界面
    console.log(app.globalData.gh_apikey)
    var that = this //将当前对象赋值
    setInterval(function () {
      if (that.data.online == true){   //判断设备在线再请求更新数据
        that.getData(that.data.title2);
        //console.log("轮播请求1秒触发一次");
      }else{
        console.log("设备不在线或者其他错误")
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