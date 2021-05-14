// pages/myOrder/myOrder.js
const api = require('../../utils/http.js');
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[ 
      {
     skuName: "哥斯达黎加宝藏庄园", gmtCreated: "2019-03-05 11:11:11", payPrice: "15.00",detail:"描述描述描述"}
    ],
    params: { pageNum: 1, pageRow: 5 },
    totalCount: 0,
    totalPage: 0,
    userInfo:{},
    loading:false
  },
  getList() {
    var that = this
    that.setData({loading:true})
    api.http('/flute/api/order',
        {
          pageNum:that.data.params.pageNum,
          pageRow: that.data.params.pageRow,
          token: app.globalData.token
          },
      'POST', 
      true).then(res => {
      if (res.result == 0) {
            that.setData({loading:false})
            that.data.list=that.data.list.concat(res.data.list)
            that.setData({
              list: that.data.list,
              totalCount: res.data.totalCount,
              totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
            })
            
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    if (this.data.params.pageNum >= this.data.totalPage) {
      return
    }
    this.data.params.pageNum += 1
    this.setData({ params: this.data.params })
      this.getList()
  }
})