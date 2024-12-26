import {
	observable,
	action
} from 'mobx-miniprogram'
import {
	getStorage
} from '../utils/storage'
export const userStore = observable({
	// 定义响应式数据

	// 存储token
	token: getStorage('token') || '',
	// 存储用户信息
	userInfo: getStorage('userInfo') || {},
	// 存储token
	setToken: action(function (token) {
		this.token = token
	}),
	// 存储用户信息
	setUserInfo: action(function (userInfo) {
		this.userInfo=userInfo
	})
})