import axios from 'axios'
import { Toast } from 'antd-mobile'
import _ from 'lodash'
import { loadFromLocal, saveToLocal } from '@/utils/index'
import API from '@/api/api'
import envconfig from '@/envconfig/envconfig'

// http 请求拦截器
axios.interceptors.request.use(request => {
  return request
}, error => {
  return Promise.reject(error)
})

// http 响应拦截器
axios.interceptors.response.use(response => {
  const { code, message } = response.data
  const token = loadFromLocal('h5', 'wxToken')
  const userInfo = loadFromLocal('h5', 'userInfo')
  // 重新授权
  const reauthorization = function () {
    API.getWxOpenOauth2Url()
  }
  if (code === -1) {
    Toast.info(message, 1)
    return Promise.reject(message)
  } else if (code === 1013) {
    Toast.info(message, 1)
    return Promise.reject(message)
  } else if (code === 10001) {
    console.log('server.js,token:', token)
    console.log('server.js,userInfo:', userInfo)
    if (token && userInfo) {
      // 重新获取token
      API.getWxToken({
        userId: userInfo.userId
      }).then(tn => {
        let selfHref = window.location.href
        let splicStr = '&wxToken='
        saveToLocal('h5', 'wxToken', tn)
        API.getCurrentUser().then(res => {
          Toast.hide()
          let { code, data } = res
          if (code === 1) {
            if (data.modules && data.modules.length) {
              data.modules = _.sortBy(data.modules, ['type'])
              for (const item of data.modules) {
                if (item.templateList && item.templateList.length) {
                  item.templateList = _.sortBy(item.templateList, ['templateType'])
                }
              }
              // 存储用户信息
              saveToLocal('h5', 'userInfo', data)
              if (selfHref.indexOf('/page') !== -1) {
                window.location.href = selfHref.split(splicStr)[0] + splicStr + res
              }
              window.location.reload()
            } else {
              window.location.href = '#/notpermission'
            }
          }
        })
      })
    } else {
      reauthorization()
    }
  } else {
    return Promise.resolve(response)
  }
}, error => {
  if (error.response) {
    Toast.info(error.response.data.message, 1)
    return Promise.reject(error.response)
  }
})

export default class Server {
  axios (method, url, params) {
    return new Promise((resolve, reject) => {
      let _option = params
      _option = {
        method,
        url,
        baseURL: envconfig.baseUrl,
        timeout: 100000,
        params: null,
        data: null,
        // 是否携带cookies发起请求
        withCredentials: false,
        headers: {
          common: {
            token: loadFromLocal('h5', 'wxToken'),
            'Content-Type': 'application/json;charset=UTF-8'
          }
        },
        validateStatus: (status) => {
          return status >= 200 && status < 300
        },
        ...params
      }
      axios.request(_option).then(res => {
        resolve(res && (typeof res.data === 'object' ? res.data : JSON.parse(res.data)))
      }, error => {
        if (error.response) {
          reject(error.response.data)
        } else {
          reject(error)
        }
      })
    })
  }
}
