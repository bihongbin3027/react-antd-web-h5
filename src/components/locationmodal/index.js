import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import Scroll from '@/components/scroll'
import './style.scss'

function reducer (state, action) {
  switch (action.type) {
    case 'changeLocation':
      return {
        ...state,
        locn: action.value
      }
    case 'changeSearchResultList':
      return {
        ...state,
        searchResultList: action.value
      }
    case 'changeListIndex':
      return {
        ...state,
        listIndex: action.value
      }
    default:
      return state
  }
}

function Location (props) {
  let [data, dispatch] = useReducer(reducer, {
    locn: {},
    searchResultList: [],
    listIndex: null
  })
  const map = useRef(null)
  const mapview = useRef(null)

  const { visible, ranges } = props

  const { onChange: mapChange } = props

  const closeModal = () => {
    props.setVisible(false)
  }

  const okModal = () => {
    if (!Object.keys(data.locn).length) {
      Toast.info('请输入并选择地址', 1)
      return
    }
    closeModal()
    mapChange(data.locn)
  }

  const selectAddress = (item, index) => {
    // 清除地图上所有添加的覆盖物
    map.current.clearMap()
    // 设置覆盖物和标记
    setCircle(item.location.lng, item.location.lat)
    dispatch({
      type: 'changeLocation',
      value: {
        address: item.name,
        position: item.location
      }
    })
    dispatch({
      type: 'changeListIndex',
      value: index
    })
  }

  const setCircle = useCallback((lat, lng) => {
    // eslint-disable-next-line
    let masker = new AMap.Marker({
      icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      position: [lat, lng],
      // eslint-disable-next-line
      offset: new AMap.Pixel(-12.5, -17)
    })
    // eslint-disable-next-line
    let circle = new AMap.Circle({
      map: map.current,
      center: [lat, lng], // 设置线覆盖物路径
      radius: ranges,
      borderWeight: 1,
      strokeColor: '#ff33ff',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillOpacity: 0.4,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      fillColor: '#1791fc',
      zIndex: 50
    })
    // 添加圆
    map.current.add(circle)
    // 添加标记物
    masker.setMap(map.current)
    // 缩放地图到合适的视野级别
    map.current.setFitView([ circle ])
  }, [ranges])

  useEffect(() => {
    // eslint-disable-next-line
    map.current = new AMap.Map(mapview.current, {
      resizeEnable: true
    })
    // 输入提示
    // eslint-disable-next-line
    let auto = new AMap.Autocomplete({
      input: 'ltn-search'
    })
    // eslint-disable-next-line
    let placeSearch = new AMap.PlaceSearch({
      map: map.current
    }) // 构造地点查询类
    // eslint-disable-next-line
    AMap.event.addListener(auto, 'select', function (e) {
      // eslint-disable-next-line
      placeSearch.setCity(e.poi.adcode)
      placeSearch.search(e.poi.name, function (status, result) {
        // 搜索成功时，result即是对应的匹配数据
        dispatch({
          type: 'changeSearchResultList',
          value: result.poiList.pois
        })
      })
    })
  }, [])

  const { searchResultList, listIndex } = data

  return (
    <div
      className='scroll-view footer-reserved modal-style-view'
      style={{ 'display': visible ? 'block' : 'none' }}
    >
      <div className='location-search'>
        <input id='ltn-search' placeholder='请输入关键字' />
      </div>
      <div className='location-modal-view'>
        <div ref={mapview} style={{ height: '260px' }} />
      </div>
      <div className='location-search-wrap'>
        <Scroll>
          <div>
            {
              searchResultList.map((item, index) => (
                <li
                  className={listIndex === index ? 'active' : null}
                  onClick={() => selectAddress(item, index)}
                  key={index}
                >
                  <div>{item.name}</div>
                  <p>{item.address}</p>
                </li>
              ))
            }
          </div>
        </Scroll>
      </div>
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue white straight' onClick={closeModal}>返回</button>
          </div>
          <div>
            <button type='button' className='tab-button-blue current straight' onClick={() => okModal()}>确定</button>
          </div>
        </div>
      </div>
    </div>
  )
}

Location.defaultProps = {
  visible: false,
  ranges: 50,
  setVisible: () => {},
  onChange: () => {}
}

Location.propTypes = {
  visible: PropTypes.bool,
  // 范围半径
  ranges: PropTypes.number,
  setVisible: PropTypes.func,
  onChange: PropTypes.func
}

export default React.memo(Location)
