// pages/my/my.js
const api = require('../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData:"",
    bartisraStatusType:"",//咖啡师审核进度
    showModal: false,//登录弹窗
    showRoleModal:false,//微信授权蒙板
    userInfo: {},
    hasUserInfo: false,
  },
  showLogin(){//弹出登录弹窗
    this.setData({
      showModal:true
    })
  },
  toID() {//跳转光ID小程序
    if (!app.globalData.token) {//如果没登录弹登录弹窗
      this.showLogin()
    } else {
      wx.navigateToMiniProgram({
        appId: "wx727066c68a67aed5",
        path: "/pages/main/main?openToken=" + app.globalData.token,
        success(res) {
        }
      })
    }

  },
  toAddress(){
    wx.navigateTo({
      url: '../address/address?isMy=1',
    })
  },
  editInfo() {//查看咖啡师个人信息
    wx.navigateTo({
      url: '../barista/barista?sn=' + this.data.myData.userDetails.sn,
    })
  },  
  toeditInfo(){//直接进入咖啡师个人信息的编辑页面
    wx.navigateTo({
      url: '../editInfo/editInfo?sn=' + this.data.myData.userDetails.sn,
    })
  },
  // editInfo() {//编辑咖啡师个人信息
  //   wx.navigateTo({
  //     url: '../editInfo/editInfo?sn=' + this.data.myData.userDetails.sn,
  //   })
  // },  
  onTabItemTap(item) {
    
  },
  getData() {
    var that = this
    wx.request({
      url: app.globalData.localApiUrl1 + "/seedling-flash/user/showMinePage",
      data: {
        token: app.globalData.token
      },
      method: "POST",
      success(res) {
        that.setData({
          myData:res.data.data,
          bartisraStatusType: res.data.data.bartisraStatusType
        })
        that.getCart()
      }
    })
  },
  toBuy(e){
    let index = e.currentTarget.dataset.index
    let item = this.data.myData.couponPic[index]
    if (item.linkType=='A'){
      wx.navigateTo({
        url: '../couponDetail/couponDetail?id=' + item.giftUuid + '&type=' + item.type + '&typeId=' + item.detailsId + '&giftName=' + item.payTitle,
      })
    }else{
      wx.navigateTo({
        url: '../getCoupons/getCoupons'
      })
    }
    
  },
  becoffee(){
    wx.navigateTo({
      url: '../beArista/beArista'
    })
  },
  toEdit(){
    wx.navigateTo({
      url: '../edit/edit'
    })
  },
  toIntegral(){
    wx.navigateTo({
      url: '../integral/integral'
    })
  },
  toCoupon() {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  toMyActivity(){
    wx.navigateTo({
      url: "../mySubscribe/mySubscribe?status=" + this.data.bartisraStatusType
    })
  },
  toMyOrder() {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  toOrder() {
    wx.navigateTo({
      url: '../policy/policy'
    })
  },
  toCart(){//跳转购物车
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  reflashData(){//登录成功后刷新数据
    this.getData()
  },
  getCart() { //购物车数量
      var that = this
      api.http('/seedling-flash/mall/cartCount', {
              token: app.globalData.token
          },
          'POST',
          true).then(res => {
          if (res.result == 0) {
              that.setData({
                  cartCount: res.data.cartCount
              })
              that.getTabBar().setData({//改变tabbar上购物车的值
                  cartCount: res.data.cartCount
                })
          }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    //控制自定义tab的显示
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 4
        })
      }
    //控制自定义tab的显示
    if (app.globalData.checkOutId){//这个时候表示检验OutId的请求执行完或者正常登陆
      //onShow里面的操作
      this.getData()//每次进来都要刷新
      this.setData({ showRoleModal: false })
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
          showRoleModal: false,
        })
        if (!app.globalData.token) {//如果没登录弹登录弹窗
          this.showLogin()
        }
      }
      if (!this.data.hasUserInfo) {//授权弹出框出现形式修改
        this.setData({
          showRoleModal: true,
        })
      }
      this.getData()
      }else{
        app.checkOutIdReadyCallback = res => {//重复执行检验的操作直到获取到结果
          this.getData()//每次进来都要刷新
          this.setData({ showRoleModal: false })
          if (app.globalData.userInfo) {
            this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true,
              showRoleModal: false,
            })
            if (!app.globalData.token) {//如果没登录弹登录弹窗
              this.showLogin()
            }
          }
          if (!this.data.hasUserInfo) {//授权弹出框出现形式修改
            this.setData({
              showRoleModal: true,
            })
          }
          this.getData()
        };
      }
      
    
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

  }
})