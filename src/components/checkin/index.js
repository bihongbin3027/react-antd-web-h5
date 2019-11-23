import React, {
  useReducer,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { Modal, Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { currentTime } from '@/utils'
import API from '@/api/api'
import './style.scss'

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return state.set(action.value.key, action.value.val)
    default:
      return state
  }
}

function CheckIn (props) {
  const { visible, status } = props
  const [data, dispatch] = useReducer(reducer, fromJS({
    modalName: {
      type: null,
      title: null,
      radius: null,
      className: null,
      text: null
    }
  }))

  // 布尔值用来区分定位是自动还是手动触发
  const bool = useRef(false)
  const map = useRef()
  const mapContainer = useRef()
  const mapGeolocation = useRef()

  const changeValue = function (key, val) {
    dispatch({
      type: 'changeValue',
      value: {
        key,
        val
      }
    })
  }

  const switchTitle = useCallback((u) => {
    let modalType = {}
    const span = (name, icon) => <span><i className={icon} key={u} />{name}</span>
    switch (u) {
      case 1:
        modalType = {
          type: 1,
          title: '我要签到',
          radius: '签到',
          className: 'allow',
          text: span('已经在定位地点范围内', 'gpsok-icon')
        }
        break
      case 2:
        modalType = {
          type: 2,
          title: '我要签到',
          radius: '不可签到',
          className: 'error',
          text: span('不在定位地点范围内', 'gpsno-icon')
        }
        break
      case 3:
        modalType = {
          type: 3,
          title: '我要签到',
          radius: '已签到',
          className: 'complete',
          text: span('已完成', 'gpsok-icon')
        }
        break
      case 4:
        modalType = {
          type: 4,
          title: '我要签退',
          radius: '签退',
          className: 'allow',
          text: span('已经在定位地点范围内', 'gpsok-icon')
        }
        break
      case 5:
        modalType = {
          type: 5,
          title: '我要签退',
          radius: '不可签退',
          className: 'error',
          text: span('不在定位地点范围内', 'gpsno-icon')
        }
        break
      case 6:
        modalType = {
          type: 6,
          title: '我要签退',
          radius: '已签退',
          className: 'complete',
          text: span('已完成', 'gpsok-icon')
        }
        break
      default:
    }
    return modalType
  }, [])

  const closeModal = () => {
    props.changeVisible(false)
  }

  // 重新定位
  const resetGps = () => {
    Toast.loading('定位中...', 0)
    bool.current = false
    mapGeolocation.current.getCurrentPosition()
  }

  const getSignInResult = useCallback(async function ({ meetingRoomId, lng, lat }) {
    let errorVal = 0
    let result = await API.getSignInResult({
      meetingRoomId: meetingRoomId,
      longitudeValue: lng,
      latitudeValue: lat
    })
    Toast.hide()
    if (result) {
      if (bool.current) {
        // 这里后期要加个判断，是定位签到还是扫码+定位签到的逻辑
        console.log('打开扫一扫')
        // eslint-disable-next-line
        wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1,
          scanType: ['qrCode', 'barCode'],
          success: function (res) {
            let okVal = {}
            if (status === 1) {
              okVal.value = 3
              okVal.text = '签到成功'
            }
            if (status === 4) {
              okVal.value = 6
              okVal.text = '签退成功'
            }
            console.log('扫码结果：', res)
            Toast.success(okVal.text, 1.5)
            // 设置签到或签退状态
            changeValue('modalName', switchTitle(okVal.value))
          },
          error: function (res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              window.alert('版本过低请升级')
            }
          }
        })
      } else {
        // 设置签到或签退状态
        changeValue('modalName', switchTitle(status))
      }
    } else {
      if (status === 1) {
        // 不可签到
        errorVal = 2
      }
      if (status === 4) {
        // 不可签退
        errorVal = 5
      }
      // 设置签到或签退状态
      changeValue('modalName', switchTitle(errorVal))
    }
  }, [status, switchTitle])

  // 定位成功
  const onComplete = useCallback((data) => {
    let params = {
      meetingRoomId: '04c86954d60a4c509a17d52750e0e072',
      lat: data.position.lat,
      lng: data.position.lng
    }
    if (data.info === 'SUCCESS') {
      getSignInResult(params)
      console.log('定位成功：', data)
    }
  }, [getSignInResult])

  // 定位失败
  const onError = useCallback((err) => {
    let errorVal = 0
    if (status === 1) {
      // 不可签到
      errorVal = 2
    }
    if (status === 4) {
      // 不可签退
      errorVal = 5
    }
    Toast.hide()
    // 设置签到或签退状态
    changeValue('modalName', switchTitle(errorVal))
    console.log('定位失败', err)
    Toast.info('退出应用或企业微信重新进入，请允许或许您的地理位置', 1.5)
  }, [status, switchTitle])

  const checkinClick = () => {
    // 签到或者签退状态
    if (modalName.type === 1 || modalName.type === 4) {
      Toast.loading('请稍后...', 0)
      bool.current = true
      mapGeolocation.current.getCurrentPosition()
    }
  }

  // 人工审核
  const manualReview = () => {
    Modal.alert('提示', '已提交人工审核')
  }

  useEffect(() => {
    if (mapContainer.current && visible) {
      // 触发默认状态
      changeValue('modalName', switchTitle(status))
      // 时间
      currentTime('timeing')
      Toast.loading('定位中...', 0)
      // eslint-disable-next-line
      map.current = new AMap.Map(mapContainer.current, {
        resizeEnable: true
      })
      // eslint-disable-next-line
      AMap.plugin('AMap.Geolocation', function () {
        // eslint-disable-next-line
        mapGeolocation.current = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: 'RB', // 定位按钮的停靠位置
          // eslint-disable-next-line
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        })
        map.current.addControl(mapGeolocation.current)
        mapGeolocation.current.getCurrentPosition()
        // eslint-disable-next-line
        AMap.event.addListener(mapGeolocation.current, 'complete', onComplete)
        // eslint-disable-next-line
        AMap.event.addListener(mapGeolocation.current, 'error', onError)
      })
      return () => {
        console.log('销毁高德地图实例')
        map.current.destroy()
      }
    }
  }, [onComplete, onError, status, switchTitle, visible])

  const { modalName } = data.toJS()

  console.log('modalName', modalName)

  return (
    <div>
      <Modal
        className='checkin-modal-view'
        title={modalName.title}
        visible={visible}
        transparent
        closable
        onClose={() => {
          closeModal()
        }}
        footer={[{
          text: '定位有误？提交人工审核签到',
          onPress: () => manualReview()
        }]}
      >
        <div className='checkin-view'>
          <div className='checkin-middle'>
            <div
              className={`checkin-radius ${modalName.className}`}
              onClick={() => checkinClick()}>
              <div className='text'>{modalName.radius}</div>
              <div id='timeing' className='time' />
            </div>
          </div>
          <div className={`checkin-ms ${(modalName.type === 2 || modalName.type === 5) ? 'grey' : ''}`}>{modalName.text}</div>
          {
            (modalName.type === 2 || modalName.type === 5) && <div className='reset-gps' onClick={resetGps}><i className='gpsrst-icon' />重新定位</div>
          }
          <div ref={mapContainer} style={{ display: 'none' }} />
        </div>
      </Modal>
    </div>
  )
}

CheckIn.defaultProps = {
  visible: false,
  status: 1,
  changeVisible: () => {}
}

CheckIn.propTypes = {
  visible: PropTypes.bool.isRequired,
  status: PropTypes.number.isRequired,
  changeVisible: PropTypes.func.isRequired
}

export default CheckIn
