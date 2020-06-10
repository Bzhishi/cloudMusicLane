//index.js
const app = getApp()
const baseUrl = require('../../config.js')

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    banners: [],
    cardCur: 0,
    fenleiList: [{
      icon: 'iconfont icon-meirituijian-',
      text: '每日推荐'
    }, {
      icon: 'iconfont icon-gedan',
      text: '歌单'
    }, {
      icon: 'iconfont icon-paixingbang',
      text: '排行榜'
    }, {
      icon: 'iconfont icon-diantai',
      text: '电台'
    }, {
      icon: 'iconfont icon-zhibo',
      text: '直播'
    }],
    currentTab: 1,
    icon: 'iconfont icon-sousuo',
    limit: 6,
    recomSongList: []
  },

  onLoad: function() {
    console.log(app)
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    // 获取轮播图
    wx.request({
      url: `${baseUrl}/banner`,
      data: {
        type: 2
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // console.log(res)
        this.setData({
          banners: res.data.banners
        })
        // console.log(this.data.banners)
      }
    })

    // 推荐歌单
    wx.request({
      url: `${baseUrl}/personalized?limit=${this.data.limit}`,
      header: {
        "content-type": "application/json"
      },
      success: res => {
        console.log(res)
        let result = res.data.result;
        result.forEach((item) => {
          item.playCount = (item.playCount / 10000).toFixed(1);
        })
        this.setData({
          recomSongList: result
        })
      },
      fail: e => {
        console.log(e)
      }
    })
  },

  // 标签页切换
  swichNav(e) {
    let currentNum = e.target.dataset.current;
    // console.log(currentNum, this.data.currentTab)
    if(this.data.currentTab == currentNum) {
      return false
    } else {
      this.setData({
        currentTab: currentNum
      })
    }
  },
  // 标签页内容切换
  swiperChange(e) {
    // console.log(e);
    this.setData({
      currentTab: e.detail.current
    })
  },

  // 轮播图详情
  songDetail(e) {
    let id = e.target.dataset.url.split('?')[1];
    console.log(id)
    wx.request({
      url: 'https://musicapi.leanapp.cn/song/detail?' + id,
      success: res => {
        console.log(res)
      }
    })
  },

  // 获取推荐歌单



  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      banners: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },

})
