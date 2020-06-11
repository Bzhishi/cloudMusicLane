const baseUrl = require('../../config.js')

Page({
  data: {
    playlist: {},
    userInfo: ''
  },
  onLoad: function(options) {
    let that = this;
    console.log(options);
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        console.log(res.data)
        that.setData({
          userInfo: res.data
        })
      }
    })
    let id = options.id;
    console.log(this.data.userInfo)
    // let id = '5030453482';
    // let type = 0;
    wx.request({
      // url: `${baseUrl}/playlist/detail?id=${id}&type=0&token=${that.data.userInfo.token}`,
      url: `http://musicapi.leanapp.cn/playlist/detail`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        'id': id,
        // 'type': 0,
        // 'token': that.data.userInfo.token
      },
      success: res => {
        console.log(res.data.playlist.tracks)
        this.setData({
          playlist: res.data.playlist,
        })
      },
      fail: e => {
        console.log(e)
      }
    })
  },

})