import http from '@/utils/http'
// 加入购物车
export const reqAddCart=({goodsId,count,...data})=>{
	return http.get(`/cart/addToCart/${goodsId}/${count}`,data)
}
// 购物车列表
export const reqCartList=()=>{
	return http.get('/cart/getCartList')
}
// 更新商品购买状态  更新后的状态，0 不勾选，1 勾选
export const reqUpdateChecked=(goodsId,isChecked)=>{
	return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}
// 全选与全不选  0 取消全选，1 全选
export const reqCheckAllStatus=(isChecked)=>{
	return http.get(`/cart/checkAllCart/${isChecked}`)
}
// 删除购物车商品  goodsId商品id
export const reqDeleteCartGoods=(goodsId)=>{
	return http.get(`/cart/delete/${goodsId}`)
}