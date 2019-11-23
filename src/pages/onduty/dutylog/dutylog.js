import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Toast } from 'antd-mobile'
import MeScroll from 'mescroll.js'
import DateModal from '@/components/datemodal/datemodal'
import API from '@/api/api'
import 'mescroll.js/mescroll.min.css'
import '@/pages/affair/list/list.scss'

const alert = Modal.alert

function DutyLog ({ history }) {
  const [querySearch] = useState(['全部', '我的'])
  const [queryCurrent, setQueryCurrent] = useState(0)
  const [current, setCurrent] = useState(0)
  const [dutyModal, setDutyModal] = useState(false)
  const [logType, setLogType] = useState(null)
  const [watchLogType, setWatchLogType] = useState(3)
  const [tabData, setTabData] = useState([
    {
      text: '行政日志',
      unRead: 0,
      value: 3
    },
    {
      text: '投诉日志',
      unRead: 0,
      value: 4
    }
  ])
  const [list, setList] = useState([])
  const [dateTime, setDateTime] = useState(() => {
    return moment().format('YYYY/MM')
  })
  const [dateVisible, setDateVisible] = useState(false)
  const [downCount, setDownCount] = useState(false)
  const mescroll = useRef(null)
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
  const switchTabIcon = (index, type) => {
    switch (index) {
      case 0:
        if (type === 'modal') {
          return 'shiwu-modal-icon'
        } else {
          return 'treatment-icon'
        }
      case 1:
        if (type === 'modal') {
          return 'tousu-modal-icon'
        } else {
          return 'complaint-icon'
        }
      default:
        return ''
    }
  }
  const setDutyBool = (bool) => {
    if (bool) {
      setLogType(null)
    }
    setDutyModal(bool)
  }
  const logTypeClick = (index) => {
    setLogType(index)
  }
  const logTypeConfirm = () => {
    if (logType === null) {
      Toast.info('请选择值班日志类型', 1)
      return
    }
    history.push({
      pathname: '/createattendance',
      search: `watchLogType=${logType}`
    })
  }
  const badgeSwitch = ({ handoverStatus }) => {
    /**
     * 0 待接班
     * 1 草稿
     * 2 已接班
     */
    switch (handoverStatus) {
      case 0:
        return 'badge-error'
      case 1:
        return 'badge-grey'
      case 2:
        return 'badge-primary'
      default:
        return ''
    }
  }
  const seeDetails = ({ id, handoverStatus, watchLogType }) => {
    if (handoverStatus === 1) {
      history.push({
        pathname: '/createattendance',
        search: `id=${id}&watchLogType=${watchLogType}`
      })
    } else {
      history.push({
        pathname: '/attprocess',
        search: `id=${id}`
      })
    }
  }
  const deleteRow = ({ id }, index) => {
    alert('', '确定要删除吗？', [
      { text: '取消', onPress: () => { } },
      {
        text: '确定',
        onPress: async () => {
          const query = {
            id
          }
          await API.delRotaLogDraft(query)
          Toast.info('已删除', 1)
          setList((prev) => {
            return prev.filter((k, v) => v !== index)
          })
        }
      }
    ])
  }

  useEffect(() => {
    document.title = '值班日志'
    async function fetchTop () {
      const query = { month: dateTime.replace('/', '-') }
      const result = await API.getRotaLogCount(query)
      setTabData((prev) => {
        return prev.map((val, i) => {
          return {
            ...val,
            ...result[i]
          }
        })
      })
    }
    fetchTop()
  }, [dateTime, watchLogType, queryCurrent, downCount])

  useEffect(() => {
    async function upCallback (page) {
      const query = {
        queryMark: queryCurrent === 0 ? '0' : '1',
        watchLogType,
        month: dateTime.replace('/', '-'),
        page: page.num,
        pageSize: page.size
      }
      const result = await API.getRotaLogList(query)
      let curPageData = result.dataList
      let totalPage = result.pages
      mescroll.current.endByPage(curPageData.length, totalPage)
      // 触发更新气泡数量
      setDownCount(v => !v)
      setList((prev) => {
        if (page.num === 1) {
          return result.dataList
        } else {
          return [...prev, ...result.dataList]
        }
      })
    }
    mescroll.current = new MeScroll('mescroll', {
      up: {
        callback: upCallback,
        noMoreSize: 10,
        htmlNodata: '<p class="upwarp-nodata">-- 无更多 --</p>',
        toTop: {
          src: require('@/images/mescroll-totop.png'),
          offset: 650
        },
        empty: {
          warpId: 'nodata',
          icon: require('@/images/no_result.png'),
          tip: ''
        },
        clearId: 'nodata'
      }
    })
    return function () {
      mescroll.current.destroy()
    }
  }, [dateTime, watchLogType, queryCurrent])

  return (
    <div className='affaillist-view'>
      <ul className='affillist-tab'>
        {
          tabData.map(({ text, unRead, value }, index) => (
            <li className={current === index ? 'active' : ''} key={index} onClick={() => {
              if (current !== index) {
                setCurrent(index)
                setList([])
                setWatchLogType(value)
              }
            }}>
              <div className='tab-dv'>
                <i className={switchTabIcon(index)} />
                {
                  unRead > 0 && <b className='badge-dot'>{unRead}</b>
                }
              </div>
              <span>{text}</span>
            </li>
          ))
        }
      </ul>
      <div className='month-add'>
        <div className='month-switch'>日期切换：<span className='tab-button-blue-small' onClick={() => setDateVisible(true)}>{dateTime}</span></div>
        <div className='create-log'>
          {
            querySearch.map((item, index) => {
              return <span className={`tab-button-blue-small ${queryCurrent === index ? 'current' : ''}`} onClick={() => {
                setQueryCurrent(index)
                setList([])
              }} key={index}>{item}</span>
            })
          }
        </div>
        {/* <div className='create-log tab-button-blue-small' onClick={() => setDutyBool(true)}>
          <i className='add-create' />新建日志
        </div> */}
      </div>
      <div id='mescroll' className='mescroll' style={{ position: 'fixed', top: 170, bottom: 50, height: 'auto' }}>
        <div className='affail-table'>
          <table className='table'>
            <tbody>
              {
                list.map((item, index) => (
                  <tr onClick={() => seeDetails(item)} key={index}>
                    <td width='76'>
                      <div className='tb-name'>{item.watchLogTypeName}</div>
                      <div className='doctor-row'>
                        <span className={badgeSwitch(item)}>{item.handoverStatusName}</span>
                      </div>
                    </td>
                    <td className='text-center'>{item.handoverPerson}</td>
                    <td className='text-center'>
                      <div className='end-time color3'>{item.handoverTime}</div>
                    </td>
                    <td className='end-td' width='100' style={{ textAlign: item.handoverStatus === 1 ? 'right' : 'left' }}>
                      {
                        item.receiveTime && <div className='end-time color3 m-b-10'>{item.receiveTime}</div>
                      }
                      {
                        (item.handoverStatus !== 1) && <div className='name-text color3 end-time'>{item.successor}</div>
                      }
                      {
                        (item.handoverStatus === 1) && <span className='badge-delete' onClick={(e) => {
                          e.stopPropagation()
                          deleteRow(item, index)
                        }}>删除</span>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div id='nodata' />
      </div>
      <DateModal modalSelect={dateSelect} resetVisible={resetVisible} modalVisible={dateVisible} />
      <Modal
        title='请选择值班日志类型'
        visible={dutyModal}
        transparent
        closable
        onClose={() => setDutyBool(false)}
        footer={[{ text: '确定', onPress: () => logTypeConfirm() }]}
      >
        <ul className='switch-maxli-modal'>
          {
            tabData.map(({ text, value }, index) => (
              <li onClick={() => logTypeClick(value)} className={logType === index ? 'active' : ''} key={index}>
                <i className={switchTabIcon(index, 'modal')} />
                <span>{text}</span>
              </li>
            ))
          }
        </ul>
      </Modal>
    </div>
  )
}

DutyLog.propTypes = {
  history: PropTypes.object.isRequired
}

export default DutyLog
