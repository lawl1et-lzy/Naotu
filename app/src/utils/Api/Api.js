import Axios from 'axios'
import router from '../../router'
import { removeToken } from '@/utils/auth'
// 设置请求时长
const axios = Axios.create({
  baseURL: '/naotu/api',
  timeout: 10 * 1000
})

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    const {
      status,
      data
    } = res
    switch (status) {
      case 200:
      case 304:
        const { response } = data
        if (Number(response.error_code) === 403) {
          removeToken()
          router.push({ path: '/login' })
          return false
        }
        return data
      default:
        Promise.reject(res)
        break
    }
  },
  (error) => {
    console.log('response error', error)
    return Promise.reject(error)
  }
)

// 构造方法
const httpServer = (opts) => {
  return new Promise((resolve, reject) => {
    return axios(opts)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log('axios constructor error', err)
        reject(err)
      })
  })
}

export default httpServer
