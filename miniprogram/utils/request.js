// 创建request类
class WxRequest {
    // 定义默认的请求,响应拦截器
    interceptors = {
        request: (config) => config,
        response: (response) => response
    }
    // 定义一个空数组用于存储请求队列
    queue = []
    //封装GET方法
    get(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: "GET"
        }, config))
    }

    //封装DELETE方法
    delete(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: "DELETE"
        }, config))
    }
    // 封装POST方法
    post(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: "POST"
        }, config))
    }
    // 封装PUT方法
    put(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: "PUT"
        }, config))
    }
    // 用来处理并发请求
    all(...promise) {
        // 通过展开运算符接受传递过来的参数，并将其转换成数组
        return Promise.all(promise)
    }
    // upload实例方法,用来对wx.uploadFile进行封装
    upload(url, filePath, name = "file", config = {}) {
        return this.request(Object.assign({
            url,
            filePath,
            name,
            method: 'UPLOAD'
        }, config))
    }

    // 微信小程序的默认参数
    defaults = {
        baseURL: '', // 请求基准地址
        url: '', // 开发者服务器接口地址
        data: null, // 请求参数
        method: 'GET',
        header: {
            'Content-type': 'application/json' // 设置数据的交互格式
        },
        timeout: 60000, // 小程序默认超时时间是 60000，一分钟
        isLoading: true
    }
    // 定义constructor用来定义方法和属性
    constructor(params = {}) {
        // 合并参数
        this.defaults = Object.assign({}, this.defaults, params)
    }
    request(options) {
        this.timerId && clearTimeout(this.timerId)
        // 拼接完整的基础路径
        options.url = this.defaults.baseURL + options.url
        // 合并请求参数
        options = {
            ...this.defaults,
            ...options
        }
        if (options.isLoading && options.method !== 'UPLOAD') {
            // 判断queue队列是否为空，是空就显示loading  不是空就不调用 wx.showLoading()
            this.queue.length === 0 && wx.showLoading()
            // 然后想队列中添加 request 标识，代表需要发送一次新请求
            this.queue.push('request')
        }
        // 在发送请求之前，调用请求拦截器，新增和修改请求参数
        options = this.interceptors.request(options)

        return new Promise((resolve, reject) => {
            if (options.method === 'UPLOAD') {
                wx.uploadFile({
                    ...options,
                    success: (res) => {
                        // 需要将服务器返回的JSON字符串通过JSON.parse转换成对象
                        res.data = JSON.parse(res.data)
                        // 合并参数
                        const margeRes = Object.assign({}, res, {
                            config: options,
                            isSuccess: true
                        })
                        resolve(this.interceptors.response(margeRes))
                    },
                    fail: (err) => {
                        // 合并参数
                        const margeErr = Object.assign({}, err, {
                            config: options,
                            isSuccess: false
                        })
                        reject(this.interceptors.response(margeErr))
                    }
                })
            } else {
                wx.request({
                    ...options,
                    //   成功的回调
                    success: (res) => {
                        // 不管是成功响应或者是失败响应都会调用 响应拦截器
                        const mergeRes = Object.assign({}, res, {
                            config: options,
                            isSuccess: true //用于判断请求是否发生错误
                        })
                        resolve(this.interceptors.response(mergeRes))
                    },
                    fail: (error) => {
                        // 不管是成功响应或者是失败响应都会调用 响应拦截器
                        const mergeError = Object.assign({}, error, {
                            config: options,
                            isSuccess: false //用于判断请求是否发生错误
                        })
                        reject(this.interceptors.response(mergeError))
                    },
                    // 接口调用结束的回调函数(调用成功、失败都会执行)
                    complete: () => {
                        if (options.isLoading) {
                            this.queue.pop()
                            this.queue.length === 0 && this.queue.push('request')
                            this.timerId = setTimeout(() => {
                                this.queue.pop()
                                this.queue.length === 0 && wx.hideLoading()
                                clearTimeout(this.timerId)
                            }, 1)
                        }
                    }
                })
            }
        })
    }
}
export default WxRequest