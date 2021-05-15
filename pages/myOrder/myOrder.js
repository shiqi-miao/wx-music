// pages/myOrder/myOrder.js
const api = require('../../utils/http.js');
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab:"0",
    list:[ 
      // [
      //   { machine: "海创园自贩机01", name: "哥斯达黎加宝藏庄园", time: "2019-03-05 11:11:11", money: "15.00", type:"微信免密"}
      // ],
      // [
      //   { machine: "海创园自贩机01", name: "哥斯达黎加宝藏庄园", time: "2019-03-05 11:11:11", money: "15.00", type:"微信免密"},
      //   { machine: "海创园自贩机01", name: "哥斯达黎加宝藏庄园", time: "2019-03-05 11:11:11", money: "15.00", type:"微信免密"}
      // ],
    ],
    params: { pageNum: 1, pageRow: 5 },
    totalCount: 0,
    totalPage: 0,
    showModal: false,//登录弹窗
    showRoleModal:false,//微信授权蒙板
    hasUserInfo: false,
    userInfo:{},
    min:0,
    mia:10,
    loading:false
  },
  showLogin(){//弹出登录弹窗
    this.setData({
      showModal:true
    })
  },
  changeTab(e) {
    if (e.target.dataset.id=='0') {//全部
      this.setData({
        activeTab: "0",
        list: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    } else if (e.target.dataset.id=='1') {//待发货
      
      this.setData({
        activeTab: "1",
        listB: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    } else if (e.target.dataset.id=='2')  {//已发货
      
      this.setData({
        activeTab: "2",
        listC: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    }else if (e.target.dataset.id=='3')  {//已完成
      
      this.setData({
        activeTab: "3",
        listD: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    }else if (e.target.dataset.id=='4')  {//待付款
      
      this.setData({
        activeTab: "4",
        listE: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    }else if (e.target.dataset.id=='5')  {//已取消
      
      this.setData({
        activeTab: "5",
        listF: [],
        params: { pageNum: 1, pageRow: 5 }
      })
      this.getList()
    }
  },
  getList() {
    var that = this
    var isPay=""
    if(that.data.activeTab=='1'){
      isPay="W"
    }
    if(that.data.activeTab=='2'){
      isPay="Y"
    }
    if(that.data.activeTab=='3'){
      isPay="1"
    }
    if(that.data.activeTab=='4'){
      isPay="0"
    }
    if(that.data.activeTab=='0'){
      isPay=""
    }
    if(that.data.activeTab=='5'){
      isPay="-1"
    }
    that.setData({loading:true})
    api.http('/flute/api/order',
        {
          pageNum:that.data.params.pageNum,
          pageRow: that.data.params.pageRow,
          token: app.globalData.token,
          isPay:isPay
          },
      'POST', 
      true).then(res => {
      if (res.result == 0) {
            that.setData({loading:false})
            if(that.data.activeTab=='0'){
              that.data.list=that.data.list.concat(res.data.list)
              that.data.list.forEach(item=>{
                if(item.countDown){//倒计时
                  item.min=parseInt(Number(item.countDown)/1000/60)
                  item.mia=parseInt((Number(item.countDown)-item.min*60*1000)/1000)
                  setInterval(()=>{
                    if(item.mia>1){
                      item.mia-=1
                      that.setData({
                        list:that.data.list
                      })
                    }else{
                      if(item.min==0){
                        item.mia=0
                        that.setData({
                          list:that.data.list
                        })
                        return
                      }
                      item.min-=1
                      item.mia=59
                      that.setData({
                        list:that.data.list
                      })
                    }
                  },1000)
                }
              })
              that.setData({
                list: that.data.list,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }else if(that.data.activeTab=='1'){
              that.data.listB=that.data.listB.concat(res.data.shoppingOrderInfoList)
              that.setData({
                listB: that.data.listB,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }else if(that.data.activeTab=='2'){
              that.data.listC=that.data.listC.concat(res.data.shoppingOrderInfoList)
              that.setData({
                listC: that.data.listC,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }else if(that.data.activeTab=='3'){
              that.data.listD=that.data.listD.concat(res.data.shoppingOrderInfoList)
              that.setData({
                listD: that.data.listD,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }else if(that.data.activeTab=='4'){
              that.data.listE=that.data.listE.concat(res.data.shoppingOrderInfoList)
              that.data.listE.forEach(item=>{
                if(item.countDown){//倒计时
                  item.min=parseInt(Number(item.countDown)/1000/60)
                  item.mia=parseInt((Number(item.countDown)-item.min*60*1000)/1000)
                  setInterval(()=>{
                    if(item.mia>1){
                      item.mia-=1
                      that.setData({
                        listE:that.data.listE
                      })
                    }else{
                      if(item.min==0){
                        item.mia=0
                        that.setData({
                          listE:that.data.listE
                        })
                        return
                      }
                      item.min-=1
                      item.mia=59
                      that.setData({
                        listE:that.data.listE
                      })
                    }
                  },1000)
                }
              })
              that.setData({
                listE: that.data.listE,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }else if(that.data.activeTab=='5'){
              that.data.listF=that.data.listF.concat(res.data.shoppingOrderInfoList)
              that.setData({
                listF: that.data.listF,
                totalCount: res.data.totalCount,
                totalPage: Math.ceil(res.data.totalCount / that.data.params.pageRow)
              })
            }
      }
    })
  },
  reflashData(){//登录成功后刷新数据
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo && app.globalData.token){
        this.data.params.pageNum=1
        this.setData({
          list:[],
          params:this.data.params,
          activeTab: "0"
        })
        this.getList()
    }
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
          selected: 1
        })
      }
    //控制自定义tab的显示
    this.setData({ 
      showRoleModal: false
    })
    // 微信授权和登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showRoleModal: false,
      })
      if (!app.globalData.token) {//如果没登录弹登录弹窗
        this.showLogin()
      }else{
        // this.data.params.pageNum=1
        // this.setData({
        //   list:[],
        //   params:this.data.params
        // })
        // this.getList()
      }
    }
    // 微信授权和登录
    if (!this.data.hasUserInfo) {//授权弹出框出现形式修改
      this.setData({
        showRoleModal: true,
      })
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
    if (this.data.params.pageNum >= this.data.totalPage) {
      return
    }
    this.data.params.pageNum += 1
    this.setData({ params: this.data.params })
      this.getList()
  }
})