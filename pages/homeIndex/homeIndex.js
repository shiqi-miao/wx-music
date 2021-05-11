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
        authList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        goodsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}], //当前分类的商品列表
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
        option1: [
            { text: '全部分类', value: 0 },
            { text: '分类1', value: 1 },
            { text: '分类2', value: 2 },
          ],
          option2: [
            { text: '全部歌曲', value: 'a' },
            { text: '免费歌曲', value: 'b' },
            { text: '付费歌曲', value: 'c' },
          ],
          value1: 0,
          value2: 'a',
    },
    showLogin() { //弹出登录弹窗
        this.setData({
            showModal: true
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
        this.getList()
    },
    toLink(e) {
        var urlType = e.currentTarget.dataset.urltype
        var jumpUrl = e.currentTarget.dataset.jumpurl
            // console.log(urlType,jumpUrl)
        if (urlType == 0) { //内链接
            if (jumpUrl != '/homeIndex/homeIndex' && jumpUrl != '/myOrder/myOrder' && jumpUrl != '/cart/cart' && jumpUrl != '/my/my') {
                //  console.log('..'+jumpUrl)
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
    /** 
     * 下拉广告
     */
    onPulling(e) {
        console.log('onPulling:', e)
    },

    onRefresh() {
        if (this._freshing) return
        this._freshing = true
        setTimeout(() => {
            this.setData({
                triggered: false,
            })
            this._freshing = false
            this.setData({ //下滑
                isHide: true
            })
        }, 500)
        setTimeout(() => {
            this.setData({
                isShow: false
            })
        }, 2500)
    },
    goHome() {
        this.setData({ //上滑
            isShow: true
        })
        setTimeout(() => {
            this.setData({
                isHide: false
            })
        }, 500)
    },
    onRestore(e) {
        console.log('onRestore:', e)
    },

    onAbort(e) {
        console.log('onAbort', e)
    },
    // 首页商品--------------------------------
    // 滚动切换标签样式
    switchTab: function(e) {
        var that = this
        var index = e.detail.current
        that.data.typeId = that.data.typeList[index].id
            //获取文章,避免点击后又触发滑动加载两次
        that.getGoodsList()
            //获取文章,避免点击后又触发滑动加载两次
        that.setData({
            currentTab: e.detail.current
        });
        that.checkCor();
    },
    // 点击分类切换当前页时改变样式,并获取商品
    swichNav: function(e) {
        var that = this
        var index = e.currentTarget.dataset.current
        that.data.typeId = that.data.typeList[index].id
        that.getGoodsList()
        var cur = e.target.dataset.current;
        if (that.data.currentTaB == cur) { return false; } else {
            that.setData({
                currentTab: cur
            })
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
        if (this.data.currentTab >= 2) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    // 首页商品-------------------------------
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取外部链接带来的参数,并且获取对应的商品信息
        if (options.q) {
            var url = decodeURIComponent(options.q)
                // var url="https://m.bud88.com/#/login?qrCodeInfo=aeea06ea520660517170"
            var qrCodeInfo = url.split('=')[1]
            this.data.qrCodeInfo = qrCodeInfo
            app.globalData.qrCodeInfo = qrCodeInfo
            this.showLightModel()
        }
        //获取外部链接带来的参数
        
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
    getBanner() { //首页信息
        var that = this
        wx.request({
            url: app.globalData.localApiUrl1 + "/seedling-flash/kupper/showHomeIndex",
            data: {
                pageNum: that.data.params.pageNum,
                pageRow: that.data.params.pageRow,
                token: app.globalData.token
            },
            method: "POST",
            success(res) {
                that.setData({
                    imgUrls: res.data.data.plantJson,
                    homeindexData: res.data.data
                })
            }
        })
    },
    conform: function() {
        wx.showToast({
            title: this.data.userInfo.nickName,
            icon: 'success',
            duration: 1500
        })
    },
    topackage() {
        wx.navigateTo({
            url: '../getCoupons/getCoupons',
        })
    },
    toMachine() {
        wx.showToast({
                title: '暂未开放~',
                icon: 'none'
            })
            // wx.navigateTo({
            //   url: '../machine/machine',
            // })
    },
    getLightData() {
        var that = this
        api.http('/seedling-flash/scan/home', { qrCodeInfo: that.data.qrCodeInfo,token: app.globalData.token},
            'POST',
            true).then(res => {
            if (res.result == 0) {
                that.setData({
                    lightData: res.data.skuInfo,
                    allData: res.data,
                    couponList:res.data.ticketList
                })
            }
        })
    },
    toVip(){
        wx.navigateTo({
          url: '../my/my',
        })
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
        }
        // this.setData({ goodsList: [], params: { pageNum: 1, pageRow: 5 } })
        // wx.pageScrollTo({ //回到顶部
        //     scrollTop: 0,
        //     duration: 0
        // })
        this.getBanner() //首页信息
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
        // if (this.data.params.pageNum >= this.data.totalPage) {
        //   return
        // }
        // this.data.params.pageNum += 1
        // this.setData({ params: this.data.params })
        // this.getBanner()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})