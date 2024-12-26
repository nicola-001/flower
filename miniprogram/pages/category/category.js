import {
    reqCategoryData
} from '../../api/category'
Page({
    data: {

    },
    // 获取商品分类的数据
    async getCategoryData() {
        const res = await reqCategoryData()
        console.log(res);
    },
    onLoad() {
        // 调用商品分类的数据
        this.getCategoryData()
    }
})