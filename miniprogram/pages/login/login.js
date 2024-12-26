// pages/login/login.js
import {
	toast
} from '../../utils/extendApi'
import {
	reqLogin,
	reqUserInfo
} from '../../api/user'
import {
	setStorage
} from '../../utils/storage'
import {
	userStore
} from '../../store/userStore'
import {
	ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {debounce} from 'miniprogram-licia'
ComponentWithStore({
	storeBindings: {
		store: userStore,
		fields: ['token', 'userInfo'],
		actions: ['setToken', 'setUserInfo']
	},
	methods: {
		// 登录按钮
		login:debounce(function() {
			// 调用wx.login获取code
			wx.login({
				success: async ({
					code
				}) => {
					// 判断请求是否返回code  若未返回则给用户提示
					if (code) {
						// 获取到code之后发送请求获取token
						const {
							data
						} = await reqLogin(code)
						// 获取到token之后将其存储到本地
						setStorage('token', data.token)
						this.setToken(data.token)
						// 获取用户信息
						this.getUserInfo()
						// 返回上一级页面
						wx.navigateBack()
					} else {
						toast({
							title: '授权失败,请重新授权',
						})
					}
				},
			})
		},500),
		//  获取用户信息
		async getUserInfo() {
			const {
				data
			} = await reqUserInfo()
			// 将其存储到本地
			setStorage('userInfo', data)
			// 将其存储到仓库中
			this.setUserInfo(data)
		}
	}
})