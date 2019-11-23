import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Toast } from 'antd-mobile'
import MeScroll from 'mescroll.js'
import API from '@/api/api'
import { loadFromLocal } from '@/utils/index'
import DateModal from '@/components/datemodal/datemodal'
import 'mescroll.js/mescroll.min.css'
import './list.scss'

const alert = Modal.alert

function List ({ history }) {
  const [userInfo] = useState(loadFromLocal('h5', 'userInfo'))
  const [tabData, setTabData] = useState([])
  const [current, setCurrent] = useState(0)
  const [ifWatch, setIfWatch] = useState('0')
  const [list, setList] = useState([])
  const [templateArr, setTemplateArr] = useState([])
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
  const levelSwitch = (lavel) => {
    let obj = {}
    switch (lavel) {
      case '0':
        obj.text = '轻微'
        obj.className = 'color5'
        break
      case '1':
        obj.text = '一般'
        obj.className = 'color2'
        break
      case '2':
        obj.text = '严重'
        obj.className = 'color4'
        break
      case '3':
        obj.text = '重大'
        obj.className = 'color1'
        break
      default:
        break
    }
    return obj
  }
  const handleStatusSwitch = (value) => {
    let obj = {}
    switch (value) {
      case '0':
        obj.text = '待处理'
        obj.className = 'color1'
        break
      case '1':
        obj.text = '草稿'
        obj.className = 'color3'
        break
      case '2':
        obj.text = '进行中'
        obj.className = 'color4'
        break
      case '3':
        obj.text = '已处理'
        obj.className = 'color2'
        break
      case '4':
        obj.text = '不处理'
        obj.className = 'color3'
        break
      default:
        break
    }
    return obj
  }
  const eventWatch = async () => {
    if (userInfo) {
      const { name, userId } = userInfo
      const query = {
        operateType: 1,
        type: 1,
        watch: name,
        watchId: userId,
        templateId: ''
      }
      let rt = []
      for (let i = 0, len = templateArr.length; i < len; i++) {
        query.templateId = templateArr[i].templateId
        rt.push((await API.eventWatch(query)).flag)
      }
      if (rt.length && rt[0]) {
        alert('', '确定要开始值班吗？', [
          { text: '取消', onPress: () => { } },
          {
            text: '确定',
            onPress: async () => {
              const childrenQuery = {
                operateType: 2,
                type: 1,
                watch: name,
                watchId: userId,
                templateId: ''
              }
              let crt = []
              for (let i = 0, len = templateArr.length; i < len; i++) {
                childrenQuery.templateId = templateArr[i].templateId
                crt.push((await API.eventWatch(childrenQuery)).flag)
              }
              if (crt.length && crt[0]) {
                alert('', '您已经是值班人', [
                  { text: '确定', onPress: () => { } }
                ])
              }
            }
          }
        ])
      } else {
        alert('', '您已经是值班人', [
          { text: '确定', onPress: () => { } }
        ])
      }
    }
  }
  const deleteRow = (id, index) => {
    alert('', '确定要删除吗？', [
      { text: '取消', onPress: () => { } },
      {
        text: '确定',
        onPress: async () => {
          const query = {
            id
          }
          await API.eventDelete(query)
          Toast.info('已删除', 1)
          setList((prev) => {
            return prev.filter((k, v) => v !== index)
          })
        }
      }
    ])
  }
  const nextDetail = (id, type, handleStatus, eventType, level) => {
    // 事务处理
    if (type === '1') {
      if (handleStatus === '1') {
        history.push({
          pathname: '/eventsubmit',
          search: `id=${id}&level=${level}&genre=${eventType}`
        })
      } else {
        history.push({
          pathname: '/eventprocess',
          search: `id=${id}`
        })
      }
    }
    // 投诉建议
    if (type === '2') {
      if (handleStatus === '1') {
        history.push({
          pathname: '/complaintsubmit',
          search: `id=${id}`
        })
      } else {
        history.push({
          pathname: '/complaintprocess',
          search: `id=${id}`
        })
      }
    }
  }

  useEffect(() => {
    document.title = '事务处理'
    const fetchNav = async () => {
      const listNav = await API.eventCount({
        dateMonth: dateTime.replace('/', '-')
      })
      for (let val in listNav) {
        switch (val) {
          case '事件处理':
            setTabData((prev) => {
              return prev.map((v, k) => {
                if (v.templateType === 1) {
                  return {
                    ...v,
                    unread: listNav[val]
                  }
                }
                return v
              })
            })
            break
          case '投诉建议':
            setTabData((prev) => {
              return prev.map((v, k) => {
                if (v.templateType === 2) {
                  return {
                    ...v,
                    unread: listNav[val]
                  }
                }
                return v
              })
            })
            break
          default:
            break
        }
      }
    }
    fetchNav()
  }, [dateTime, current, downCount])

  useEffect(() => {
    const isWch = async () => {
      let add = []
      let tabList = []
      if (userInfo) {
        const { modules } = userInfo
        if (modules) {
          for (let i = 0, ilen = modules.length; i < ilen; i++) {
            const { templateList } = modules[i]
            // 事务处理模块
            if (modules[i].type === 1) {
              for (let k = 0, klen = templateList.length; k < klen; k++) {
                const { id, templateType, templateName } = templateList[k]
                // 1事务处理
                if (templateType === 1) {
                  add.push({
                    templateId: id,
                    text: templateName,
                    templateType
                  })
                }
                // 投诉建议
                if (templateType === 2) {
                  add.push({
                    templateId: id,
                    text: templateName,
                    templateType
                  })
                }
              }
              break
            }
          }
        }
      }
      if (add.length) {
        for (let i = 0, len = add.length; i < len; i++) {
          if (add[i].templateType === 1) {
            tabList.push({
              templateType: 1,
              icon: 'shiwu',
              text: '事务处理',
              unread: 0
            })
          }
          if (add[i].templateType === 2) {
            tabList.push({
              templateType: 2,
              icon: 'tousu',
              text: '投诉建议',
              unread: 0
            })
          }
        }
        setTabData(tabList)
        setTemplateArr(add)
        const ifWatch = await API.ifWatch({
          type: tabList[current].templateType,
          templateId: add[current].templateId
        })
        if (ifWatch.ifWatch) {
          setIfWatch(ifWatch.ifWatch)
        }
      } else {
        setTabData([])
      }
    }
    isWch()
  }, [current, userInfo])

  useEffect(() => {
    async function upCallback (page) {
      const query = {
        type: templateArr[current].templateType,
        page: page.num,
        pageSize: page.size,
        dateMonth: dateTime.replace('/', '-')
      }
      const result = await API.eventList(query)
      let curPageData = result.list
      let totalPage = result.pages
      mescroll.current.endByPage(curPageData.length, totalPage)
      // 触发更新气泡数量
      setDownCount(v => !v)
      setList((prev) => {
        if (page.num === 1) {
          return result.list
        } else {
          return [...prev, ...result.list]
        }
      })
    }
    if (!templateArr.length) {
      return
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
  }, [current, dateTime, templateArr])

  return (
    <div className='affaillist-view foot-ondutybtn'>
      {
        tabData.length ? (
          <ul className='affillist-tab'>
            {
              tabData.map(({ icon, text, unread }, index) => (
                <li className={current === index ? 'active' : ''} key={index} onClick={() => {
                  if (current !== index) {
                    setList([])
                    setCurrent(index)
                  }
                }}>
                  <div className='tab-dv'>
                    <i className={`${icon}-icon`} />
                    {
                      unread > 0 && <b className='badge-dot'>{unread}</b>
                    }
                  </div>
                  <span>{text}</span>
                </li>
              ))
            }
          </ul>
        ) : null
      }
      <div className='month-add'>
        <div className='month-switch'>日期切换：<span className='tab-button-blue-small' onClick={() => setDateVisible(true)}>{dateTime}</span></div>
      </div>
      <div id='mescroll' className='mescroll' style={{ position: 'fixed', top: 170, bottom: ifWatch !== '0' ? 88 : 50, height: 'auto' }}>
        <div className='affail-table'>
          <table className='table'>
            <tbody>
              {
                list.map(({ id, eventTypeName, deptName, reporter, level, handleStatus, createTime, updateTime, type, eventType }, index) => {
                  return (
                    <tr key={index} onClick={() => nextDetail(id, type, handleStatus, eventType, level)}>
                      <td width='100'>
                        <div className='tb-name'>{eventTypeName}</div>
                        <div className='doctor-row color3'>
                          { deptName && <span className='dep'>{deptName}</span> }
                          <span className='name'>{reporter}</span>
                        </div>
                      </td>
                      <td className={`text-center ${handleStatusSwitch(handleStatus).className}`}>{handleStatusSwitch(handleStatus).text}</td>
                      <td className='text-center'><span className={`font-14 ${levelSwitch(level).className}`}>{levelSwitch(level).text}</span></td>
                      <td className='color3' width='90' align='right'>
                        {
                          handleStatus === '1' ? (
                            <span className='badge-delete' onClick={(e) => {
                              e.stopPropagation()
                              deleteRow(id, index)
                            }}>删除</span>
                          ) : (
                            <>
                              <div className='time'>{moment(createTime).format('MM/DD HH:mm')}</div>
                              {
                                updateTime ? <div className='end-time'>{moment(updateTime).format('MM/DD HH:mm')}</div> : null
                              }
                            </>
                          )
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div id='nodata' />
      </div>
      {
        ifWatch !== '0' && <button className='button-article button-article-block' type='button' onClick={() => eventWatch()}>我是值班人</button>
      }
      <DateModal modalSelect={dateSelect} resetVisible={resetVisible} modalVisible={dateVisible} />
    </div>
  )
}

List.propTypes = {
  history: PropTypes.object
}

export default List
