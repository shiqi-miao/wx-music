const app = getApp()
var Http = function(shortUrl, params, method, isShowLoading) {
    let url = app.globalData.localApiUrl1 + shortUrl
    if (!isShowLoading) {
        wx.showLoading({
            title: "加载中..."
        })
    }

    var promise = new Promise((resolve, reject) => {
        wx.request({
            url: url || "",
            header: {},
            method: method || "GET",
            data: params || {},
            success(res) {
                if (!isShowLoading) {
                    wx.hideLoading()
                }
                if (res.data.result == 0) {
                    resolve(res.data)
                } else {
                    reject(wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                    }))
                }
            },
            fail(err) {
                reject(wx.showToast({
                    title: "出错啦~",
                    icon: 'none'
                }
                ))
            }
        })
    })
    return promise
}
module.exports = {
    http: Http
}
