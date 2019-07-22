import Axios from 'axios'

// 设置请求时长
const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10 * 1000
})

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // console.log('request config', config)
    // TODO: do something
    return config
  },
  (error) => {
    console.log('request error', error)
    // TODO: do something
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log('response', response)
    let {
      status,
      data
    } = response
    if (status === 200 || status === 304) {
      return data
    } else {
      Promise.reject(response)
    }
  },
  (error) => {
    console.log('response error', error)
    // TODO: do something
    return Promise.reject(error)
  }
)

// 构造方法
let httpServer = (opts) => {
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
