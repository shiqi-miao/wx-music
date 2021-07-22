// pages/vidioInfo/vidioInfo.js
const api = require('../../utils/http.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    showModal: false,//登录弹窗
    infoData:{},
    skuCode:'',
    loading:false,
    showPopup:false
  },
  onUnload:function(){
  },
  showLogin(){//弹出登录弹窗
    this.setData({
      showModal:true
    })
  },
  getUserProfile: function(e) {
    if(app.globalData.userInfo){//已经授权,但是没有登录
        this.showLogin()
    }else{//还没授权
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              wx.setStorageSync("USERINFO", res.userInfo)
              app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo
                })
                if (!app.globalData.token) { //如果没登录弹登录弹窗
                    this.showLogin()
                }
                }
            })
    }
},
  onClose(){
    wx.navigateBack({
      delta: -1,
    })
  },
  getData() {//商品信息
    var that = this
    api.http('/flute/api/videoDetails', 
        {
          token: app.globalData.token,
          skuCode:that.data.skuCode,
          },
      'POST', 
      true).then(res => {
      if (res.result == 0) {
        that.setData({
          infoData:res.data.details
        })
        if(res.data.flag){
          wx.redirectTo({
              url: "../out/out?url=" + res.data.details.videoUrl
          })
        }else{
          that.setData({
            showPopup:true
          })
        }
      }  
    }).catch(()=>{
    })
  },
  buyVip(){//开通vip
    wx.navigateTo({
      url: '../my/my',
    })
  },
  buyOne(){//单曲购买
    var that=this
    that.setData({
      isLoading:true
    })
    api.http('/flute/api/skuBuy', 
        {
          orderType:"VIDEO",
          token: app.globalData.token,
          totalFee: that.data.infoData.salePrice,
          skuCode:that.data.infoData.skuCode,
          skuName:that.data.infoData.skuName
          },
      'POST', 
      true).then(res => {
        if (res.result == 0) {
            let params = res.data
            that.toWxPay(params)
        }else{
          wx.showToast({
            title: "支付失败",icon:'none',duration: 1000
          })
          that.setData({
            isLoading:false
          })
        }
    })
  },
  toWxPay(data) {//调起微信支付
    var that=this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.sign,
      success(res) {//支付成功跳转我的订单页面
        wx.showToast({
          title: "支付成功!", duration: 1000,
          success: res => {
            that.setData({
              showPopup:false
            })
            that.getData()
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: "支付失败",icon:'none',duration: 1000
        })
      }
    })
  },
  reflashData() {
    this.setData({
        hasUserInfo: true
    })
    this.getData()
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      skuCode:options.skuCode
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.userInfo && app.globalData.token){//如果已经授权并登陆
      this.setData({hasUserInfo:true})
    }
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 监听滚动条
   */
  onPageScroll (e) { 
    
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    
  }
})