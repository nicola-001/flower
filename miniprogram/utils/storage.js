// 封装同步本地存储的方法
// 存储数据
export const setStorage = (key, value) => {
    try {
        wx.setStorageSync(key, value)
    } catch (error) {
        console.error(`存储指定${key}数据时发生异常`, error);
    }
}
// 读取数据
export const getStorage = (key) => {
    try {
        const value = wx.getStorageSync(key)
        if (value) {
            return value
        }
    } catch (error) {
        console.error(`读取指定${key}数据时发生异常`, error);
    }
}
// 移除数据
export const removeStorage = (key) => {
    try {
        wx.removeStorageSync(key)
    } catch (error) {
        console.error(`移除指定${key}数据时发生异常`, error);
    }
}
// 清除数据
export const clearStorage = () => {
    try {
        wx.clearStorageSync()
    } catch (error) {
        console.error(`清除全部数据时发生异常`, error);
    }
}
// 异步将数据存储到本地
export const asyncSetStorage = (key, data) => {
    return new Promise((resolve) => {
        wx.setStorage({
            key,
            data,
            complete(res) {
                resolve(res)
            }
        })
    })
}
// 异步读取本地数据
export const asyncGetStorage = (key) => {
    return new Promise((resolve) => {
        wx.getStorage({
            key,
            complete(res) {
                resolve(res.data)
            }
        })
    })
}
// 异步移除本地数据
export const asyncRemoveStorage = (key) => {
    return new Promise((resolve) => {
        wx.removeStorage({
            key,
            complete(res) {
                resolve(res)
            }
        })
    })
}
// 异步清除本地数据
export const asyncClearStorage = () => {
    return new Promise((resolve) => {
        wx.clearStorage({
            complete(res) {
                resolve(res)
            }
        })
    })
}