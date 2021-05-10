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
        country:{
          type:String
        }
    },
    options: {
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
      close(){
        this.setData({
          showModal:false
        })
        this.triggerEvent('seeFootprints')
        app.globalData.skuCodeBox=""
      }
    }
})
