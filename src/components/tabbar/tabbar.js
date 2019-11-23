import React, {
  useState
} from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import { Toast } from 'antd-mobile'
import API from '@/api/api'
import './tabbar.scss'

function TabBar ({ match, tab = [], add = [] }) {
  const [visible, setVisible] = useState(false)
  const toPath = function ({ templateType, templateId, value }) {
    // 事务处理
    if (templateType === 1) {
      Toast.loading('请稍后...', 0)
      API.watchDate({ templateId }).then(watchdata => {
        const getTime = moment().format('YYYY/MM/DD')
        const isTimeRange = watchdata.isTimeRange
        const scheduleTimeRange = watchdata.scheduleTimeRange
        const toNext = function () {
          window.location.href = `${value}?templateId=${templateId}`
        }
        const isDuringDate = function (beginDateStr, endDateStr) {
          let curDate = new Date()
          let beginDate = new Date(beginDateStr)
          let endDate = new Date(endDateStr)
          if (curDate >= beginDate && curDate <= endDate) {
            return true
          }
          return false
        }
        if (isTimeRange === 0) {
          Toast.hide()
          toNext()
        } else {
          if (scheduleTimeRange) {
            const jsonTimeRange = JSON.parse(scheduleTimeRange)
            const isBoolFunc = function (arr) {
              let bool = false
              for (let i = 0, len = arr.length; i < len; i++) {
                let startTime = `${getTime} ${arr[i][0]}`
                let endTime = `${getTime} ${arr[i][1]}`
                if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
                  endTime = `${moment().add(1, 'days').format('YYYY/MM/DD')} ${arr[i][1]}`
                }
                if (isDuringDate(startTime, endTime)) {
                  bool = true
                  break
                }
              }
              if (bool) {
                toNext()
              } else {
                window.location.href = `#/timelimit`
              }
            }
            API.getHolidayInfo({
              date: getTime.replace(/\//g, '')
            }).then(res => {
              const result = JSON.parse(res).data
              const wrokDayData = jsonTimeRange.wrokDay.date
              const holiDayData = jsonTimeRange.holiDay.date
              Toast.hide()
              // 工作日
              if (result === 0 || result === 2) {
                if (jsonTimeRange.wrokDay.isTimeRange === 1) {
                  isBoolFunc(wrokDayData)
                } else {
                  toNext()
                }
              }
              // 休息日
              if (result === 1 || result === 3) {
                if (jsonTimeRange.holiDay.isTimeRange === 1) {
                  isBoolFunc(holiDayData)
                } else {
                  toNext()
                }
              }
            })
          }
        }
      })
    } else {
      if (value.indexOf('watchLogType') !== -1) {
        window.location.href = `${value}&templateId=${templateId}`
      } else {
        window.location.href = `${value}?templateId=${templateId}`
      }
    }
  }

  return (
    <div id='foottab' className='tab-bar'>
      <div className='ml-popover' style={{ display: visible ? 'flex' : 'none' }}>
        <div className='ml-popover-mask' onClick={() => setVisible(false)} />
        <div className='ml-popover-parent'>
          <div className='ml-popover-content'>
            <div className='ml-popover-arrow' />
            <div className='ml-popover-inner'>
              <div className='ml-popover-inner-wrapper'>
                {
                  add.map((val, index) => {
                    return (
                      <div className='ml-popover-item' key={index} onClick={() => {
                        toPath(val)
                      }}>
                        <div className='ml-popover-item-container'>
                          <span className='ml-popover-item-content'>{val.text}</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {
          tab.map(({ icon, url, type, text }, index) => {
            return (
              <li key={index}>
                {
                  (type === 'add' && add.length) ? (
                    <span className='add' onClick={() => {
                      if (add.length === 1) {
                        toPath(add[0])
                      } else {
                        setVisible(true)
                      }
                    }}>
                      <i className='add-icon' />
                    </span>
                  ) : (
                    <NavLink to={`${match.url}/${url}`}>
                      <>
                        <i className={`${icon}-icon`} />
                        <span className='text'>{text}</span>
                      </>
                    </NavLink>
                  )
                }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

TabBar.propTypes = {
  match: PropTypes.object.isRequired,
  tab: PropTypes.array,
  add: PropTypes.array
}

export default TabBar
