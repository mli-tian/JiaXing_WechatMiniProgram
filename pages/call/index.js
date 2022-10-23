/*/pages/call/index.js*/
Page({
  data: {
    list: [
      {
        id: 'view',
        name: '报警医疗',
        open: false,
        subName: ['报警求助', '医疗救助', '交通事故','高速报警救援'],
        phone: ['110', '120', '122','12122']
      }, {
        id: 'form',
        name: '代驾客服',
        open: false,
        subName: ['滴滴代驾', 'e代驾'],
        phone: ['4000551188', '4008103939']
      }, {
        id: 'feedback',
        name: '消防安全',
        open: false,
        subName: ['火警消防', '开锁电话'],
        phone: ['119', '4001816960']
      }
    ]
  },
  widgetsToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list: list
    });
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  onShareAppMessage: function (event) {
    return {
      title: '紧急联系',
    }
  }
});
