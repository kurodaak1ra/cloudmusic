/**
 * axios 封装
 * 请求拦截、相应拦截、错误统一处理
 */
import qs from 'qs'
import Vue from 'vue'
import axios from 'axios'
import Toast from './toast'
import store from '../store/store'
import { SET_GLOBAL } from '../store/mutation-type'

Vue.use(Toast, {
  defaultType: 'bottom',
  duration: 3000
})

let currentUri = ''

// 环境切换
// if (process.env.NODE_ENV === 'development') {
// } else if (process.env.NODE_ENV === 'production') {
// }
axios.defaults.baseURL = '/api'

// 设置跨域 cookie
axios.defaults.withCredentials = true

// 请求超时时间
axios.defaults.timeout = 10000

// post 请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencodedcharset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // Token
    const token = store.state.token
    token && (config.headers.Authorization = token)
    // 记录当前请求的 uri
    currentUri = config.url
    // loading、netErr
    if (!/sub/i.test(currentUri)) {
      store.commit(SET_GLOBAL, ['loading', true])
      store.commit(SET_GLOBAL, ['netErr', false])
    }
    return config
  },
  error => { return Promise.error(error) }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    store.commit(SET_GLOBAL, ['loading', false])
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是 200 的情况
  error => {
    // loading、netErr
    if (!/sub/i.test(currentUri)) {
      store.commit(SET_GLOBAL, ['loading', false])
      store.commit(SET_GLOBAL, ['netErr', true])
    }
    if (error.response.status) {
      // switch (error.response.status) {
      //   case 401:
      //     break
      //   case 403:
      //     break
      //   case 404:
      //     break
      //   default:
      // }
      if (error.response.status !== 301) Vue.prototype.$toast('API 请求失败')
      return Promise.reject(error.response)
    }
  }
)

/**
 * get 方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      .then(succ => { resolve(succ.data) })
      .catch(err => { reject(err.data) })
  })
}

/**
 * post 方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(succ => { resolve(succ.data) })
      .catch(err => { reject(err.data) })
  })
}
