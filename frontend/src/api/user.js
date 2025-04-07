import request from './request'

export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
} 