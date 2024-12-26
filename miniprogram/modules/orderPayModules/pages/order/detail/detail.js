import {
  reqAddressList
} from '@/api/address'
import {
  reqOrderInfo,
  reqBuyNowGoods,
  reqSubmitOrder,
  reqPrePayInfo,
  reqPayStatus
} from '@/api/orderPay'
import {
  formatTime
} from '@/utils/formatTime'
import Schema from 'async-validator'
import {debounce} from 'miniprogram-licia'
Page({
  data: {
    orderInfo: {}, //订单商品详情
    orderaddress: {}, //收货地址
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime()
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    // 收集时间-需要将时间戳转换成年月日
    const timeRes = formatTime(new Date(event.detail))

    this.setData({
      show: false,
      deliveryDate: timeRes
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModules/pages/address/list/index'
    })
  },
  // 获取收货地址
  async getAddress() {
    const {
      data
    } = await reqAddressList()
    // 只能切换默认地址
    const orderaddress = data.find(item => item.isDefault === 1);
    this.setData({
      orderaddress
    })
  },
  onShow() {
    this.getAddress()
    // 需要下单商品的详细信息
    this.getOrderInfo()
  },
  // 获取订单详情
  async getOrderInfo() {
    const {
      goodsId,
      blessing
    } = this.data

    const {
      data: orderInfo
    } = goodsId ? await reqBuyNowGoods({
      goodsId,
      blessing
    }) : await reqOrderInfo()
    // 判断是否存在祝福语
    // 如果存在多个祝福语,筛选第一个存在的祝福语进行展示
    const orderGoods = orderInfo.cartVoList.find(item => item.blessing !== '')

    this.setData({
      orderInfo,
      blessing: !orderGoods ? '' : orderGoods.blessing
    })
  },
  onLoad(options) {
    this.setData({
      ...options
    })
  },
  // 提交订单
   submitOrder:debounce(async function() {
    // 从data中结构数据
    const {
      orderInfo,
      orderaddress,
      buyName,
      buyPhone,
      deliveryDate,
      blessing
    } = this.data
    console.log(orderInfo);
    // 根据接口要求组织请求参数
    const params = {
      buyName,
      buyPhone,
      cartList: orderInfo.cartVoList,
      deliveryDate,
      remarks: blessing,
      userAddressId: orderaddress.id
    }
    // 对请求参数进行验证
    const {
      valid
    } = await this.validatePerson(params)
    // 如果请求参数验证失败
    if (!valid) return
    // 创建商品订单
    const res = await reqSubmitOrder(params)
    if (res.code === 200) {
      // 在平台订单创建成功以后，将订单编号挂载到市里上
      this.orderNo = res.data

      // 获取预付单信息，支付参数
      this.advancePay()
    }
  },500),
  // 验证表单规则
  validatePerson(params) {
    // 验证规则
    const nameRegExp = /^[a-zA-Z\d\u4e00-\u9fa5]+$/; // 验证收货人姓名
    const phoneReg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\d|9\d)\d{8}$/; // 验证手机号

    const rules = {
      userAddressId: {
        required: true,
        message: '请输入订购人地址'
      },

      buyName: [{
          required: true,
          message: '请输入订购人姓名'
        },
        {
          pattern: nameRegExp,
          message: '用户名不合法'
        }
      ],
      buyPhone: [{
          required: true,
          message: '请输入手机号码'
        },
        {
          pattern: phoneReg,
          message: '手机号不合法'
        }
      ],
      deliveryDate: {
        required: true,
        message: '请选择期望送达日期'
      }
    };

    // 创建验证实例
    const validator = new Schema(rules);

    // 返回验证结果
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors && errors.length > 0) {
          // 提示第一个错误信息
          wx.showToast({
            title: errors[0]?.message || '验证失败',
            icon: 'none',
            duration: 2000
          });
          resolve({
            valid: false
          });
        } else {
          resolve({
            valid: true
          });
        }
      });
    });
  },
  // 获取预付单信息
  async advancePay() {
    try {
      const payParams = await reqPrePayInfo(this.orderNo)

      if (payParams.code === 200) {
        // 进行微信支付
        const payInfo = await wx.requestPayment(payParams.data)
        if (payInfo.errMsg === 'requestPayment:ok') {
          const payStatus = await reqPayStatus(this.orderNo)
          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/modules/orderPayModules/pages/order/list/list',
              success: () => {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                })
              }
            })
          }
        }
      }
    } catch {
      wx.toast({
        title: '支付失败',
        icon: 'error'
      })
    }
  }
})