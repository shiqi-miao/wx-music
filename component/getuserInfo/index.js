// component/model/model.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      authorize: {
            type: Boolean,
            value: true
        },
        showTitel: {
            type: Boolean,
            value: false
        },
        showFooter: {
            type: Boolean,
            value: true
        }
    },
    options: {
        multipleSlots: true
    },
    /**
     * 组件的初始数据
     */
    data: { 
      authorize: "false",
      authCode: "获取验证码",
      isDisabled: false,
    },

    /**
     * 组件的方法列表
     */ 
    methods: {
      getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          authorize: false
        })
        wx.showTabBar();
      },
      showTip(){
        this.setData({
          authorize: "true"
        })
      },
      hideTip() {
        this.setData({
          authorize: "false"
        })
      },
      commitInfo(){
        this.setData({
          authorize: false
            })
        wx.showTabBar();
      },
      cancel() {
        this.setData({
          authorize: false
        })
        wx.showTabBar();
      },
        // showDialogBtn() {
        //     this.setData({
        //         showModal: true
        //     })
        // }, 
        // preventTouchMove() {},
        // hideModal() {
        //     this.setData({
        //         showModal: false
        //     })
        // },
        // onConfirm() {
        //     this.hideModal()
        // },
        // closeModel() {
        //     this.triggerEvent("closeModel", { showModal: false })
        // },
        // toLogin() {
        //     wx.navigateTo({
        //         url: "../login/login"
        //     })
        //     this.closeModel()
        // },
        // getPhoneNumber(e) {
        //     let that = this
        //     if (e.detail.errMsg == "getPhoneNumber:ok") {
        //         console.log(e)
        //         wx.login({
        //             success: res => {
        //                 that.closeModel()
        //                 console.log("e.detail", e.detail)
        //                 that.login(e.detail, res.code)
        //               console.log("code", res)
        //             }
        //         })
        //     }
        // },
        // login(phoneData, code) {
        //     let that = this
        //     wx.request({
        //       url: app.globalData.localApiUrl + "/seedling-applet/api/getKey",//获取session_key 
        //       data: {
        //         sessionCode: code
        //       },
        //       method: "POST",
        //       success(res) {
        //         wx.request({
        //           url: app.globalData.localApiUrl + "/seedling-applet/api/wechatTranslate",//获取手机号码
        //           method: "post",
        //           data: {
        //             encryptData: phoneData.encryptedData,
        //             iv: phoneData.iv,
        //             sessionKey: res.data.data.sessionKey
        //           },
        //           success(res) {
        //             app.globalData.phone = res.data.data.phoneNumber
        //             console.log(app.globalData.phone)
        //             // app.globalData.logined = true
        //             // console.log("app.globalData.logined", app.globalData.logined)
        //             // console.log(3)
        //             // let cookies = res.header["Set-Cookie"] || null
        //             // ;(cookies.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach(str => {
        //             //     if (str !== "Path=/;" && str.indexOf("csrfToken=") !== 0) {
        //             //         let result = str.replace(/;/g, "").split("=")
        //             //         console.log("seCookie k:", result[0])
        //             //         console.log("seCookie v:", result[1])
        //             //         wx.setStorageSync(result[0], result[1])
        //             //     }
        //             // })
        //             // that.getUserInfo(wx.getStorageSync("COOKIE_PERM"), wx.getStorageSync("COOKIE_TMP"))
        //             // // wx.login({
        //             // //   success: res => {
        //             // //     console.log('res', res)
        //             // //     app.globalData.code = res.code
        //             // //   }
        //             // // })
        //             // let token = res.header["Set-Cookie"].split(";")[0].substring(12)
        //             // that.getToken(token)
        //             // //console.log(app.globalData.token)
        //           }
        //         })
        //       }
        //     })
            
        // },
        // getToken(token) {
        //     wx.request({
        //         url: "https://www.31youke.com:8080/business-travel/api-pc/user/weixinLogin", // 仅为示例，并非真实的接口地址
        //         // "https://testmobile.31youke.com:4001/business-travel/api-pc/user/weixinLogin", // dev
        //         data: {
        //             token: token
        //         },
        //         header: {
        //             "Content-Type": "application/x-www-form-urlencoded", // 默认值
        //             "client-type": app.globalData.clientType
        //         },
        //         method: "POST",
        //         success(res) {
        //             console.log("sdsdsd", res)
        //             wx.setStorageSync("COOKIE", res.data.data.token)
        //             app.globalData.token = res.data.data.token
        //         }
        //     })
        // },
        // getUserInfo(cookiePerm, cookieTmp) {
        //     let that = this
        //     wx.request({
        //         url: app.globalData.roboootUrl + "//user/default!getBaseInfo.do", // 仅为示例，并非真实的接口地址
        //         data: {},
        //         header: {
        //             "Content-Type": "application/x-www-form-urlencoded", // 默认值
        //             "client-type": app.globalData.clientType,
        //             cookie: "COOKIE_PERM=" + cookiePerm + ",COOKIE_TMP=" + cookieTmp
        //         },
        //         success(res) {
        //             console.log(res)
        //             app.globalData.nickName = res.data.data.nickName ? res.data.data.nickName : app.globalData.phone
        //             app.globalData.avatarUrl = res.data.data.signedHeadImg ? res.data.data.signedHeadImg : "../../images/default.png"
        //             that.triggerEvent("changeUser", {
        //                 nickName: app.globalData.nickName,
        //                 avatarUrl: app.globalData.avatarUrl
        //             })
        //             console.log(6666)
        //             console.log(app.globalData)
        //         }
        //     })
        // }
    }
})
