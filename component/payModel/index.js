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
      cancel() {
        this.setData({
          showModal: false
        })
        this.triggerEvent('cancelPay')
      },
      confirm(){
        this.setData({
          showModal:false
        })
        this.triggerEvent('rePay')
      }
    }
})
