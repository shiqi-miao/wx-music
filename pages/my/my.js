// pages/my/my.js
const api = require('../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData:"",
    vipData:{},
    selectData:"",
    isLoading:false
  },
  getData() {
    var that = this
      api.http('/flute/api/memberGradeList', 
          {
          },
      'POST', 
      true).then(res => {
              that.data.myData=res.data.list
              api.http('/flute/api/user/info', 
                  {
                      token: app.globalData.token
                  },
              'POST', 
              true).then(response => {
                      if(response.data.userInfo.gmtCreated){
                        response.data.userInfo.gmtCreated=response.data.userInfo.gmtCreated.split(' ')[0]
                      }
                      that.setData({
                          vipData: response.data.userInfo
                      })
                      that.data.myData.forEach(item=>{
                        if(that.data.vipData.memberGrade==1000){//未开通会员默认选中第一个
                          that.data.myData[0].isActive=true
                          that.data.selectData=that.data.myData[0]
                        }else{//已开通会员默认选中开通的那一个
                          if(item.gradeId==that.data.vipData.memberGrade){
                            item.isActive=true
                            that.data.selectData=item
                          }
                        }
                      })
                      that.setData({
                          myData: that.data.myData,
                          selectData: that.data.selectData
                      })
              })
              
      })
  },
  selectVip(e){
    this.data.myData.forEach(item=>{
      item.isActive=false
      this.data.myData[e.currentTarget.dataset.index].isActive=true
    })
    this.setData({
      myData:this.data.myData,
      selectData:this.data.myData[e.currentTarget.dataset.index]
    })
  },
  buyVip(){
    var that=this
    that.setData({
      isLoading:true
    })
    api.http('/flute/api/memberBuy', 
        {
          token: app.globalData.token,
          totalFee: that.data.selectData.totalFee,
          gradeId:that.data.selectData.gradeId,
          gradeName:that.data.selectData.gradeName
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
    }).catch(()=>{
      that.setData({
        isLoading:false
      })
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
        wx.navigateBack({
          delta: -1,
        })
        // wx.showToast({
        //   title: "支付成功!", duration: 1000,
        //   success: res => {
        //     setTimeout(function () {
        //       wx.navigateTo({
        //         url: '../myOrder/myOrder'
        //       })
        //     }, 1000);
        //   }
        // })
      },
      fail(res) {
        wx.showToast({
          title: "支付失败",icon:'none',duration: 1000
        })
      }
    })
  },
  reflashData(){//登录成功后刷新数据
    this.getData()
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

  }
})