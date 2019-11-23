import React, {
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { parse } from 'query-string'
import API from '@/api/api'
import './selecttype.scss'

function SelectType ({ history, location }) {
  const { templateId } = parse(location.search)
  const eventLevel = ['轻微', '一般', '严重', '重大']
  const [loading, setLoading] = useState(false)
  const [eventType, setEventType] = useState([])
  const [levelIndex, setLevelIndex] = useState(null)
  const [typeIndex, setTypeIndex] = useState(null)
  const levelSwitch = (index) => {
    let obj = {}
    let str = 'tab-button-'
    switch (index) {
      case 0:
        obj.btnIcon = `qw-icon`
        obj.btnStyle = `${str}green`
        break
      case 1:
        obj.btnIcon = `yb-icon`
        obj.btnStyle = `${str}blue`
        break
      case 2:
        obj.btnIcon = `yz-icon`
        obj.btnStyle = `${str}orange`
        break
      case 3:
        obj.btnIcon = `zd-icon`
        obj.btnStyle = `${str}red`
        break
      default:
        obj.btnIcon = ''
        obj.btnStyle = ''
    }
    return obj
  }
  const activeClick = (name, index) => {
    if (name === 'level') {
      setLevelIndex(index)
    }
    if (name === 'type') {
      setTypeIndex(index)
    }
  }
  const indexActive = (o, t) => {
    return o === t ? 'active' : ''
  }
  const next = () => {
    if (levelIndex === null) {
      Toast.info('请选择事件严重程度', 1)
      return
    }
    if (typeIndex === null) {
      Toast.info('请选择事件类型', 1)
      return
    }
    history.push({
      pathname: '/eventsubmit',
      search: `level=${levelIndex}&genre=${eventType[typeIndex].id}&templateId=${templateId}`
    })
  }

  useEffect(() => {
    document.title = '选择事件程度与类型'
    const fetchEventType = async () => {
      Toast.loading('请稍后...', 0)
      const result = await API.eventType({
        type: 1,
        templateId
      })
      Toast.hide()
      setLoading(true)
      setEventType(result)
    }
    fetchEventType()
  }, [templateId])

  return (
    loading ? (
      <div className='scroll-view footer-reserved selecttype-view'>
        <h5>请选择事件严重程度</h5>
        <ul className='event-level'>
          {
            eventLevel.map((item, index) => (
              <li key={index} onClick={() => activeClick('level', index)}>
                <span className={`${levelSwitch(index).btnStyle} ${indexActive(levelIndex, index)}`}>
                  <div>
                    <i className={levelSwitch(index).btnIcon} />{item}
                  </div>
                </span>
              </li>
            ))
          }
        </ul>
        <h5>请选择事件类型</h5>
        <ul className='type'>
          {
            eventType.map((item, index) => (
              <li key={index} onClick={() => activeClick('type', index)}>
                <span className={`tab-button-blue ${indexActive(typeIndex, index)}`}>{item.name}</span>
              </li>
            ))
          }
        </ul>
        <div className='layout-footer'>
          <div className='event-foot'>
            <div><button type='button' className='tab-button-blue normal straight' onClick={() => { history.go(-1) }}>取消</button></div>
            <div><button type='button' className='tab-button-blue current straight' onClick={() => next()}>下一步</button></div>
          </div>
        </div>
      </div>
    ) : null
  )
}

SelectType.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object
}

export default SelectType
