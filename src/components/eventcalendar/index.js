import React, {
  useReducer,
  useState
} from 'react'
import { DatePicker } from 'antd-mobile'
import moment from 'moment'
import './style.scss'

const reducer = function (state, action) {
  switch (action.type) {
    case 'curenttab':
      return {
        ...state,
        timeWord: {
          tab: state.timeWord.tab,
          i: action.value
        }
      }
    case 'settheday':
      return {
        ...state,
        date: action.value
      }
    case 'setModalDateVisible':
      return {
        ...state,
        dateModalVisible: action.value
      }
    case 'setModalDateValue':
      return {
        ...state,
        dateModalValue: action.value
      }
    default:
      return state
  }
}

function EventTcalendar () {
  const [weekArr] = useState(['周日', '周一', '周二', '周三', '周四', '周五', '周六'])
  const [data, dispatch] = useReducer(reducer, {
    date: `${moment().format('YYYY/MM/DD')} ${weekArr[moment().weekday()]}`,
    timeWord: {
      i: 0,
      tab: [
        { name: '今天', value: 0 },
        { name: '明天', value: 1 },
        { name: '后天', value: 2 },
        { name: '自定义', value: -1 }
      ]
    },
    dateModalVisible: false,
    dateModalValue: ''
  })

  const clickCurrentTime = (value, t) => {
    const tms = moment(new Date()).add(value, 'days')
    dispatch({
      type: 'curenttab',
      value: t
    })
    if (value !== -1) {
      dispatch({
        type: 'settheday',
        value: `${tms.format('YYYY/MM/DD')} ${weekArr[tms.weekday()]}`
      })
    } else {
      dispatch({
        type: 'setModalDateVisible',
        value: true
      })
    }
  }

  const modalSelectDate = (value) => {
    const modalValue = moment(value).format('YYYY/MM/DD')
    dispatch({
      type: 'setModalDateVisible',
      value: false
    })
    dispatch({
      type: 'settheday',
      value: `${modalValue} ${weekArr[moment(new Date(modalValue)).weekday()]}`
    })
    dispatch({
      type: 'setModalDateValue',
      value: value
    })
  }

  console.log('reducerState', data)

  const { date, timeWord, dateModalVisible, dateModalValue } = data

  return (
    <div className='event-tcalendar'>
      <ul className='event-time-select'>
        {
          timeWord.tab.map(({ name, value }, t) => (
            <li
              className={`tab-button-blue-small${(timeWord.i === t) ? ' current' : ''}`}
              onClick={() => clickCurrentTime(value, t)}
              key={t}
            >
              {name}
            </li>
          ))
        }
      </ul>
      <div className='event-display-time'>
        <div>时间</div>
        <div className='edt-right'>{date}</div>
      </div>
      <DatePicker
        mode='date'
        title='请选择日期'
        minDate={new Date()}
        visible={dateModalVisible}
        value={dateModalValue}
        onOk={modalSelectDate}
        onDismiss={() => {
          dispatch({
            type: 'setModalDateVisible',
            value: false
          })
        }}
      />
    </div>
  )
}

export default React.memo(EventTcalendar)
