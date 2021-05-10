const api = require("./http")
/**
 *
 * @param {String} url 接口地址
 * @param {void} param 接口参数
 * @param {Boolean} showLoading 是否显示加载loading(false-不显示)
 */
function post(url, param, showLoading = false) {
    return api.http(url, param, "POST", !showLoading)
}

//Api
export default {
    /**
     * 常用入住人
     */
    getUsersList(param) {
        //获取列表
        return post(
            "/business-travel/api-weixin/user/getCustomerFrequentContacts",
            param
        )
    },
    addUsersList(param) {
        //添加入住人
        return post(
            "/business-travel/api-weixin/user/addCustomerFrequentContacts",
            param
        )
    },
    deleteUsersList(param) {
        //删除入住人
        return post(
            "/business-travel/api-weixin/user/deleteCustomerFrequentContactsById",
            param
        )
    }
}
