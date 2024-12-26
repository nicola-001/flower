// pages/goods/list/index.js
import {
  reqGoodList
} from '../../../api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    total: 0, //数据总条数
    isFinish: false, // 判断数据是否加载完毕
    requestData: {
      page: 1,
      limit: 10,
      category1Id: '', //一级分类id
      category2Id: '' //二级分类id
    },
    isLoading: false //设置节流阀
  },
  async getGoodsList() {
    this.data.isLoading = true
    const {
      data
    } = await reqGoodList(this.data.requestData)
    this.data.isLoading = false
    this.setData({
      // 解构出将原始的数据，将新的数据赋值给前面的数据
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },
  onLoad(options) {
    // 合并参数
    Object.assign(this.data.requestData, options)
    // 获取商品列表
    this.getGoodsList()
  },
  // 监听用户上拉获取最新数据
  onReachBottom() {
    // 解构出goodsList和total用于判断是否再加载数据
    const {
      goodsList,
      total,
      requestData,
      isLoading
    } = this.data
    //  获取当前页码
    const {
      page
    } = requestData
    if (isLoading) return
    // 判断长度是否相等
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }

    // 将该页码+1
    this.setData({
      requestData: {
        ...this.data.requestData,
        page: page + 1
      }
    })
    // 获取最新数据
    this.getGoodsList()
  },
  // 下拉刷新效果
  onPullDownRefresh() {
    // 将数据重置
    this.setData({
      goodsList: [], // 商品列表数据
      total: 0, //数据总条数
      isFinish: false, // 判断数据是否加载完毕
      requestData: {
        ...this.data.requestData,
        page: 1
      },
      isLoading: false //设置节流阀
    })
    // 使用最新的参数发送请求
    this.getGoodsList()
    // 手动关闭下拉效果
    wx.stopPullDownRefresh()
  },
  // 转发功能
  onShareAppMessage() {

  },
  // 能够把小程序分享朋友圈
  onShareTimeline() {

  }

})