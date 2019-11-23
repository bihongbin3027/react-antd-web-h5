import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import Loading from '@/components/loading'
import { currentTime } from '@/utils'
import API from '@/api/api'
import './style.scss'

function CheckIn ({ history }) {
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [gpsInfo, setGpsInfo] = useState(null)
  const [data, setData] = useState({})

  // 布尔值用来区分定位是自动还是手动触发
  const bool = useRef()
  const map = useRef()
  const mapContainer = useRef()
  const mapGeolocation = useRef()

  const switchObj = function (status) {
    let news = {}
    switch (status) {
      case -1:
        news = {
          index: -1,
          name: '不可签到',
          text: '无法获取地址位置',
          className: 'error'
        }
        break
      case 0:
        news = {
          index: 0,
          name: '不可签到',
          text: '不在指定地点范围内',
          className: 'error'
        }
        break
      case 1:
        news = {
          index: 1,
          name: '签 到',
          text: '已进入签到范围内',
          className: 'allow'
        }
        break
      case 2:
        news = {
          index: 2,
          name: '已签到',
          text: '已完成',
          className: 'complete'
        }
        break
      default:
        news = null
    }
    return news
  }

  const getSignInResult = async function (lat, lng) {
    const result = await API.getSignInResult({
      longitude: lng,
      latitude: lat
    })
    if (loading) {
      setLoading(false)
    }
    Toast.hide()
    currentTime('timeing')
    if (result) {
      if (bool.current) {
        console.log('打开扫一扫')
        // eslint-disable-next-line
        wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1,
          scanType: ['qrCode', 'barCode'],
          success: function (res) {
            console.log('扫码结果：', res)
            Toast.success('签到成功', 1.5)
            setData(switchObj(2))
          },
          error: function (res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              window.alert('版本过低请升级')
            }
          }
        })
      } else {
        setData(switchObj(1))
      }
    } else {
      setData(switchObj(0))
    }
  }

  const onComplete = function (data) {
    if (data.info === 'SUCCESS') {
      setGpsInfo(data)
      getSignInResult(data.position.lat, data.position.lng)
      console.log('定位成功：', data)
    }
  }

  const onError = function (err) {
    Toast.hide()
    setGpsInfo(null)
    setLoading(false)
    currentTime('timeing')
    setData(switchObj(-1))
    console.log('定位失败', err)
  }

  const resetGps = function () {
    Toast.loading('定位中...', 0)
    bool.current = false
    mapGeolocation.current.getCurrentPosition()
  }

  const checkinClick = function () {
    if (data.index !== 2) {
      Toast.loading('请稍后...', 0)
      bool.current = true
      mapGeolocation.current.getCurrentPosition()
    }
  }

  useEffect(() => {
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
      map.current.destroy()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className='scroll-view checkin-view'>
      { loading ? <Loading /> : (
        <div className='checkin-container'>
          <h2>我要签到</h2>
          <div className='checkin-middle'>
            <div className={`checkin-radius ${data.className}`} onClick={() => checkinClick()}>
              <div className='text'>{data.name}</div>
              <div id='timeing' className='time' />
            </div>
            <div className='checkin-text'>{data.text}&nbsp;<span onClick={() => resetGps()}>重新定位</span></div>
          </div>
          <div className='layout-footer'>
            <div className='process-foot'>
              <button className='tab-button-blue normal straight btn-block' type='button' onClick={() => history.go(-1)}>返回</button>
            </div>
          </div>
        </div>
      ) }
      <div ref={mapContainer} style={{ height: '200px', marginTop: '20px' }} />
    </div>
  )
}

CheckIn.propTypes = {
  history: PropTypes.object
}

export default CheckIn
