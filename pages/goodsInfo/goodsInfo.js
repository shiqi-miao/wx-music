// pages/goodsInfo/goodsInfo.js
const api = require('../../utils/http.js');
const app = getApp()
let innerAudioContext = wx.createInnerAudioContext(); //创建音频实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:wx.getMenuButtonBoundingClientRect().top+40,
    userInfo: {},
    hasUserInfo: false,
    showModal: false,//登录弹窗
    skuShowPictureList: [
      "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq8xaPibYS3TuaGvIrEmavRr5FCBibO3ibU2iaXu5yt20MtYwia4UD5ofrvpqHrnKWiahGOLtuGKyDYYEEA/132",
      "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq8xaPibYS3TuaGvIrEmavRr5FCBibO3ibU2iaXu5yt20MtYwia4UD5ofrvpqHrnKWiahGOLtuGKyDYYEEA/132"
    ],
    skuLongPictureList:[
      // "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq8xaPibYS3TuaGvIrEmavRr5FCBibO3ibU2iaXu5yt20MtYwia4UD5ofrvpqHrnKWiahGOLtuGKyDYYEEA/132",
      // "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq8xaPibYS3TuaGvIrEmavRr5FCBibO3ibU2iaXu5yt20MtYwia4UD5ofrvpqHrnKWiahGOLtuGKyDYYEEA/132"
    ],
    infoData:{
      skuName: "测试sku100g",
      discountRate: 5.0,
      stockNumber: 10,
      salePrice: 0.04,
      soldNumber: 9,
      discountPrice: 0.02,
      procurementPrice: 0.01,
      skuCode: "001"
    },
    currentSwiper: 0,
    num:1,
    skuCode:'',
    cartCount:0,
    showTop:false,
    isShare:0,//是否是分享页
    loading:false,
    showPopup:false,
    // 音频
    audiolist:[
      {
        // audiosrc:'../../images/shop/vidio.m4a',
        // audiosrc:"https://s19.aconvert.com/convert/p3r68-cdx67/vjano-0f2zm.mp3",
        // audiosrc:"https://www.aconvert.com/samples/sample.mp3",
        audiosrc:""
      }
    ],
    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0
    // 音频
  },
    // 音频播放
  //初始化播放器，获取duration
  Initialization(){
    var t=this;
    if (this.data.audiolist[0].audiosrc.length != 0) {
      //设置src
      innerAudioContext.src = this.data.audiolist[0].audiosrc;
      //运行一次
      innerAudioContext.play();
      innerAudioContext.pause();
      innerAudioContext.onCanplay(() => {
        //初始化duration
        innerAudioContext.duration
        setTimeout(function () {
          //延时获取音频真正的duration
          var duration = innerAudioContext.duration;
          console.log(33333,innerAudioContext.duration)
          var min = parseInt(duration / 60);
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          t.setData({ audioDuration: innerAudioContext.duration, showTime2: `${min}:${sec}` });
        }, 1000)
      })
    }
  },
  //拖动进度条事件
  sliderChange(e) {
    var that = this;
    innerAudioContext.src = this.data.audiolist[0].audiosrc;
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({ audioTime: value });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({ audioSeek: value, isPlayAudio: true });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },
  //播放、暂停按钮
  playAudio() {
    //获取播放状态和当前播放时间
    var isPlayAudio = this.data.isPlayAudio;
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({ isPlayAudio: !isPlayAudio })
    if (isPlayAudio) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({ audioSeek: innerAudioContext.currentTime });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = this.data.audiolist[0].audiosrc;
      if (innerAudioContext.duration != 0) {
        this.setData({ audioDuration: innerAudioContext.duration });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },
  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({ audioSeek: 0, audioTime: 0, audioDuration: duration, isPlayAudio: false, showTime1: `00:00` });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({ audioSeek: seek + 1, audioTime: time, audioDuration: duration, showTime1: `${min}:${sec}`, showTime2: `${min1}:${sec1}` });
      }
    }, 1000);
  },
  onUnload:function(){
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
  },
    // 音频播放
  showLogin(){//弹出登录弹窗
    this.setData({
      showModal:true
    })
  },
  toTop(){
    wx.pageScrollTo({//回到顶部
        scrollTop: 0,
        duration: 0
      })
  },
  getUserProfile: function(e) {
    if(app.globalData.userInfo){//已经授权,但是没有登录
        this.showLogin()
    }else{//还没授权
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              wx.setStorageSync("USERINFO", res.userInfo)
              app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo
                })
                if (!app.globalData.token) { //如果没登录弹登录弹窗
                    this.showLogin()
                }
                }
            })
    }
},
  getData() {//商品信息
    var that = this
    api.http('/flute/api/skuDetails', 
        {
          token: app.globalData.token,
          skuCode:that.data.skuCode,
          },
      'POST', 
      true).then(res => {
      if (res.result == 0) {
        that.data.audiolist[0].audiosrc=res.data.mp3Url
        that.setData({
          skuShowPictureList:res.data.skuShowPictureList,
          infoData:res.data.details,
          audiolist:that.data.audiolist
        })
        //设置返回时携带skuCode,和skuNum,方便返回时商品列表局部刷新
        var pages = getCurrentPages(); 
        var prevPage = pages[pages.length - 2];   //上一页
        prevPage.setData({
          skuCode: that.data.skuCode,
          skuNum:that.data.infoData.skuNum
        })
        //设置返回时携带skuCode,和skuNum,方便返回时商品列表局部刷新
      }  
    }).catch(()=>{
        that.setData({
          showPopup:true
        })
        // wx.showModal({
        //   title: '此歌曲为vip会员专享歌曲',
        //   confirmText: '成为会员',
        //   confirmColor: '#2D879C',
        //   success: function (res) {
        //     if (res.confirm) {
              
        //     } else {
        //       wx.navigateBack({
        //         delta: -1,
        //       })
        //     }
        //   }
        // })
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  // 长按保存图片
  saveImg(e){
    var that=this
    wx.showModal({
      title: '保存图片',
      confirmText: '保存',
      confirmColor: '#2D879C',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          let url = e.currentTarget.dataset.url;
          //用户需要授权
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success:()=> {
                    // 同意授权
                    that.commitSave(url);
                  },
                  fail: (res) =>{
                    wx.showModal({
                      content: '检测到您没打开相册授权，是否去设置打开？',
                      confirmText: "确认",
                      cancelText: "取消",
                      success: function (res) {
                        //点击“确认”时打开设置页面
                        if (res.confirm) {
                          wx.openSetting({
                            success: (res) => { }
                          })
                        } else {
                          // console.log('用户点击取消')
                        }
                      }
                    })
                  }
                })
              }else{
                // 已经授权了
                that.commitSave(url);
              }
            },
            fail: (res) =>{
            }
          })   
        } else {
        }
      }
    })
  },
  //保存图片
  commitSave(url){
    wx.getImageInfo({
      src: url,
      success:(res)=> {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath:path,
          success:(res)=> { 
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail:(res)=>{
            console.log(res);
          }
        })
      },
      fail:(res)=> {
        console.log(res);
      }
    })
  },
  join(){
    var that=this
    that.setData({
      loading:true
    })
    wx.downloadFile({
      // url: that.data.skuLongPictureList[0].pictureUrl,//图片下载地址
      url:this.data.audiolist[0].audiosrc,
      success (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            loading:false
          })
          // wx.saveImageToPhotosAlbum({　　　　　　　　　//保存图片到本地
          //   filePath: res.tempFilePath,
          //   success(res) {
          //     wx.showToast({
          //       title: '保存成功',
          //       icon: 'success',
          //       duration: 2000
          //     })
          //   }
          // })
          wx.saveVideoToPhotosAlbum({　　　　　　　　　//保存视频到本地
            filePath: res.tempFilePath,
            success(res) {
              console.log(1111,res)
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(err){
              console.log("err",err)
            }
          })
        }else{
          wx.showToast({
            title: '网络错误',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },
  reflashData() {
    this.setData({
        hasUserInfo: true
    })
    this.getData()
    this.getCart()
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      skuCode:options.skuCode,
      isShare:options.isShare
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.userInfo && app.globalData.token){//如果已经授权并登陆
      this.setData({hasUserInfo:true})
    }
    this.getData()
    this.Initialization();
    this.loadaudio();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 监听滚动条
   */
  onPageScroll (e) { 
    // console.log(e)
    if(e.scrollTop>250){
      this.setData({
        showTop:true
      })
    }else{
      this.setData({
        showTop:false
      })
    }
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    
  }
})