import {
    userStore
} from '@/store/userStore'
App({
    // 全局共享的数据
    // 点击收货地址时，需要将点击的收获地址赋值给address
    // 在结算支付，订单页面需要判断address是否存在数据  存在展示 不存在 获取数据渲染
    globalData: {
        address: {}
    },
    // 清除token
    // async onShow() {
    //    asyncClearStorage()
    // },
    onLaunch() {
        const token = wx.getStorageSync('token') || '';
        if (token) {
            userStore.setToken(token);
        }
    }
})