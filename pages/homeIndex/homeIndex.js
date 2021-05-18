// pages/homeIndex/homeIndex.js
//获取应用实例
const api = require('../../utils/http.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,//是否已经授权并且登录
        authList: [],
        goodsList: [], //当前分类的商品列表
        imgUrls: [],
        currentSwiper: 0,
        modelLink: "",
        topName: "",
        homeindexData: "",
        showModal: false,
        triggered: false,
        isHide: false,
        isShow: true,
        params: { pageNum: 1, pageRow: 5 },
        totalCount: 0,
        totalPage: 0,
        allData: "",
        typeList: [
            // { text: '全部分类', value: 0 },
            // { text: '分类1', value: 1 },
            // { text: '分类2', value: 2 },
          ],
          option2: [
            { text: '全部歌曲', value: '' },
            { text: '普通歌曲', value: 'Y' },
            { text: '精品歌曲', value: 'N' }
          ],
          typeId: '',
          value2: '',
          inputValue:"",
          vipData:""
    },
    showLogin() { //弹出登录弹窗
        this.setData({
            showModal: true
        })
    },
    
    getType(){
        var that = this
        api.http('/flute/api/musicScoreType', 
            {},
            'post', 
            true).then(res => {
            if (res.result == 0) {
                res.data.list.forEach(item=>{
                    item.text=item.type_name
                    item.value=item.id
                })
                res.data.list.unshift({text:"全部分类",value:""})
                that.setData({
                    typeList:res.data.list,
                    typeId:res.data.list[0].value
                })
                }
        })
    },
    getList(){
        var that = this
        api.http('/flute/api/musicScore', 
            {
                pageNum:that.data.params.pageNum,
                pageRow:that.data.params.pageRow,
                typeId:that.data.typeId,
                isFree:that.data.value2,
                skuName:that.data.inputValue
            },
        'post', 
        true).then(res => {
        if (res.result == 0) {
            that.data.goodsList=that.data.goodsList.concat(res.data.list)
            that.data.totalCount=res.data.count
            that.data.totalPage=Math.ceil(res.data.count / that.data.params.pageRow)
            that.data.goodsList.forEach(item=>{
                item.gmtCreated=item.gmtCreated.split(' ')[0]
            })
            that.setData({
                goodsList:that.data.goodsList,
                totalCount:that.data.totalCount,
                totalPage:that.data.totalPage
            })
        }
        })
    },
    toOrder(){
        wx.navigateTo({
          url: '../myOrder/myOrder',
        })
    },
    toDetail(e) {
        wx.navigateTo({
            url: '../goodsInfo/goodsInfo?skuCode=' + e.currentTarget.dataset.skucode,
        })
    },
    reflashData() {
        this.setData({
            hasUserInfo: true
        })
        this.getVip()
    },
    toLink(e) {
        var urlType = e.currentTarget.dataset.urltype
        var jumpUrl = e.currentTarget.dataset.jumpurl
        if (urlType == 0) { //内链接
            if (jumpUrl != '/homeIndex/homeIndex') {
                wx.navigateTo({
                    url: `..${jumpUrl}`
                })
            } else {
                wx.switchTab({
                    url: `..${jumpUrl}`,
                })
            }
        } else {
            wx.navigateTo({
                url: "../out/out?url=" + jumpUrl
            })
        }
    },
    swiperChange: function(e) {
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    toArticle(e) { //轮播文章
        let that = this
        wx.navigateTo({
            url: `../out/out?url=${e.currentTarget.dataset.url}`
        })
    },
    bindscrolltolower(){
        if (this.data.params.pageNum >= this.data.totalPage) {
          return
        }
        this.data.params.pageNum += 1
        this.setData({ params: this.data.params })
        this.getList()
    },
    // 首页商品-------------------------------
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({ goodsList: [], params: { pageNum: 1, pageRow: 5 } })
        this.getList()
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
    getBanner() { //轮播图
        var that = this
        api.http('/flute/api/showPlanting', 
            {},
        'get', 
        true).then(res => {
                that.setData({
                    imgUrls: res.data.plantList
                })
        })
    },
    getVip() { //会员信息
        var that = this
        api.http('/flute/api/user/info', 
            {
                token: app.globalData.token
            },
        'POST', 
        true).then(res => {
                if(res.data.userInfo.gmtCreated){
                    res.data.userInfo.gmtCreated=res.data.userInfo.gmtCreated.split(' ')[0]
                }
                that.setData({
                    vipData: res.data.userInfo
                })
        })
    },
    toVip(){
        wx.navigateTo({
          url: '../my/my',
        })
    },
    getTypeId(value){
        this.setData({
            typeId:value.detail
        })
        this.getSearch()
    },
    getFeeType(value){
        this.setData({
            value2:value.detail
        })
        this.getSearch()
    },
    getSearch(){
        this.setData({
            goodsList:[],
            params: { pageNum: 1, pageRow: 5 },
            totalCount: 0,
            totalPage: 0
        })
        this.getList()
    },
    getInput(e){
        this.setData({
            inputValue:e.detail.value
        })
        this.getSearch()
    },
    clear(){
        this.setData({
            inputValue:""
        })
        this.getSearch()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.hideTabBar()
        if (app.globalData.userInfo && app.globalData.token) { //如果已经授权并登陆
            this.setData({ hasUserInfo: true })
            this.getVip() //会员信息
        }
        this.getBanner() //首页信息
        this.getType()//分类
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})