const api = require('../utils/http.js');
const app=getApp()
Component({
  data: {
    cartCount:0,
    selected: 0,
    borderStyle: "white",
    backgroundColor: "#fff",
    selectedColor: "#305F6A",
    color:"#9AA8AB",
    list:[
      {
       "pagePath": "/pages/homeIndex/homeIndex",
        "text": "首页",
        "iconPath": "/images/tab/tab5-1.png",
        "selectedIconPath": "/images/tab/tab5.png"
      },
      // {
      //   "pagePath": "/pages/myOrder/myOrder",
      //   "text": "订单",
      //   "iconPath": "/images/tab/tab3-1.png",
      //   "selectedIconPath": "/images/tab/tab3.png"
      // },
      // {
      //   "pagePath": "/pages/foot/foot",
      //   "text": "",
      //   "iconPath": "/images/tab/tab4-1.png",
      //   "selectedIconPath": "/images/tab/tab4.png"
      // },
      // {
      //   "pagePath": "/pages/cart/cart",
      //   "text": "购物车",
      //   "iconPath": "/images/tab/tab1-1.png",
      //   "selectedIconPath": "/images/tab/tab1.png"
      // },
      {
        "pagePath": "/pages/my/my",
        "text": "我的",
        "iconPath": "/images/tab/tab2-1.png",
        "selectedIconPath": "/images/tab/tab2.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    reflashData() {//登录成功后调用扫一扫
      wx.scanCode({
        success (res) {
          if(res.result.indexOf('qrCodeInfo')!=-1){//扫的售货机商品
            var qrCodeInfo=res.result.split('=')[1]
            app.globalData.qrCodeInfo=qrCodeInfo
            if (getCurrentPages()[0].route == 'pages/homeIndex/homeIndex'){//当前路径就在首页
              getCurrentPages()[0].setData({//直接改变首页的值
                showLightModal:true,
                qrCodeInfo:app.globalData.qrCodeInfo
              })
              getCurrentPages()[0].getLightData()//调用首页的方法
            }else{
              wx.switchTab({
                url: '../homeIndex/homeIndex',
              })
            }
          }
          if(res.result.indexOf('skuCodeBox')!=-1){//扫的盲盒
            var skuCodeBox=res.result.split('=')[1]
            app.globalData.skuCodeBox=skuCodeBox
              wx.navigateTo({
                url: '../footMark/footMark',
              })
          }
        }
      })
  },
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const index = data.index
      if(index==2){//如果该tab是扫一扫，则不跳转页面，直接执行扫一扫
        // 检验登录信息-===============================================
        if(app.globalData.userInfo && !app.globalData.token){//已经授权,但是没有登录
          getCurrentPages()[0].showLogin()
        }
        if(!app.globalData.userInfo){//还没授权
            wx.getUserProfile({
                desc: '用于完善会员资料',
                success: (res) => {
                    wx.setStorageSync("USERINFO", res.userInfo)
                    app.globalData.userInfo = res.userInfo
                    if (!app.globalData.token) { //如果没登录弹登录弹窗
                      getCurrentPages()[0].showLogin()
                    }else{//已经授权并登录
                      this.reflashData()
                    }
                    }
                })
        }
        if(app.globalData.userInfo && app.globalData.token){//已经授权并登录
          this.reflashData()
        }
        // 检验登录信息-===============================================
      }else{
        wx.switchTab({url})
      }
      this.setData({
        selected: data.index
      })
    }
  }
})