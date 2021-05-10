// component/model/model.js
const app = getApp()
const api = require('../../utils/http.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showModal: {
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
    },

    /**
     * 组件的方法列表
     */ 
    methods: {
      getPhoneNumber(e) {//获取手机号加密信息
        let that = this
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          wx.login({//获取weixin登录的code
            success: res => {
              // console.log(e.detail, res.code)
              api.http('/seedling-flash/kupper/api/login', //获取token
                {
                  encryptData:e.detail.encryptedData,
                  iv:e.detail.iv,
                  jsCode:res.code
                },
                'POST', 
                true).then(res => {
                if (res.result == 0) {
                  app.globalData.token = res.data.openToken
                  wx.setStorageSync("TOKEN", res.data.openToken)
                  api.http('/seedling-flash/kupper/login/perfect', //提交微信头像等信息
                    {
                      nickName: app.globalData.userInfo.nickName,
                      portrait: app.globalData.userInfo.avatarUrl,
                      userSex: app.globalData.userInfo.gender,
                      token: app.globalData.token
                    },
                    'POST', 
                    true).then(res => {
                    if (res.result == 0) {
                      wx.showToast({
                        title: "登录成功!", duration:1000,
                        success:res=>{
                            that.setData({
                              showModal:false
                            })
                            that.triggerEvent('reflashData')
                          }
                       })
                    }
                  })
                }
              })
            }
          })
        } else {//拒绝授权手机号
         
        }
      },
      cancel() {
        this.setData({
          showModal: false
        })
        wx.switchTab({
          url: '../homeIndex/homeIndex'
        })
      }
    }
})
