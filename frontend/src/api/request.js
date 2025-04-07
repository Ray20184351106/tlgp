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
    // 将请求数据转换为 x-www-form-urlencoded 格式
    if (config.method === 'post') {
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
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('错误状态码:', error.response.status)
      console.error('错误数据:', error.response.data)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('请求已发出但没有收到响应:', error.request)
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

export default request 