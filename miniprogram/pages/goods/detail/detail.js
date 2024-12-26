// pages/goods/detail/index.js
import {
  reqGoodsDetail
} from '@/api/goods'
import {
  reqAddCart,
  reqCartList
} from '@/api/cart'
// 注入
import {
  userBehavior
} from '@/behaviors/userBehavior'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, // 0加入购物车  1 立即购买 
    allCount: ''
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true
    })
    this.setData({
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true
    })
    this.setData({
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({
      show: false
    })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: Number(event.detail)
    })
  },
  // 获取商品详情的数据
  async getGoodsDetail(id) {
    const {
      data: goodsInfo
    } = await reqGoodsDetail(id)
    this.setData({
      goodsInfo
    })
  },
  // 获取购物车列表数据
  async getCartCount() {
    // 判断是否有token 如果有token 显示  否则不显示
    if (!this.data.token) return
    // 如果存在token说明用户进行了登录，获取购物车数据
    // 然后计算出购买数量
    const res = await reqCartList()
    if (res.data.length !== 0) {
      // 累加出购买的数量
      let allCount = 0
      res.data.forEach(item => {
        allCount += item.count
      })
      this.setData({
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
    }
  },
  onLoad(options) {
    this.goodsId = options.goodsId
    // 获取商品详情
    this.getGoodsDetail(this.goodsId)
    // 获取购物车商品 
    this.getCartCount()
  },
  //全屏图片预览
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },
  // 确定按钮的回调
  async handlerSubmit() {
    // 判断是否有token
    const {
      token,
      count,
      blessing,
      buyNow
    } = this.data
    // 获取商品id
    const goodsId = this.goodsId
    // 判断是否有token
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    // 判断是加入购物车还是立即购买
    if (this.data.buyNow === 0) {
      // 加入购物车
      const res = await reqAddCart({
        goodsId,
        count,
        blessing
      })
      if (res.code === 200) {
        // 提示
        wx.toast({
          title: '加入购物车成功'
        })
        this.getCartCount()
        // 关闭弹出框
        this.setData({
          show: false
        })
      }
    } else {
      // 立即购买  跳转到商品结算页面
      wx.navigateTo({
        url: `/modules/orderPayModules/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`,
      })
    }

  },
    // 转发功能
    onShareAppMessage(){
      return{
        title:'Love',
        path:'pages/index/index'
      }
    },  
    // 能够把小程序分享朋友圈
    onShareTimeline(){
        
    }
})