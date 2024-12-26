import http from '@/utils/http'
// 获取商品列表
export const reqGoodList = ({
	limit,
	page,
	...reset
}) => {
	return http.get(`/goods/list/${page}/${limit}`, reset)
}
// 获取商品详情
export const reqGoodsDetail = (goodsId) => {
	return http.get(`/goods/${goodsId}`)
}