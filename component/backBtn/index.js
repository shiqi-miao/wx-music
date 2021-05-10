// component/model/model.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      title: {
          type: String
      },
      isShare: {
        type: String,
        value:'0'
    },
    },
    /**
     * 组件的初始数据
     */
    data: { 
      top:0
    },
    ready(){
      this.setData({
        top:wx.getMenuButtonBoundingClientRect().top
      })
    },
    /**
     * 组件的方法列表
     */ 
    methods: {
      back(){
        if(this.data.isShare=='1'){
          wx.switchTab({
            url: '../homeIndex/homeIndex',
          })
        }else{
          wx.navigateBack({
            delta: -1,
          })
        }
        
      }
    }
})
