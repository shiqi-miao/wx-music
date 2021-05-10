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
      hideModal() {
        this.setData({
          showModal: false
        })
      },
      toFoot(){
        wx.switchTab({
              url: "../foot/foot"
          })
      }
    }
})
