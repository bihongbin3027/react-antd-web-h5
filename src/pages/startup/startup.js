import React, {
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { parse } from 'query-string'
import _ from 'lodash'
import { saveToLocal, loadFromLocal } from '@/utils/index'
import API from '@/api/api'
import Loading from '@/components/loading'

// 重新授权
const reauthorization = function () {
  API.getWxOpenOauth2Url()
}

function Startup ({ location }) {
  useEffect(() => {
    const getInit = () => {
      const { id, param, wxToken, actionhref } = parse(location.search.split('?')[1])
      const getConfig = async (token) => {
        saveToLocal('h5', 'wxToken', token)
        const { appId, timeStamp, nonceStr, signature } = await API.getWXjsdk()
        // 获取保存用户信息和权限
        const getUser = function () {
          API.getCurrentUser().then(res => {
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
                if (param) {
                  window.location.href = `#/${actionhref}?id=${param}`
                } else if (id) {
                  window.location.href = `#/${actionhref}?id=${id}`
                } else {
                  window.location.href = `#/${actionhref}`
                }
              } else {
                window.location.href = '#/notpermission'
              }
            } else {
              // 重新授权
              reauthorization()
            }
          })
        }
        // eslint-disable-next-line
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
          appId: appId, // 必填，企业微信的corpID
          timestamp: timeStamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: [
            'chooseImage',
            'getLocalImgData',
            'uploadImage',
            'previewImage',
            'closeWindow',
            'scanQRCode'
          ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        })
        if (process.env.NODE_ENV === 'development') {
          getUser()
        } else {
          // eslint-disable-next-line
          wx.ready(function () {
            getUser()
          })
        }
      }
      if (wxToken === 'invalid') {
        // 重新授权
        reauthorization()
      } else if (wxToken) {
        getConfig(wxToken)
      } else {
        getConfig(loadFromLocal('h5', 'wxToken'))
      }
    }
    getInit()
  }, [location])
  return (
    <>
      <Loading />
    </>
  )
}

Startup.propTypes = {
  location: PropTypes.object
}

export default Startup
