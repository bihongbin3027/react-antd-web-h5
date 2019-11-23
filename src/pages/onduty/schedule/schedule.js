import React, {
  useEffect,
  useState,
  useRef,
  memo,
  useCallback,
  useMemo
} from 'react'
import moment from 'moment'
import { Toast } from 'antd-mobile'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import DateModal from '@/components/datemodal/datemodal'
import API from '@/api/api'
import './schedule.scss'

let calendar = null

const MeMoDateModal = memo(DateModal)

function Schedule () {
  const textareaRef = useRef(null)
  const [textareaHeight, setTextareaHeight] = useState(10)
  const [dateTime, setDateTime] = useState(() => {
    return moment().format('YYYY/MM')
  })
  const [initTime, setInitTime] = useState([])
  const [dateVisible, setDateVisible] = useState(false)
  const [dutyPerson, setDutyPerson] = useState([])
  const [more, setMore] = useState({})
  const dateSelect = useCallback((select) => {
    setDateTime(`${select[0]}/${select[1]}`)
  }, [])
  const resetVisible = useCallback((visible) => {
    setDateVisible(visible)
  }, [])

  useEffect(() => {
    document.title = '排班表'
  }, [])

  useEffect(() => {
    async function init () {
      setDutyPerson([])
      setMore({})
      setTextareaHeight(0)
      Toast.loading('请稍后...', 0)
      const yearAndMounth = await API.getSchedulingAllYearAndMounth()
      const schedulingByYears = await API.getHandoverSchedulingByYears({
        years: dateTime.replace('/', '-')
      })
      const scheduleCfgInfo = await API.getHandoverScheduleCfgInfo()
      const calendarLoad = function (data = '[]') {
        // 日历
        calendar = new Calendar(document.getElementById('calendarEl'), {
          contentHeight: 'auto',
          locale: 'zh-cn',
          plugins: [ dayGridPlugin ],
          defaultView: 'dayGridMonth',
          defaultDate: new Date(`${dateTime}/01`),
          header: false,
          weekends: true,
          eventOrder: 'sort',
          events: data ? JSON.parse(data).map(({ title, start, allDay, sort, classNames }) => {
            let [color] = classNames
            if (color === 'yellow') {
              color = '#cbbe00'
            }
            return {
              title,
              start,
              allDay,
              sort,
              backgroundColor: color,
              borderColor: color,
              textColor: '#fff'
            }
          }) : []
        })
        calendar.render()
      }
      Toast.hide()
      // 月份时间
      if (yearAndMounth && yearAndMounth.length) {
        setInitTime(yearAndMounth.map(({ year, mounthList }) => ({
          label: year,
          value: year,
          children: mounthList.map((child) => ({
            label: child,
            value: child
          }))
        })))
      }
      // 排班表数据
      if (schedulingByYears) {
        let { roleData, schduleData } = schedulingByYears
        if (roleData) {
          roleData = JSON.parse(roleData).map((item) => {
            if (item.color === 'yellow') {
              item.color = '#cbbe00'
            }
            return item
          })
        } else {
          roleData = []
        }
        // 角色
        setDutyPerson(roleData)
        // 日历
        calendarLoad(schduleData)
      } else {
        calendarLoad()
      }
      // 公告
      if (scheduleCfgInfo && scheduleCfgInfo !== '[]') {
        const { title, content } = JSON.parse(scheduleCfgInfo)
        setMore({
          title,
          content
        })
        setTextareaHeight(textareaRef.current.scrollHeight)
      }
    }
    init()
    return () => {
      calendar.destroy()
    }
  }, [dateTime])

  return (
    <div className='schedule-view footer-reserved'>
      <div className='month-switch'>日期切换：<span className='tab-button-blue-small' onClick={() => setDateVisible(true)}>{dateTime}</span></div>
      <MeMoDateModal
        initTime={useMemo(() => initTime, [initTime])}
        modalSelect={dateSelect}
        resetVisible={resetVisible}
        modalVisible={useMemo(() => dateVisible, [dateVisible])}
      />
      {
        dutyPerson.length ? (
          <ul className='person-ul'>
            {
              dutyPerson.map(({ color, name }, index) => (
                <li key={index}>
                  <em style={{ backgroundColor: color }} />
                  <span style={{ color }}>{name}</span>
                </li>
              ))
            }
          </ul>
        ) : null
      }
      <div id='calendarEl' />
      {
        Object.keys(more).length ? (
          <dl className='remarks'>
            <dt>{more.title}</dt>
            <dd>
              <textarea
                ref={textareaRef}
                readOnly
                style={{ height: `${textareaHeight}px` }}
                value={more.content || ''}
              />
            </dd>
          </dl>
        ) : null
      }
    </div>
  )
}

export default Schedule
