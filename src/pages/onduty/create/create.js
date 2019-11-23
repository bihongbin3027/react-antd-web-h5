import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, DatePicker, Toast } from 'antd-mobile'
import { parse } from 'query-string'
import API from '@/api/api'
import { loadFromLocal } from '@/utils/index'
import StaffModal from '@/components/staffmodal/staffmodal'
import ImageUpload from '@/components/imageupload/imageupload'
import '@/pages/ceateevent/submit.scss'
import '@/pages/onduty/onduty.scss'

const alert = Modal.alert
const permissionInt = function (eventValue) {
  const { modules } = loadFromLocal('h5', 'userInfo')
  try {
    if (modules) {
      // 存储用户信息
      for (let i = 0, ilen = modules.length; i < ilen; i++) {
        const { templateList, type } = modules[i]
        // 总值值班模块
        if (type === 2) {
          if (templateList.length) {
            for (let k = 0, klen = templateList.length; k < klen; k++) {
              const { templateType, permissionList } = templateList[k]
              // 行政事务和投诉建议
              if (parseInt(templateType) === parseInt(eventValue)) {
                let permissionObj = {}
                for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                  if (permissionList[w].name === '获取今日列表') {
                    permissionObj.list = true
                  }
                  if (permissionList[w].name === '添加附件') {
                    permissionObj.file = true
                  }
                }
                return permissionObj
              }
            }
          }
          break
        }
      }
    } else {
      return {}
    }
  } catch (error) {
    return {}
  }
}

