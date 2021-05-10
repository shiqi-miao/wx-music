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
        goodsList: [], //当前分类的商品列表
        allGoodsList: [], //按分类的商品列表
        recommendList: [],
        advList: [],
        imgUrls: [],
        currentSwiper: 0,
        modelLink: "",
        topName: "",
        homeindexData: "",
        showModal: false,
        cartCount: 0, //购物车数量
        // showAdModal:false,//广告弹窗
        showLightModal: false, //扫一扫购买弹窗
        triggered: false,
        isHide: false,
        isShow: true,
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        params: { pageNum: 1, pageRow: 5 },
        totalCount: 0,
        totalPage: 0,
        typeList: [
            // {
            //   id: 1,
            //   typeName: "精品挂耳"
            // },
            // {
            //   id: 2,
            //   typeName: "冻干粉"
            // },
            // {
            //   id: 3,
            //   typeName: "咖啡冲泡"
            // },
            // {
            //   id: 4,
            //   typeName: "周边"
            // },
        ],
        typeId: "", //当前激活的typeId
        lightData: "",
        allData: "",
        couponList:[
            // {isSelect:false,ticketId:1,preferentialPrice:15,ruleName:"新人优惠券",endTimeDesc:"2021/01/21",couponDesc:"全场通用"},
            // {isSelect:false,ticketId:1,preferentialPrice:5,ruleName:"新人优惠券",endTimeDesc:"2021/01/21",couponDesc:"全场通用"},
            // {isSelect:false,ticketId:1,preferentialPrice:2,ruleName:"新人优惠券",endTimeDesc:"2021/01/21",couponDesc:"全场通用"},
          ],
        qrCodeInfo: "", //url所带的扫一扫商品弹窗信息
        minh: "", //首页滚动部分的高度
    },
    toSearch(){
        wx.navigateTo({
            url: '../search/search',
        })
    },
    toVip(){
        wx.switchTab({
            url: '../my/my',
        })
    },
    showLightModel() { //弹出扫一扫购买框
        this.setData({
            showLightModal: true,
            qrCodeInfo: app.globalData.qrCodeInfo
        })
        this.getLightData() //扫一扫商品信息
    },
    cancelScanInfo() { //清除扫一扫弹框信息
        app.globalData.qrCodeInfo = ""
        this.setData({
            qrCodeInfo: ""
        })
    },
    showLogin() { //弹出登录弹窗
        this.setData({
            showModal: true
        })
    },
    toCart() { //跳转购物车
        wx.navigateTo({
            url: '../cart/cart',
        })
    },
    bindLightId() { //光Id页面
        wx.navigateTo({
            url: '../../lightPages/main/main',
        })
    },
    toID() { //跳转光ID小程序
        if (app.globalData.userInfo) {
            this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true,
                    showModal: false,
                })
        }
        if (!this.data.hasUserInfo) { //授权弹出框出现形式修改
            this.setData({
                showModal: true,
            })
        } else {
            if (!app.globalData.token) { //如果没登录弹登录弹窗
                this.showLogin()
                    // wx.navigateTo({
                    //   url: '../login/login?isID=1'
                    // })
            } else {
                wx.navigateToMiniProgram({
                    appId: "wx727066c68a67aed5",
                    path: "/pages/main/main?openToken=" + app.globalData.token,
                    success(res) {}
                })
            }
        }
    },
    putCart(e) { //加入购物车
        var that = this
        api.http('/seedling-flash/mall/addCart', {
                token: app.globalData.token,
                skuCode: e.target.dataset.skucode,
                skuNum: 1
            },
            'POST',
            true).then(res => {
            if (res.result == 0) {
                wx.showToast({ title: "加入购物车成功！" })
                var that = this
                that.getList()
                that.getRecommend()
                that.getCart() //购物车信息
            }
        })
    },
    toDetail(e) {
        wx.navigateTo({
            url: '../goodsInfo/goodsInfo?skuCode=' + e.currentTarget.dataset.skucode,
        })
    },
    toFoot() {
        wx.navigateTo({
            url: '../footMark/footMark'
        })
    },
    reflashData() {
        this.setData({
            hasUserInfo: true
        })
        this.getRecommend()
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
    toShop() {
        wx.navigateTo({
            url: "../shop/shop"
        })
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
    getData() { //商品分类
        var that = this
        wx.request({
            url: app.globalData.localApiUrl1 + "/seedling-flash/selectType",
            data: {},
            method: "GET",
            success(res) {
                that.setData({
                    typeList: res.data.data.list
                })
                that.getList()
            }
        })
    },
    getList() { //商品列表
        var that = this
        api.http('/seedling-flash/mall/showSku', {
                token: app.globalData.token
            },
            'POST',
            true).then(res => {
            if (res.result == 0) {
                var constants = []
                that.data.typeList.forEach(item => {
                    var data = {}
                    data.id = item.id
                    data.category = []
                    constants.push(data)
                })
                res.data.list.forEach(item => {
                    constants.forEach(i => {
                        if (item.typeId == i.id) {
                            i.category.push(item)
                        }
                    })
                })
                if(!that.data.typeId){
                    that.setData({
                        typeId: that.data.typeList[0].id,
                        allGoodsList: constants
                    })
                }else{
                    that.setData({
                        allGoodsList: constants
                    })
                }
                that.getGoodsList()
            }
        })
    },
    getGoodsList() { //根据当前分类Id得出当前分类的所有商品列表
        this.data.allGoodsList.forEach(item => {
            if (item.id == this.data.typeId) {
                this.setData({
                    goodsList: item.category
                })

                // ljy 修改
                this.setData({
                    minh:Math.ceil(this.data.goodsList.length/2)
                })
                // if (this.data.goodsList.length > 2) {
                //     this.setData({
                //         minh: false
                //     })
                // } else {
                //     this.setData({
                //         minh: true
                //     })
                // }
            }
        })
    },
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
    getRecommend() { //推荐商品
        var that = this
        api.http('/seedling-flash/home/recommend', {
                token: app.globalData.token
            },
            'POST',
            true).then(res => {
            if (res.result == 0) {
                that.setData({
                    recommendList: res.data.list
                })
            }
        })
    },
    getAdv() { //广告模块
        var that = this
        api.http('/seedling-flash/findRegion', {},
            'POST',
            true).then(res => {
            if (res.result == 0) {
                that.setData({
                    advList: res.data.list
                })
            }
        })
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //控制自定义tab的显示
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        //控制自定义tab的显示
        if (app.globalData.qrCodeInfo) { //扫一扫扫售货机商品
            this.showLightModel()
        }
        if (app.globalData.userInfo && app.globalData.token) { //如果已经授权并登陆
            this.setData({ hasUserInfo: true })
        }
        this.setData({ goodsList: [], params: { pageNum: 1, pageRow: 5 } })
        // wx.pageScrollTo({ //回到顶部
        //     scrollTop: 0,
        //     duration: 0
        // })
        this.getBanner() //首页信息
        this.getCart() //购物车信息
        this.getData() //首页商品分类
        this.getRecommend() //推荐商品
        this.getAdv() //广告模块
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.setData({
            showAdModal: false
        })
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