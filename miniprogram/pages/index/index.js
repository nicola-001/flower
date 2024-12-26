import {
    reqRequestData
} from '../../api/index'
Page({
    data: {
        bannerList: [], // 轮播图数据
        categoryList: [], // 分类数据
        activeList: [], // 活动广告
        hotList: [], // 人气推荐
        guessList: [], // 猜你喜欢
        //默认显示骨架屏
        loading: true
    },
    // 获取首页数据
    async getIndexData() {
        const res = await reqRequestData()
        this.setData({
            bannerList: res[0],
            categoryList: res[1],
            activeList: res[2],
            hotList: res[3],
            guessList: res[4],
            loading: false
        })
    },
    // 页面加载时
    onLoad() {
        this.getIndexData()
    },
    // 转发功能
    onShareAppMessage(){},
    // 能够把小程序分享朋友圈
    onShareTimeline(){}
})