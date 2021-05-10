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
        },
        orderCode: {
          type: String
      },
      locationName:{
        type:String
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
    ready(){
      
    },
    methods: {
      getList(){//获取物流信息
        var that=this
        api.http('/seedling-flash/find/address', 
          {
            orderCode:that.data.orderCode
            },
        'POST', 
        true).then(res => {
        if (res.result == 0) {
          that.setData({
            list:res.data.list
          })
        }
      })
      },
      cancel() {
        this.setData({
          showModal: false
        })
      },
      hideModal() {
        this.setData({
          showModal: false
        })
      },
    }
  })