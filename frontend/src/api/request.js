import axios from 'axios'
import qs from 'qs'

const request = axios.create({
  baseURL: 'http://localhost:8080', // 后端服务器地址
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('请求配置:', config)
    // 只在Content-Type为application/x-www-form-urlencoded时才转换数据格式
    if ((config.method === 'post' || config.method === 'put') && 
        (!config.headers['Content-Type'] || config.headers['Content-Type'] === 'application/x-www-form-urlencoded')) {
      config.data = qs.stringify(config.data)
    }
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('响应数据:', response)
    // 如果响应的数据直接就是我们需要的数据（没有包装在data字段中）
    if (response.data && response.data.code !== undefined) {
      return response.data
    }
    // 如果响应的数据被包装在data字段中
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('错误状态码:', error.response.status)
      console.error('错误数据:', error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('请求已发出但没有收到响应:', error.request)
      return Promise.reject(new Error('服务器无响应'))
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
      return Promise.reject(error)
    }
  }
)

export default request 