// 导入debounce防抖方法
import {
  debounce
} from 'miniprogram-licia'
import {
  ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
  userStore
} from '@/store/userStore'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllStatus,
  reqAddCart,
  reqDeleteCartGoods
} from '@/api/cart'
import {
  swipeCellBehavior
} from '@/behaviors/swipeCell'
const computedBehavior = require('miniprogram-computed').behavior
ComponentWithStore({
  behaviors: [computedBehavior, swipeCellBehavior],
  // 组件的属性列表
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  // 计算属性
  computed: {
    selectAllStatus(data) {
      return (
        data.cartList.length !== 0 && data.cartList.every(item => item.isChecked === 1)
      )
    },
    // 计算商品总金额
    totalPrice(data) {
      let totalPrice = 0
      // 如果选中则进行相加
      data.cartList.forEach(item => {
        if (item.isChecked === 1) {
          totalPrice = item.price * item.count
        }
      })
      return totalPrice
    }
  },
  // 组件的方法列表
  methods: {
    // 全选/全不选
    async selectAllStatus(event) {
      const {
        detail
      } = event
      const isChecked = detail ? 1 : 0
      const {
        code
      } = await reqCheckAllStatus(isChecked)
      if (code === 200) {
        //  法一：更新服务器数据
        // this.showTipGetList()
        // 法二:只更新本地数据
        // 深拷贝 创建一个新的购物车对象副本 避免数据不可变
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
        newCartList.forEach(item => item.isChecked = isChecked)
        // 对newCartList赋值
        this.setData({
          cartList: newCartList
        })
      }
    },
    // 修改状态
    async updateChange(event) {
      // 获取当前选中状态
      const {
        detail
      } = event
      // 获取当前id 以及索引
      const {
        id,
        index
      } = event.target.dataset
      const isChecked = detail ? 1 : 0
      // 更新商品购买状态
      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        // 法一: 重新获取购物车的数据
        // this.showTipGetList()

        //法二： 将isChecked重新赋值
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },
    // 展示文案同时获取购物车数据
    async showTipGetList() {
      // 结构数据
      const {
        token
      } = this.data
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }
      // 如果用户进行了登录，需要获取购物车列表数据
      const {
        code,
        data: cartList
      } = await reqCartList()
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList.length === 0 && '还没有添加商品，快去添加吧~'
        })
      }
    },
    // 更新商品购买数量
    changeBuyNum: debounce(async function (event) {
      // 获取最新的购买数量->  大于200  重置为200   不大于 返回200
      let buyNum = event.detail > 200 ? 200 : event.detail
      // 获取商品的id和索引
      const {
        id: goodsId,
        index,
        oldbuynum
      } = event.target.dataset
      // 验证用户输入的值，是否是 1 ~ 200 直接的正整数
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      if (!reg) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        return
      }
      // 如果通过，需要计算差值，然后将差值发送给服务器，让服务器进行逻辑处理
      const disCount = buyNum - oldbuynum
      if (disCount === 0) return
      // 发送请求：购买的数量和差值
      const res = await reqAddCart({
        goodsId,
        count: disCount
      })
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: buyNum,
          // 将其勾选上
          [`cartList[${index}].isChecked`]: 1
        })

      }
    }, 500),
    async delCartGoods(event) {
      // 获取删除所需要的id
      const {
        id
      } = event.target.dataset
      // 询问用户是否需要删除
      const modalRef = await wx.modal({
        content: '您确定要删除吗？'
      })
      if (modalRef) {
        await reqDeleteCartGoods(id)
        this.showTipGetList()
      }
    },
    toOrder() {
      console.log(this.data.totalPrice);
      // 判断是否选择商品
      if (this.data.totalPrice === 0) {
        wx.toast({
          title: '请选择需要购买的商品'
        })
      }else{
        wx.navigateTo({
          url: '/modules/orderPayModules/pages/order/detail/detail',
        })
      }
    
    },
    // 页面展示时
    onShow() {
      this.showTipGetList()
    },
    onHide() {
      this.onSwipeCellCommonClick()
    }
  }
})