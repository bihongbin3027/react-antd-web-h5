import React, {
  useState,
  useEffect
} from 'react'
import moment from 'moment'
import { Toast } from 'antd-mobile'
import F2 from '@antv/f2'
import API from '@/api/api'
import DateModal from '@/components/datemodal/datemodal'
import './myjob.scss'

function MyJob () {
  const [dateTime, setDateTime] = useState(() => {
    return moment().format('YYYY/MM')
  })
  const [dateVisible, setDateVisible] = useState(false)
  const dateSelect = (select) => {
    const monthIng = moment().format('YYYY-MM')
    const selectMonth = `${select[0]}-${select[1]}`
    if (moment(selectMonth).isSame(monthIng) || moment(selectMonth).isBefore(monthIng)) {
      setDateTime(`${select[0]}/${select[1]}`)
    } else {
      Toast.info('不能查询未来时间段', 1)
    }
  }
  const resetVisible = (visible) => {
    setDateVisible(visible)
  }
  const [all, setAll] = useState(0)

  useEffect(() => {
    document.title = '个人中心'
    async function fetchData () {
      const query = { month: dateTime.replace('/', '-') }
      Toast.loading('请稍后...', 0)
      const result = await API.brief(query)
      Toast.hide()
      const chart = new F2.Chart({
        id: 'chart',
        width: document.body.clientWidth - 24,
        height: 300,
        align: 'center'
      })
      setAll(result.all)
      chart.source(result.eventRota.map((u) => {
        return {
          ...u,
          sold: parseInt(u.sold, 10)
        }
      }))
      chart.interval().position('genre*sold').color('genre', ['#ff9900', '#4f77aa'])
      chart.render()
    }
    fetchData()
  }, [dateTime])

  return (
    <div className='scroll-view myjob-view'>
      <div className='myjob-h4 color2'>工作简报：</div>
      <div className='month-select'>日期切换：<span className='tab-button-blue-small' onClick={() => setDateVisible(true)}>{dateTime}</span></div>
      <div className='participate'>参与总数：<span className='color2'>{all}</span>次</div>
      <div className='canvas'>
        <canvas id='chart' />
      </div>
      <DateModal modalSelect={dateSelect} resetVisible={resetVisible} modalVisible={dateVisible} />
    </div>
  )
}

export default MyJob
