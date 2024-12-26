import instance from '@/utils/http'
import http from '@/utils/http'
export const reqRequestData = () => {
    return instance.all(
        // 轮播图数据
        http.get('/index/findBanner'),
        // 一级分类
        http.get('/index/findCategory1'),
        // 活动宣传
        http.get('/index/advertisement'),
        // 猜你喜欢
        http.get('/index/findListGoods'),
        // 人气推荐
        http.get('/index/findRecommendGoods')
    )
}