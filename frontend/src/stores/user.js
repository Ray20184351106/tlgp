import { defineStore } from 'pinia'
import { login, register } from '../api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  
  actions: {
    async loginAction(loginData) {
      try {
        const res = await login(loginData)
        this.token = res.token
        localStorage.setItem('token', res.token)
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async registerAction(registerData) {
      try {
        const res = await register(registerData)
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    logout() {
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
  }
}) 