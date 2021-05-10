// component/model/model.js
const api = require('../../utils/http.js');
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showModal: {
            type: Boolean,
            value: true
        },
        showCoupon: {
            type: Boolean,
            value: false
        },
        hasUserInfo:{
          type: Boolean,
          value: false
        },
        lightData: {
          type: Object
        },
        allData: {
          type: Object
        },
        couponList: {
          type: Array
        }
    },
    options: {
        multipleSlots: true
    },
    /**
     * 组件的初始数据
     */
    data: { 
      isLoading:false,
      orderCode:"",
      couponData:{subNum:0},
    },
    attached(){
      if(app.globalData.userInfo && app.globalData.token){//如果已经授权并登陆
        this.setData({hasUserInfo:true})
      }
    },
    /**
     * 组件的方法列表
     */ 
    methods: {
      getUserProfile: function (e) {
        if(app.globalData.userInfo){//已经授权,但是没有登录
          this.triggerEvent('showLogin')
        }else{//还没授权
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                wx.setStorageSync("USERINFO", res.userInfo)
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo
                })
                if (!app.globalData.token) {//如果没登录弹登录弹窗
                  this.triggerEvent('showLogin')
                }else{
                  this.setData({
                    hasUserInfo:true
                  })
                  this.toPay()//支付
                }
              }
            })
        }
          
      },
      chooseCoupon(){
        if(this.data.couponList.length>0){
          this.setData({
            showCoupon: true
          })
        }
      },
      selectCoupon(e){
        this.data.couponList.forEach(item=>{
          item.isSelect=false
        })
        this.data.couponList[e.currentTarget.dataset.id].isSelect=true
        this.data.couponData=this.data.couponList[e.currentTarget.dataset.id]//选择的优惠券
        this.setData({
          couponList:this.data.couponList,
          showCoupon:false,
          couponData:this.data.couponData
        })
      },
      clearCoupon(){
        this.data.couponList.forEach(item=>{
          item.isSelect=false
        })
        this.setData({
          couponList:this.data.couponList,
          couponData:{subNum:0}
        })
      },
      toPay(){
        var that = this
        that.setData({
          isLoading:true
        })
        that.data.lightData.token=app.globalData.token
        that.data.lightData.channelId=that.data.allData.channelId
        that.data.lightData.sequence=that.data.allData.sequence
        that.data.lightData.vendCode=that.data.allData.vendCode
        that.data.lightData.ticketId=that.data.couponData.ticketId
        that.data.lightData.couponDesc=that.data.couponData.downInfo
        that.data.lightData.preferentialPrice=that.data.couponData.subNum
        api.http('/seedling-flash/offline/goods', 
            that.data.lightData,
          'POST', 
          true).then(res => {
            if (res.result == 0) {
              that.setData({
                isLoading:false,
                orderCode:res.data.orderCode
              })
              api.http('/seedling-flash/try/orderPay', 
                  {
                    token: app.globalData.token,
                    totalFee: Math.round((parseFloat(that.data.lightData.skuPrice) - parseFloat(that.data.couponData.subNum))*100)/100>=0 ? Math.round((parseFloat(that.data.lightData.skuPrice) - parseFloat(that.data.couponData.subNum))*100)/100 : 0,
                    orderCode:that.data.orderCode
                    },
                'POST', 
                true).then(res => {
                  if (res.result == 0) {
                    if(!res.data.flag){//金额大于0,调微信支付
                      let params = res.data
                      that.toWxPay(params)
                    }else{//金额是0,直接返回成功,不需要调起微信支付
                      wx.showToast({
                        title: "支付成功!", duration: 1000,
                        success: res => {
                          that.cancel()
                        }
                      })
                    }
                  }else{

                  }
              })
            }else{
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
                that.cancel()
              }
            })
          },
          fail(res) {
            that.cancel()
            wx.showToast({
              title: "支付失败!",icon:"none", duration: 1000
            })
          }
        })
      },
      cancel() {
        this.setData({
          showModal: false,
          isLoading:false
        })
        this.triggerEvent('cancelScanInfo')
        this.clearCoupon()
      },
        
    }
})
