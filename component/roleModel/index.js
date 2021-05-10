// component/model/model.js
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
        isFoot: {
          type: Boolean,
          value: false
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
      getUserProfile: function (e) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            wx.setStorageSync("USERINFO", res.userInfo)
            app.globalData.userInfo = res.userInfo
            this.setData({
              showModal: false
            })
            if (!app.globalData.token) {//如果没登录弹登录弹窗
              this.triggerEvent('showLogin')
            }
          }
        })
      },
      cancel(){
        this.setData({
          showModal:false
        })
      }
    }
})
