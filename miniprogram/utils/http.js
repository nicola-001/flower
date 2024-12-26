// import WxRequest from './request'
import WxRequest from 'mina-request'
import {
    env
} from './env'
import {
    getStorage,
    clearStorage
} from './storage'
import {
    modal,
    toast
} from './extendApi'
// 创建类的实例对象（实例对象时传入参数）
const instance = new WxRequest({
    baseURL: env.baseUrl,
    timeout: 15000,
    // isLoading:false
})

//配置请求拦截器
instance.interceptors.request = (config) => {
    // 在发送请求之前做些什么
    // 判断是否存在token
    const token = getStorage('token')
    if (token) {
        config.header['token'] = token
    }
    return config
}
// 配置响应拦截器
instance.interceptors.response = async (response) => {
    const {
        isSuccess,
        data
    } = response
    if (!isSuccess) {
        // 请求失败
        wx.showToast({
            title: '网络异常请重试...',
            icon: error
        })
        return response

    }
    // 判断服务器响应的状态码
    switch (data.code) {
        // 后端返回的状态码200 成功
        case 200:
            return data
            // 返回的状态码是208 则token失效|没有token 让用户从重新登录
        case 208:
            const res = await modal({
                content: '鉴权失败，请重新登录',
                showCancel: false
            })
            if (res) {
                //清除本地存储的全部信息
                clearStorage()
                wx.navigateTo({
                    url: '/pages/login/login',
                })
            }
            return Promise.reject(response)

        default:
            toast({
                title: '程序出现异常，请联系客服稍后重试'
            })
            return Promise.reject(response)
    }

}
// 导出实例
export default instance