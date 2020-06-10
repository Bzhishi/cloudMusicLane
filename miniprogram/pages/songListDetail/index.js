const baseUrl = require('../../config.js')

Page({
  data: {
    playlist: {},
  },
  onLoad: function(options) {
    // let that = this;
    console.log(options);
    // let id = options.id;
    let id = '5030453482';
    let type = 0;
    wx.request({
      url: `${baseUrl}/playlist/detail?id=${id}&type=0`,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res.data.playlist)
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