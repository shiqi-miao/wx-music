//app.js
import locales from "./utils/locales";
//语言
wx.langFlag = "en";
wx.lang = locales.cn;

App({
  onLaunch: function () {
    //语言
    wx.getSystemInfo({
        success: function(res) {
            wx.lang = res.language === "en" ? locales.en : locales.cn;
            wx.langFlag = res.language === "en" ? "en" : "zh";
        }
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    /* 版本自动更新代码 */
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // console.log(res.hasUpdate) // 请求完新版本信息的回调 true说明有更新
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新检测', // 此处可自定义提示标题
        content: '检测到新版本，是否重启小程序？', // 此处可自定义提示消息内容
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
  onShow: function (options) {//从光ID小程序跳转过来,获取携带的临时码 outId
    var that=this
    // options.query.outId="dN/sNGKwUqkyWRJF/Y7xxTZs/cERCxzcWbWJjpSu9Fw="
    // options.query.outId="111"
    if(wx.getStorageSync('userInfo')){//避免that.globalData.userInfo过期,如果缓存里有就拿缓存里的
      that.globalData.userInfo=wx.getStorageSync('userInfo')
    }
    if(options.query.outId){
      // wx.showToast({ title: options.query.outId, icon: "none", duration: 2000})
      wx.request({//检验outId是否可用
        url: that.globalData.localApiUrl1 + "/seedling-flash/kupper/api/getUserInfoByOpenToken",
        data: {
          openToken: options.query.outId
        },
        method: "POST",
        success(res) {
          that.globalData.checkOutId=true
          if(res.data.result=='0'){
            wx.setStorageSync("TOKEN", res.data.data.userInfo.token)
            that.globalData.token=res.data.data.userInfo.token
            that.globalData.outId = wx.getStorageSync('outId')
            that.globalData.userInfo=res.data.data.userInfo
            wx.setStorageSync("userInfo", res.data.data.userInfo)//第一次光id验证过之后，就把他存到缓存里
          }else{
            wx.showToast({ title: "登录状态失效", icon: "none", duration: 2000})
          }
          if (that.checkOutIdReadyCallback){//callBack,直到checkOutId=true(即检验OutId的请求执行完或者正常登陆不需要检测的时候),才停止访问这个接口,否则会一直访问(见my.js的onShow)
            that.checkOutIdReadyCallback(res);
          }
        }
      })
      
    }else{//正常登录
      that.globalData.checkOutId=true
    }
  },
  globalData: {
    cartCount:0,
    qrCodeInfo:"",//扫一扫url后所带的参数,用来获得扫到商品的具体信息
    skuCodeBox:"",//扫一扫url后所带的参数,用来获得盲盒背后的具体信息
    checkOutId:false,//判断如果需要检验光ID传过来的outId,请求是否已经执行完
    outId:"",//从光ID小程序跳转过来,获取携带的临时码 outId
    logined:false,
    code:"",
    phone: wx.getStorageSync('Phone'),
    userInfo: wx.getStorageSync('USERINFO'),//微信登录用户的信息比如地区,性别,昵称等等等等,
    token: wx.getStorageSync('TOKEN'),
    // token: "jhQ/bypXQ26NcioNIY/PkRPKFtJ4utw3USrnDJcixFw=13",
    // localApiUrl1: "http://192.168.1.171:8181",//shixian
    localApiUrl1: "http://192.168.1.214:8181",//binge
    // localApiUrl1: "http://192.168.2.69:8181",//ziqiang
    // localApiUrl1: "https://test.robooot.com:1443",//test
    // localApiUrl1: "https://m.robooot.com:1443",//prod
  }
})