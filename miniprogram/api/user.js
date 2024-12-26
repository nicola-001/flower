import http from '@/utils/http'
// 登录 获取code接口 （获取临时凭证）
export const reqLogin = (code) => {
	return http.get(`/weixin/wxLogin/${code}`)
}
// 获取用户信息
export const reqUserInfo = () => {
	return http.get(`/weixin/getuserInfo`)
}
// 上传头像
export const reqUploadFile = (filePath, name) => {
	return http.upload('/fileUpload', filePath, name)
}
// 更新用户信息
export const reqUpdateUserInfo = (userInfo) => {
	return http.post('/weixin/updateUser', userInfo)
}