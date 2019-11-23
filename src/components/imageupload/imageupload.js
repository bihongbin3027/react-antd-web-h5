import React, {
  useState,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import './imageupload.scss'

const u = navigator.userAgent
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

function ImageUpload ({ imglist, normal = [] }) {
  const [annexGather, setAnnexGather] = useState([])
  const addAnnex = useCallback(() => {
    let ocalIdArr = []
    // eslint-disable-next-line
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      defaultCameraMode: 'batch', // 表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
      isSaveToAlbum: 1, // 整型值，0表示拍照时不保存到系统相册，1表示自动保存，默认值是1
      success: function (res) {
        ocalIdArr = res.localIds
        let i = 0
        let len = ocalIdArr.length
        const upload = () => {
          console.log('ocalIdArr[i]：', ocalIdArr[i])
          // eslint-disable-next-line
          wx.uploadImage({
            localId: ocalIdArr[i],
            success: function (server) {
              const { serverId } = server
              if (isAndroid) {
                setAnnexGather((prev) => {
                  return [
                    ...prev,
                    {
                      fileImg: ocalIdArr[i],
                      serverId: serverId
                    }
                  ]
                })
                i++
                if (i < len) {
                  upload()
                }
              }
              if (isIOS) {
                // eslint-disable-next-line
                wx.getLocalImgData({
                  localId: ocalIdArr[i], // 图片的localID，success拿到base64数据
                  success: function (baseimg) {
                    setAnnexGather((prev) => {
                      return [
                        ...prev,
                        {
                          fileImg: baseimg.localData,
                          serverId: serverId,
                          iosPreview: ocalIdArr[i]
                        }
                      ]
                    })
                    i++
                    if (i < len) {
                      upload()
                    }
                  }
                })
              }
            }
          })
        }
        upload()
      }
    })
  }, [])
  const removeFile = useCallback((e, index) => {
    e.stopPropagation()
    setAnnexGather((prev) => prev.filter((v, k) => k !== index))
  }, [])
  const previewImage = useCallback((item) => {
    if (window.location.href.indexOf('id=') !== -1) {
      return
    }
    if (isAndroid) {
      // eslint-disable-next-line
      wx.previewImage({
        current: item.fileImg, // 当前显示图片的http链接
        urls: annexGather.map((g) => g.fileImg) // 需要预览的图片http链接列表
      })
    }
    if (isIOS) {
      // eslint-disable-next-line
      wx.previewImage({
        current: item.iosPreview, // 当前显示图片的http链接
        urls: annexGather.map((g) => g.iosPreview) // 需要预览的图片http链接列表
      })
    }
  }, [annexGather])

  useEffect(() => {
    setAnnexGather(() => {
      if (normal.length) {
        return normal.map((n) => {
          return {
            fileImg: n.img,
            url: n.url,
            serverId: ''
          }
        })
      } else {
        return []
      }
    })
  }, [normal])

  useEffect(() => {
    imglist(annexGather.map((v) => {
      if (v.serverId) {
        return v.serverId
      } else {
        return 'url:' + v.url
      }
    }))
    console.log('annexGather：', annexGather)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annexGather])

  return (
    <div className='photo-annex'>
      <div className='top'>
        <i>附件：</i>
        <span className='tab-button-blue-small' onClick={() => addAnnex()}>
          <div className='af'>
            <i className='fujian-icon' />添加附件
          </div>
        </span>
      </div>
      <ul className='annex-li'>
        {
          annexGather.map((item, index) => (
            <li key={index} onClick={() => previewImage(item)} style={{ backgroundImage: `url(${item.fileImg})` }}>
              <s className='add-radius-rotate' onClick={(e) => removeFile(e, index)} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

ImageUpload.propTypes = {
  imglist: PropTypes.func,
  normal: PropTypes.array
}

export default ImageUpload
