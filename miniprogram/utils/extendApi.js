// 封装微信消息提示框
// 用户传入一个对象时 对象中包含 title，icon，duration，mask 将其解构出来
// 若没有传入将使用默认值
const toast = ({
    title = "数据加载中...",
    icon = "none",
    duration = 2000,
    mask = true
} = {}) => {
    wx.showToast({
        title,
        icon,
        duration,
        mask
    })
}


// 封装微信模态对话框
const modal=(options={})=>{
   return new Promise((resolve)=>{
    //    设置默认参数
    const defaultOpt={
        title:'提示',
        content:"你确定要执行该操作吗?",
        confirmColor: '#f3514f'
    }
    // 在不破坏默认参数的前提下 将传入的参数与默认参数合并
    const opts=Object.assign({},defaultOpt,options)
    wx.showModal({
      ...opts,
      complete: ({confirm,cancel}) => {
            confirm&&resolve(true),
            cancel&&resolve(false)
      }
    })
   })
}

// 将其挂载到wx全局上
wx.toast = toast
wx.modal=modal

// 将其暴露出去
export {
    toast,modal
}