// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:null,
    typeList:"",
    articleList:[],
    params: { pageNum: 1, pageRow: 5 },
    totalCount: 0,
    totalPage: 0,
  },
  getSearch(){
    var that = this
    that.setData({
      params: { pageNum: 1, pageRow: 5 }
    })
      that.getList()
  },
  changeSearch(e){//监听输入框
    var that = this
    that.setData({
      params: { pageNum: 1, pageRow: 5 },
      inputValue: e.detail.value,
      articleList: []
    })
    wx.request({
      url: app.globalData.localApiUrl1 + "/seedling-flash/kupper/showArticleByType",
      data: {
        searchText: e.detail.value,
        pageNum: that.data.params.pageNum,
        pageRow: that.data.params.pageRow
      },
      method: "POST",
      success(res) {
        that.data.articleList = that.data.articleList.concat(res.data.data.articleList)
        that.setData({
          articleList: that.data.articleList,
          totalCount: res.data.data.count,
          totalPage: Math.ceil(res.data.data.count / that.data.params.pageRow)
        })
      }
    })
  },
  getList(){
    var that=this
    wx.request({
      url: app.globalData.localApiUrl1 + "/seedling-flash/kupper/showArticleByType",
      data: { searchText: that.data.inputValue,
              pageNum:that.data.params.pageNum,
              pageRow:that.data.params.pageRow
      },
      method: "POST",
      success(res) {
        that.data.articleList = that.data.articleList.concat(res.data.data.articleList)
        that.setData({
          articleList: that.data.articleList,
          totalCount: res.data.data.count,
          totalPage: Math.ceil(res.data.data.count / that.data.params.pageRow)
        })
      }
    })
  },
  toArticle(e) {//轮播文章跳转
    var that = this
    var articleId = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.localApiUrl1 + "/seedling-flash/kupper/addArticleUser",//用户点击量
      data: {
        articleId: articleId
      },
      method: "POST",
      success(res) {
      }
    })
    wx.navigateTo({
      url: `../out/out?url=${e.currentTarget.dataset.url}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType()
  },
  getType(){
    var that=this
    wx.request({
      url: app.globalData.localApiUrl1 + "/seedling-flash/kupper/showAllArticleSearch",
      data: {},
      method: "GET",
      success(res) {
        that.setData({
          typeList: res.data.data.articleSearch
        })
      }
    })
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  choose(e){
    this.setData({
      inputValue: e.currentTarget.dataset.name,
      params: { pageNum: 1, pageRow: 5 },
      articleList: []
    })
    this.getList()
  },
  clear:function(){
    this.setData({
      inputValue:''
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