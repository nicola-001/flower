export const swipeCellBehavior = Behavior({
	data: {
		swipeCelQueue: [] //实例存储队列
	},
	methods: {

		// 当用户打开滑块时触发
		swipeCellOpen(event) {
			// 需要把传递过来的id属性传递给selectComponent 
			const instance = this.selectComponent(`#${event.target.id}`)
			// 将实例追加到数组中
			this.data.swipeCelQueue.push(instance)
		},
		// 给页面绑定点击事件
		onSwipeCellPage() {
			this.onSwipeCellCommonClick()
		},
		// 点击滑动单元格是触发的函数
		onSwipeCellClick() {
			this.onSwipeCellCommonClick()
		},
		// 关掉滑块统一的逻辑
		onSwipeCellCommonClick() {
			//需要对单元格实例数组进行遍历，遍历以后获取每一个实例，让每一个实例调用 close方法即可
			this.data.swipeCelQueue.forEach(instance => {
				instance.close()
			})
			// 将滑块单元格数组设置为空
			this.data.swipeCelQueue = []
		}
	}
})