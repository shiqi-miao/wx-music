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
      list:[
        {label:"我不想买了",isSelect:false},
        {label:"地址信息填写错误",isSelect:false},
        {label:"商品降价",isSelect:false},
        {label:"商品无货",isSelect:false},
        {label:"其他",isSelect:false}
      ]
    },

    /**
     * 组件的方法列表
     */ 
    methods: {
      selectReason(e){
        this.data.list.forEach(item => {
          item.isSelect=false
        });
        this.data.list[e.currentTarget.dataset.index].isSelect=!this.data.list[e.currentTarget.dataset.index].isSelect
        this.setData({
          list:this.data.list
        })
      },
      cancel() {
        this.setData({
          showModal: false
        })
      },
      commitReason(){
        var reason=""
        this.data.list.forEach(item=>{
          if(item.isSelect){
            reason=item.label
          }
        })
        if(!reason){
          wx.showToast({
            title: "请选择取消原因哦",icon:'none',duration: 1000
          })
          return;
        }
        this.triggerEvent('commitReason',reason)
      },
    }
  })