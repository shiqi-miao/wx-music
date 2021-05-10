// pages/exception/exception.js
const api = require('../../utils/http.js');
const app=getApp()
Component({
  properties:{
    showModalE:{
      type:Boolean,
      value:false
    },
    isAgree:{
      type:Boolean,
      value:false
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
  },
  methods:{
    getAgree(){
      var that = this
      api.http('/seedling-flash/mall/cartCount', 
          {
            token: app.globalData.token
            },
        'POST', 
        true).then(res => {
        if (res.result == 0) {
              var checkedData = { isAgree: res.data.isAgree}
              that.triggerEvent("changeIsAgree",checkedData)
              that.setData({
                isAgree: res.data.isAgree
              })
        }
      })
    },
    change(){
      var that = this
      api.http('/seedling-flash/barista/agree', 
          {
            token: app.globalData.token
            },
        'POST', 
        true).then(res => {
        if (res.result == 0) {
              that.setData({
                showModalE:false
              })
              that.getAgree()
        }
      })
    },
    hideModal(){
      this.setData({
        showModalE:false
      })
    },
  },
})