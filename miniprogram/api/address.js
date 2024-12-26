import http from '@/utils/http'
// 新增收货地址
export const reqUserAddress = (data) => {
	return http.post('/userAddress/save', data)
}
// 收获地址列表
export const reqAddressList = () => {
	return http.get('/userAddress/findUserAddress')
}
// 收获地址详情
export const reqAddressDetail = (id) => {
	return http.get(`/userAddress/${id}`)
}
// 更新收货地址
export const reqUpdateAddress = (data) => {
	return http.post('/userAddress/update', data)
}
// 删除收货地址
export const reqDeleteAddress = (id) => {
	return http.get(`/userAddress/delete/${id}`)
}