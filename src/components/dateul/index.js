import React, {
  useEffect,
  useReducer,
  useState,
  useCallback,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import Scroll from '@/components/scroll'
import DateModal from '@/components/datemodal/datemodal'
import moment from 'moment'
import './style.scss'

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return action.value
    default:
      return state
  }
}

function DateUl (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    dateVisible: false,
    normalDate: []
  }))
  const [dayData, setDayData] = useState([])
  const [activeMonth, setActiveMonth] = useState(null)
  const itemUl = useRef(null)

  const changeValue = function (key, val) {
    dispatch({
      type: 'changeValue',
      value: data.set(key, val)
    })
  }

  const dateSelect = (val) => {
    const date = moment().format('YYYY/MM')
    const valFt = `${val[0]}-${val[1]}`
    // val[1]月有多少天
    const currentMonthDays = moment(new Date(valFt)).daysInMonth()
    const weekText = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const fordd = function (s) {
      const dayweek = []
      for (let i = s; i <= currentMonthDays; i++) {
        let u = new Date(`${valFt}/${i}`)
        dayweek.push({
          date: moment(u).format('YYYY-MM-DD'),
          day: dayformat(i),
          week: weekText[moment(u).format('E') - 1],
          current: moment(moment().format('YYYY-MM-DD')).isSame(u)
        })
      }
      return dayweek
    }
    // false当前月，true未来月份
    if (!moment(new Date(date)).isBefore(valFt) && !props.openAll) {
      setDayData(fordd(moment().format('DD')))
    } else {
      setDayData(fordd(1))
    }
    setActiveMonth(val[1])
  }

  const setDateModal = (visible) => {
    changeValue('dateVisible', visible)
  }

  const itemClick = (item, index) => {
    setDayData(prev => {
      return prev.map((k, i) => {
        if (i === index) {
          k.current = true
          return k
        } else {
          k.current = false
          return k
        }
      })
    })
    props.onChange(item.date)
  }

  const dayformat = function (v) {
    return v < 10 ? '0' + v : v + ''
  }

  const layoutTime = useCallback(() => {
    // 当前年份
    let year = moment().format('YYYY')
    // 当前月
    let month = moment().format('MM')
    // 下一年
    let nextYear = moment().add(1, 'year').format('YYYY')
    // 前一年
    let prevYear = moment().add(-1, 'year').format('YYYY')
    let yearArr = [year, nextYear]
    let generateMonth = Array.from(Array(12), (v, k) => k + 1)
    const time = []
    if (props.openAll) {
      // 去年、今年、明年
      yearArr = [prevYear, year, nextYear]
    } else {
      // 今年、去年
      yearArr = [year, nextYear]
    }
    yearArr.forEach(cur => {
      let m = {}
      m.label = cur
      m.value = cur
      if (cur === year) {
        m.children = generateMonth.filter(mh => {
          if (props.openAll) {
            return mh
          } else {
            return mh >= month
          }
        }).map(cd => ({
          label: dayformat(cd),
          value: dayformat(cd)
        }))
      } else {
        m.children = generateMonth.map(cd => ({
          label: dayformat(cd),
          value: dayformat(cd)
        }))
      }
      time.push(m)
    })
    return time
  }, [props.openAll])

  useEffect(() => {
    changeValue('normalDate', layoutTime())
    dateSelect(moment().format('YYYY-MM').split('-'))
    // eslint-disable-next-line
  }, [layoutTime])

  useEffect(() => {
    let itemUlDom = itemUl.current
    let itemElems = itemUlDom.querySelectorAll('li')
    let totalWidth = 0
    if (itemElems.length) {
      Array.from(itemElems).forEach(ele => {
        totalWidth += ele.offsetWidth
      })
      itemUlDom.style.width = `${totalWidth}px`
    }
  }, [dayData])

  const {
    dateVisible,
    normalDate
  } = data.toJS()

  return (
    <div className='dateul-room'>
      <div className='room-top'>
        <div className='room-month' onClick={() => changeValue('dateVisible', true)}>{activeMonth}月<i /></div>
        <div className='room-day'>
          <Scroll direction='horizental'>
            <ul ref={itemUl} className='day-item'>
              {
                dayData.map((item, index) => (
                  <li
                    className={item.current ? 'current' : ''}
                    key={index}
                    onClick={() => itemClick(item, index)}
                  >
                    <div className='room-day-num'>{item.day}</div>
                    <div className='room-weeks'>{item.week}</div>
                  </li>
                ))
              }
            </ul>
          </Scroll>
        </div>
      </div>
      <DateModal
        initTime={normalDate}
        modalSelect={dateSelect}
        resetVisible={setDateModal}
        modalVisible={dateVisible}
      />
    </div>
  )
}

DateUl.defaultProps = {
  openAll: false,
  onChange: () => {}
}

DateUl.propTypes = {
  // 是否查询去年今年明年日期
  openAll: PropTypes.bool,
  // 选择时间回调
  onChange: PropTypes.func
}

export default DateUl
