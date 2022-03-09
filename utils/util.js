const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const requestAjax = {
  get(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'get',
        url: url,
        data: data,
        header: {
          "content-type": "application/json"
        },
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'post',
        url: url,
        data: data,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  requestAjax,
  formatTime
}