function EventSubmit ({ history, location }) {
  const [{ templateId, watchLogType, id }, setUrlNormal] = useState(parse(location.search))
  const [moduleId, setModuleId] = useState(templateId)
  const minDate = moment.utc(moment().subtract(7, 'day').format()).toDate()
  const maxDate = moment.utc(moment().format()).toDate()
  const [time] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [dateModal, setDateModal] = useState(maxDate)
  const [staffModalType, setStaffModalType] = useState(1)
  const [handover] = useState(() => {
    const { modules } = loadFromLocal('h5', 'userInfo')
    const tempFormat = (arr) => arr.map((temp, index) => ({ userId: index, name: temp.name }))
    let hrtype = {
      // 交接方式 1正常交接 2单机交接
      type: 1,
      // 值班人
      shiftUserList: [],
      // 接班人
      successorList: []
    }
    try {
      if (modules) {
        for (let i = 0, ilen = modules.length; i < ilen; i++) {
          const { templateList, type } = modules[i]
          if (type === 2) {
            if (templateList.length) {
              for (let k = 0, klen = templateList.length; k < klen; k++) {
                // 行政日志
                if (templateList[k].templateType === 3) {
                  hrtype.type = templateList[k].handoverType
                  hrtype.shiftUserList = tempFormat(templateList[k].shiftUserList)
                  hrtype.successorList = tempFormat(templateList[k].successorList)
                  break
                }
              }
              break
            }
            break
          }
        }
      }
      return hrtype
    } catch (error) {
      return hrtype
    }
  })
  const [eventValue, setEventValue] = useState(() => {
    if (watchLogType === '3') {
      return {
        text: '行政日志', value: 3
      }
    }
    if (watchLogType === '4') {
      return {
        text: '投诉日志', value: 4
      }
    }
  })
  const [permission, setPermission] = useState(() => {
    return permissionInt(eventValue.value)
  })
  // 值班人
  const [zbr, setZbr] = useState(() => {
    const userinfo = loadFromLocal('h5', 'userInfo')
    // 正常交接
    if (handover.type === 1) {
      if (userinfo) {
        return [{ userId: userinfo.userId, name: userinfo.name }]
      } else {
        return []
      }
    }
    // 单机交接
    if (handover.type === 2) {
      return []
    }
  })
  // 接班人
  const [dutyPerson, setdutyPerson] = useState([])
  const [dutyNormal, setDutyNormal] = useState([])
  const [dutyModal, setDutyModal] = useState(false)
  const [logType, setLogType] = useState(() => {
    if (watchLogType === '3') {
      return 0
    }
    if (watchLogType === '4') {
      return 1
    }
  })
  const [worklistVisible, setWorklistVisible] = useState(false)
  const [workListData, setWorkListData] = useState([])
  const [previewList, setPreviewList] = useState([])
  const [staffVisible, setStaffVisible] = useState(false)
  // 接班人、值班人
  const [staffList, setStaffList] = useState({
    // 单选
    type: '1',
    list: []
  })
  // true从组织人员结构那里读数据，反之
  const [staffBool, setStaffBool] = useState(true)
  const [textareaLog, setTextareaLog] = useState('')
  const [textareaIndex, setTextareaLogIndex] = useState(0)
  const [serverId, setServerId] = useState([])
  const [fileNormal, setFileNormal] = useState([])
  const [logTypeModal] = useState(() => {
    const { modules } = loadFromLocal('h5', 'userInfo')
    let newArr = []
    try {
      if (modules) {
        for (let i = 0, ilen = modules.length; i < ilen; i++) {
          const { templateList, type } = modules[i]
          if (type === 2) {
            if (templateList.length) {
              for (let k = 0, klen = templateList.length; k < klen; k++) {
                const { templateType, permissionList } = templateList[k]
                for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                  if (permissionList[w].name === '新建日志') {
                    if (templateType === 3) {
                      newArr.push({
                        icon: 'shiwu-modal-icon',
                        text: '行政日志',
                        value: 3
                      })
                    }
                    if (templateType === 4) {
                      newArr.push({
                        icon: 'tousu-modal-icon',
                        text: '投诉日志',
                        value: 4
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }
      return newArr
    } catch (error) {
      return newArr
    }
  })
  const selectLog = (date) => {
    setDateModal(date)
    setWorklistVisible(true)
  }
  const setDutyBool = (bool) => {
    setDutyModal(bool)
  }
  // 切换值班类型
  const logTypeClick = (item, index) => {
    setEventValue(item)
    setLogType(index)
    setDutyBool(false)
    setdutyPerson([])
    setPermission(() => {
      return permissionInt(item.value)
    })
    setUrlNormal((v) => {
      let tempId = ''
      const { modules } = loadFromLocal('h5', 'userInfo')
      if (modules) {
        for (let i = 0, ilen = modules.length; i < ilen; i++) {
          const { templateList, type } = modules[i]
          if (type === 2) {
            if (templateList.length) {
              tempId = templateList[index].id
            }
          }
        }
      }
      return {
        ...v,
        templateId: tempId
      }
    })
  }
  const workListClick = (index) => {
    setWorkListData(prev => {
      const newPerview = []
      const newArr = prev.map((item, i) => {
        if (index === i) {
          item.isChecked = !item.isChecked
        }
        if (item.isChecked) {
          newPerview.push(item)
        }
        return item
      })
      setPreviewList(newPerview)
      return newArr
    })
  }
  const staffSelect = (select) => {
    setDutyNormal(select)
  }
  const staffConfirm = () => {
    // 正常交班
    if (handover.type === 1) {
      setdutyPerson(dutyNormal)
    }
    // 单机交班
    if (handover.type === 2) {
      if (staffModalType === 1) {
        setZbr(dutyNormal)
      }
      if (staffModalType === 2) {
        setdutyPerson(dutyNormal)
      }
    }
    setStaffVisible(false)
  }
  let paramsArr = () => {
    return {
      id,
      templateId: moduleId,
      // 交接方式
      handoverType: handover.type,
      // 附件
      serverIds: serverId.join(','),
      // 值班日志内容
      watchLog: textareaLog,
      // 值班日志类型 3：行政处理 4：投诉建议
      watchLogType: eventValue.value
    }
  }
  const fileList = (serverId) => {
    setServerId(serverId)
  }
  const openStaff = (type) => {
    if (staffBool && !staffList.list.length) {
      Toast.loading('请稍后...', 0)
      API.getTreeDeptAndUserList({
        username: ''
      }).then((res) => {
        Toast.hide()
        setStaffList((prev) => {
          return {
            ...prev,
            ...{
              type: '1',
              list: res
            }
          }
        })
        setStaffVisible(true)
      })
    } else {
      // 值班人
      if (type === 1) {
        setStaffModalType(1)
        setStaffList({
          type: '2',
          list: handover.shiftUserList
        })
      }
      // 接班人
      if (type === 2) {
        setStaffModalType(2)
        setStaffList({
          type: '2',
          list: handover.successorList
        })
      }
      setStaffVisible(true)
    }
  }
  const cancel = () => {
    if (!textareaLog) {
      history.go(-1)
      return
    }
    alert('', '是否存为草稿？', [
      { text: '取消', onPress: () => { history.go(-1) } },
      {
        text: '确认',
        onPress: () => {
          let params = paramsArr()
          if (!textareaLog) {
            Toast.info('请输入值班日志', 1)
            return false
          }
          if (serverId.length > 9) {
            Toast.info('最多上传9张图片', 1)
            return
          }
          if (!dutyPerson.length) {
            Toast.info('请选择接班人', 1)
            return
          }
          if (handover.type === 2) {
            if (!zbr.length) {
              Toast.info('请选择值班人', 1)
              return
            }
          }
          // 值班日志状态 0:待接班 1:草稿 2:已接班
          params.handoverStatus = 1
          // 正常交接
          if (handover.type === 1) {
            if (dutyPerson.length && dutyPerson[0].userId) {
              // 接班人
              params.successorId = dutyPerson.map((item) => item.userId).join(',')
            }
          }
          // 单机交接
          if (handover.type === 2) {
            params.handoverPersonId = loadFromLocal('h5', 'userInfo').userId
            // 值班人
            params.watchName = zbr.map((item) => item.name).join(',')
            // 接班人
            params.receiveName = dutyPerson.map((item) => item.name).join(',')
          }
          Toast.loading('请稍后...', 0)
          API.addRotaLog(params).then(() => {
            Toast.info('已保存', 1)
            setTimeout(() => {
              history.go(-1)
            }, 1000)
          })
        }
      }
    ])
  }
  const nexts = () => {
    let params = paramsArr()
    if (!zbr.length) {
      Toast.info('请选择值班人', 1)
      return
    }
    if (!dutyPerson.length) {
      Toast.info('请选择接班人', 1)
      return
    }
    if (!textareaLog) {
      Toast.info('请输入值班日志', 1)
      return
    }
    if (serverId.length > 9) {
      Toast.info('最多上传9张图片', 1)
      return
    }
    // 正常交接
    if (handover.type === 1) {
      // 值班人
      params.handoverPersonId = zbr.map((item) => item.userId).join(',')
      // 接班人
      params.successorId = dutyPerson.map((item) => item.userId).join(',')
    }
    // 单机交接
    if (handover.type === 2) {
      params.handoverPersonId = loadFromLocal('h5', 'userInfo').userId
      // 值班人
      params.watchName = zbr.map((item) => item.name).join(',')
      // 接班人
      params.receiveName = dutyPerson.map((item) => item.name).join(',')
    }
    // 值班日志状态 0:待接班 1:草稿 2:已接班
    params.handoverStatus = 0
    Toast.loading('请稍后...', 0)
    API.addRotaLog(params).then(() => {
      Toast.hide()
      alert('', '已提交', [
        { text: '确定', onPress: () => history.push('/onduty/dutylog') }
      ])
    })
  }
  const modalCancel = () => {
    setWorklistVisible(false)
  }
  const modalConfirm = () => {
    if (!previewList.length) {
      Toast.info('请选择', 1)
      return
    }
    setTextareaLog((prev) => {
      let str = ''
      previewList.forEach((item, index) => {
        const ix = textareaIndex + index + 1
        if (eventValue.value === 3) {
          str += `${ix}、`
          str += `${lavel(item.level)}  `
          str += `${item.eventTypeName}  `
          str += `${item.deptName}  `
          str += `${item.reporter}\n`
          str += `${item.content}\n`
          str += `处理意见/结果：${item.handleContent || '无'}`
        }
        if (eventValue.value === 4) {
          str += `${ix}、`
          str += `${item.eventTypeName}  `
          str += `投诉人：${item.complaint}  `
          str += `${item.complaintMobile}\n`
          str += `${item.complaintReasons}\n`
          str += `处理意见/结果：${item.handleContent || '无'}`
        }
        str += '\n'
      })
      setTextareaLogIndex((c) => c + previewList.length)
      return prev + str
    })
    setWorkListData(workListData.map((item) => {
      return {
        ...item,
        isChecked: false
      }
    }))
    setPreviewList([])
    setWorklistVisible(false)
  }
  const lavel = (lavel) => {
    switch (lavel) {
      case '0':
        return '轻微'
      case '1':
        return '一般'
      case '2':
        return '严重'
      case '3':
        return '重大'
      default:
        break
    }
  }

  useEffect(() => {
    document.title = '值班日志'
    // 重置接班人
    setStaffList({
      type: '1',
      list: []
    })
    const fetchDuty = async (tempId) => {
      // 正常交接
      if (handover.type === 1) {
        const person = await API.eventPerson({ templateId: tempId || templateId })
        let bool = true
        for (let i in person) {
          if (i === '4') {
            if (person[i] && person[i].length) {
              // 接班人
              setStaffList({
                type: '2',
                list: person[i]
              })
              bool = false
            }
            break
          }
        }
        setStaffBool(bool)
      } else {
        // 单机交接
        setStaffBool(false)
      }
    }
    const fetchDetail = async () => {
      const detail = await API.getRotaLogDetail({ id })
      const userFormat = (str) => {
        return str.split(',').map((wh, inx) => {
          return {
            userId: inx,
            name: wh
          }
        })
      }
      if (detail.extraResource) {
        setFileNormal(detail.extraResource.map((iu, io) => {
          const extraResourceUrl = detail.extraResourceUrl.split(',')
          return {
            img: iu,
            url: extraResourceUrl[io]
          }
        }))
      }
      // 正常交接
      if (handover.type === 1) {
        if (detail.successorId) {
          setdutyPerson([{ name: detail.successor, userId: detail.successorId }])
        }
      }
      // 单机交接
      if (handover.type === 2) {
        if (detail.watchName) {
          // 值班人
          setZbr(userFormat(detail.watchName))
        }
        if (detail.receiveName) {
          // 接班人
          setdutyPerson(userFormat(detail.receiveName))
        }
      }
      setModuleId(detail.templateId)
      setTextareaLog(detail.watchLog)
      fetchDuty(detail.templateId)
    }
    if (id) {
      // 获取值班日志详情
      fetchDetail()
    } else {
      fetchDuty()
    }
  }, [handover.successorList, handover.type, id, templateId])

  useEffect(() => {
    const fetchLog = async () => {
      const query = {
        type: eventValue.value - 2,
        date: moment(dateModal).format('YYYY-MM-DD'),
        page: 1,
        pageSize: 100
      }
      Toast.loading('请稍后...', 0)
      const result = await API.eventList(query)
      Toast.hide()
      setWorkListData(result.list.map((item) => {
        return {
          ...item,
          isChecked: false
        }
      }))
      setPreviewList([])
    }
    fetchLog()
  }, [dateModal, watchLogType, eventValue])

  console.log('dutyPerson', dutyPerson)

  return (
    <div className='scroll-view footer-reserved event-submie-view onduty-style'>
      <div className='event-time'>
        <span><i className='date-icon' />{time}</span>
      </div>
      <div className='event-info'>
        <div className='event-info-li'>
          <div className='label-left'>类型：</div>
          <div className='event-flex-center'>
            <span className='tab-button-blue-small'>{eventValue.text}</span>
            {
              (logTypeModal.length > 1 && !id && handover.type === 1) ? <em className='level-edit-icon eidt-icon' onClick={() => setDutyBool(true)} /> : null
            }
          </div>
        </div>
        <div className='event-info-li'>
          <div className='label-left'>值班人：</div>
          <div className='cont-right btn-rows-flex'>
            <div className='btn-rows'>
              {
                zbr.map(({ name }, index) => (
                  <span className='tab-button-blue-small pd-right' key={index}>
                    {name}
                    <s className='add-radius-rotate' onClick={() => {
                      setZbr(prev => {
                        return prev.filter((v, i) => i !== index)
                      })
                    }} />
                  </span>
                ))
              }
            </div>
            <i className='add-radius' onClick={() => openStaff(1)} />
          </div>
        </div>
        <div className='event-info-li'>
          <div className='label-left'>接班人：</div>
          <div className='cont-right btn-rows-flex'>
            <div className='btn-rows'>
              {
                dutyPerson.map(({ name }, index) => (
                  <span className='tab-button-blue-small pd-right' key={index}>
                    {name}
                    <s className='add-radius-rotate' onClick={() => {
                      setdutyPerson(prev => {
                        return prev.filter((v, i) => i !== index)
                      })
                    }} />
                  </span>
                ))
              }
            </div>
            <i className='add-radius' onClick={() => openStaff(2)} />
          </div>
        </div>
      </div>
      <div className='title-list'>
        <div className='left-tx'>值班日志</div>
        {
          permission.list ? (
            <DatePicker
              mode='date'
              title='请选择时间'
              extra='Optional'
              minDate={minDate}
              maxDate={maxDate}
              value={dateModal}
              onChange={date => {
                selectLog(date)
              }}
            >
              <div className='tab-button-blue-small'><i className='add-create' />获取列表</div>
            </DatePicker>
          ) : null
        }
      </div>
      <dl className='textarea-dl'>
        <dd>
          <textarea
            rows='8'
            placeholder='请输入内容'
            value={textareaLog}
            onChange={(e) => setTextareaLog(e.target.value)}
          />
        </dd>
      </dl>
      { permission.file && <ImageUpload imglist={fileList} normal={fileNormal} /> }
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue normal straight' onClick={() => cancel()}>取消</button>
          </div>
          <div>
            <button type='button' className='tab-button-blue current straight' onClick={() => nexts()}>提交</button>
          </div>
        </div>
      </div>
      <Modal
        title='请选择值班类型'
        visible={dutyModal}
        transparent
        closable
        onClose={() => setDutyBool(false)}
      >
        <ul className='switch-maxli-modal'>
          {
            logTypeModal.map((item, index) => (
              <li onClick={() => logTypeClick(item, index)} className={logType === index ? 'active' : ''} key={index}>
                <i className={item.icon} />
                <span>{item.text}</span>
              </li>
            ))
          }
        </ul>
      </Modal>
      <Modal visible={worklistVisible}>
        <div className='scroll-view footer-reserved worklist-view'>
          <div className='work-time'>
            <span>工作列表：</span>
            <span className='tab-button-blue-small'>{moment(dateModal).format('YYYY/MM/DD')}</span>
            <DatePicker
              mode='date'
              title='请选择时间'
              extra='Optional'
              minDate={minDate}
              maxDate={maxDate}
              value={dateModal}
              onChange={date => {
                setDateModal(date)
              }}
            >
              <i className='level-edit-icon eidt-icon' />
            </DatePicker>
          </div>
          {
            workListData.length ? (
              <>
                <div className='br' />
                <div className='log-lt-wrap'>
                  <ul className='log-list'>
                    {
                      workListData.map((item, index) => (
                        <li onClick={() => workListClick(index)} key={index}>
                          <div className='xm-check'>
                            {
                              eventValue.value === 3 ? (
                                <div className='flex-space-between'>
                                  <div>
                                    {index + 1}、
                                    <span>{lavel(item.level)}</span>
                                    <span className='xm'>{item.eventTypeName}</span>
                                  </div>
                                  <div>
                                    <span>{item.deptName}</span>
                                    <span className='xm'>{item.reporter}</span>
                                  </div>
                                </div>
                              ) : null
                            }
                            {
                              eventValue.value === 4 ? (
                                <div>
                                  {index + 1}、
                                  {item.eventTypeName}
                                  <span className='xm'>投诉人：{item.complaint}</span>
                                  <span className='xm'>{item.complaintMobile}</span>
                                </div>
                              ) : null
                            }
                            <input checked={item.isChecked} onChange={e => {}} type='checkbox' />
                          </div>
                          {
                            eventValue.value === 3 && <div>{item.content}</div>
                          }
                          {
                            eventValue.value === 4 && <div>{item.complaintReasons}</div>
                          }
                          <p>处理意见/结果：{item.handleContent || '无'}</p>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </>
            ) : <div className='no-result'>暂无数据</div>
          }
          <div className='br' />
          {
            previewList.length ? (
              <div className='pre-list lib-10' style={{ paddingBottom: 15 }}>
                <div className='h6'>预览：</div>
                <ul>
                  {
                    previewList.map((item, index) => (
                      <li key={index}>
                        {
                          eventValue.value === 3 ? (
                            <div>
                              <div>
                                {index + 1}、
                                {lavel(item.level)}
                                <span className='xm'>{item.eventTypeName}</span>
                                <span className='xm'>{item.deptName}</span>
                                <span className='xm'>{item.reporter}</span>
                              </div>
                              <p>{item.content}</p>
                              <p>处理意见/结果：{item.handleContent || '无'}</p>
                            </div>
                          ) : null
                        }
                        {
                          eventValue.value === 4 ? (
                            <div>
                              <div>
                                {item.eventTypeName}
                                <span className='xm'>投诉人：{item.complaint}</span>
                                <span className='xm'>{item.complaintMobile}</span>
                              </div>
                              <p>{item.complaintReasons}</p>
                              <p>处理意见/结果：{item.handleContent || '无'}</p>
                            </div>
                          ) : null
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
            ) : null
          }
        </div>
        <div className='layout-footer'>
          <div className='event-foot'>
            <div>
              <button type='button' className='tab-button-blue normal straight' onClick={() => modalCancel()}>返回</button>
            </div>
            <div>
              <button type='button' className='tab-button-blue current straight' onClick={() => modalConfirm()}>确定</button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title='请选择人员'
        visible={staffVisible}
        closable
        transparent
        onClose={() => setStaffVisible(false)}
        footer={[{ text: '确定', onPress: () => { staffConfirm() } }]}
      >
        <StaffModal
          select={staffSelect}
          list={staffList.list}
          type={staffList.type}
          mode={handover.type === 1 ? 'radio' : 'check'}
        />
      </Modal>
    </div>
  )
}

EventSubmit.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default EventSubmit
