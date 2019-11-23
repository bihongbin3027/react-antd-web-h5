import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { parse } from 'query-string'
import { Modal, Toast } from 'antd-mobile'
import _ from 'lodash'
import { loadFromLocal, equalsObj } from '@/utils/index'
import StaffModal from '@/components/staffmodal/staffmodal'
import API from '@/api/api'

const alert = Modal.alert

function Process ({ history, location }) {
  let { id } = parse(location.search)
  const [time, setTime] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [userInfo] = useState(() => {
    let userInfo = loadFromLocal('h5', 'userInfo')
    if (!userInfo) {
      return {}
    } else {
      return userInfo
    }
  })
  const [loading, setLoading] = useState(false)
  const [levelArray] = useState([
    {
      text: '轻微',
      value: 0
    },
    {
      text: '一般',
      value: 1
    },
    {
      text: '严重',
      value: 2
    },
    {
      text: '重大',
      value: 3
    }
  ])
  const [permissionList, setPermissionList] = useState({
    handleContent: false,
    handover: false,
    secLeader: false
  })
  const [moduleId, setModuleId] = useState('')
  const [processArray, setProcessArray] = useState([])
  const [levelValue, setLevelValue] = useState(levelArray[0])
  const [eventValue, setEventValue] = useState({})
  const [processValue, setProcessValue] = useState({})
  const [eventType, setEventType] = useState([])
  const [levelModal, setLevelModal] = useState(false)
  const [eventModal, setEventModal] = useState(false)
  const [processModal, setProcessModal] = useState(false)
  const [hbr, setHbr] = useState({})
  const [supervisor, setSupervisor] = useState([])
  const [content, setContent] = useState()
  const [fileImg, setFileImg] = useState([])
  const [handleContent, setHandleContent] = useState('')
  const [handleStatus, setHandleStatus] = useState(0)
  const [saveProcess, setProcess] = useState({})
  const [deptName, setDeptName] = useState(null)
  const [role, setRole] = useState(null)
  const [dutyPerson, setdutyPerson] = useState([])
  const [leadership, setLeadership] = useState([])
  const [staffVisible, setStaffVisible] = useState(false)
  const [dutyNormal, setDutyNormal] = useState([])
  const [staffList, setStaffList] = useState([])
  const [leadershipList, setLeadershipList] = useState([])
  const [leaderVisible, setLeaderVisible] = useState(false)
  const [leaderNormal, setLeaderNormal] = useState([])
  const [leaderType, setLeaderType] = useState('2')
  const [handoverHandles, setHandoverHandles] = useState([])
  const [part, setPart] = useState({
    bool: false,
    list: []
  })
  const levelClassName = (index, small = '') => {
    let obj = {}
    switch (index) {
      case 0:
        obj.btnIcon = `qw-icon`
        obj.btnStyle = `tab-button-green${small}`
        break
      case 1:
        obj.btnIcon = `yb-icon`
        obj.btnStyle = `tab-button-blue${small}`
        break
      case 2:
        obj.btnIcon = `yz-icon`
        obj.btnStyle = `tab-button-orange${small}`
        break
      case 3:
        obj.btnIcon = `zd-icon`
        obj.btnStyle = `tab-button-red${small}`
        break
      default:
        obj.btnIcon = ''
        obj.btnStyle = ''
    }
    return obj
  }
  const userIng = () => {
    let userName = ''
    switch (role) {
      case '0':
        userName = '值班人'
        break
      case '1':
        userName = '监督人'
        break
      case '2':
        userName = '汇报人'
        break
      case '3':
        userName = '移交人'
        break
      case '4':
        userName = '二线领导'
        break
      default:
        break
    }
    if (userName) {
      return (
        <div className='event-info-li'>
          <div className='label-left' style={{ flex: role === '4' ? '0 0 84px' : '0 0 68px' }}>{userName}：</div>
          <div className='cont-right'>
            <span className='tab-button-darkgray-small pd-right'>{userInfo.name}</span>
          </div>
        </div>
      )
    }
  }
  const openstaff = () => {
    if (staffList.length) {
      setStaffVisible(true)
    } else {
      Toast.loading('请稍后...', 0)
      API.getTreeDeptAndUserList({
        userName: ''
      }).then((res) => {
        Toast.hide()
        setStaffList(res)
        setStaffVisible(true)
      })
    }
  }
  const openleader = () => {
    if (leaderType === '1' && !leadershipList.length) {
      Toast.loading('请稍后...', 0)
      API.getTreeDeptAndUserList({
        userName: ''
      }).then((res) => {
        Toast.hide()
        setLeadershipList(res)
        setLeaderVisible(true)
      })
    } else {
      setLeaderVisible(true)
    }
  }
  const staffSelect = (select) => {
    setDutyNormal(select)
  }
  const staffConfirm = () => {
    setdutyPerson(_.uniqBy([...dutyPerson, ...dutyNormal], 'userId'))
    setStaffVisible(false)
  }
  const leaderSelect = (select) => {
    setLeaderNormal(select)
  }
  const leaderConfirm = () => {
    setLeadership(_.uniqBy([...leadership, ...leaderNormal], 'userId'))
    setLeaderVisible(false)
  }
  const processClassName = (index) => {
    let obj = {}
    switch (index) {
      case 0:
        obj.btnIcon = 'unprocessed-icon'
        obj.btnStyle = 'tab-button-red-small'
        break
      case 2:
        obj.btnIcon = 'processing-icon'
        obj.btnStyle = 'tab-button-orange-small'
        break
      case 3:
        obj.btnIcon = 'processed-icon'
        obj.btnStyle = 'tab-button-darkgray-small'
        break
      default:
        obj.btnIcon = ''
    }
    return obj
  }
  const levelVisible = (bool) => setLevelModal(bool)
  const eventVisible = (bool) => setEventModal(bool)
  const processVisible = (bool) => setProcessModal(bool)
  const levelModalSelect = (item) => {
    setLevelValue(item)
    levelVisible(false)
  }
  const eventModalSelect = (item) => {
    setEventValue(item)
    eventVisible(false)
  }
  const processModalSelect = (item) => {
    setProcess(item)
  }
  const savePss = () => {
    let params = paramsArr()
    if (!Object.keys(saveProcess).length) {
      Toast.info('请选择处理进度', 1)
      return
    }
    setProcessModal(false)
    setProcessValue(saveProcess)
    params.handleStatus = saveProcess.value
    Toast.loading('请稍后...', 0)
    API.eventEdit(params).then(() => {
      processVisible(false)
      Toast.info('已保存', 1)
      setTimeout(() => {
        history.push('/affair/list')
      }, 1000)
    })
  }
  const paramsArr = () => {
    let params = {
      id,
      templateId: moduleId,
      handleStatus: processValue.value,
      // 类型
      eventType: eventValue.id,
      // 类型名称
      eventTypeName: eventValue.name,
      // 等级
      level: levelValue.value,
      // 处理意见
      handleContent: handleContent,
      // 处理结果
      handleResult: '',
      // 移交人
      handover: dutyPerson.map((k) => k.name).join('|'),
      // 移交人id
      handoverId: dutyPerson.map((k) => k.userId).join('|'),
      // 值班人
      watch: '',
      // 值班人id
      watchId: '',
      // 二线领导人
      secLeader: leadership.map((k) => k.name).join('|'),
      // 二线领导人id
      secLeaderId: leadership.map((k) => k.userId).join('|'),
      // 监督人
      supervisor: '',
      // 监督人id
      supervisorId: ''
    }
    // 值班人
    if (role === '0') {
      params.watch = userInfo.name
      params.watchId = userInfo.userId
    }
    // 监督人
    if (role === '1') {
      params.supervisor = userInfo.name
      params.supervisorId = userInfo.userId
    }
    // 汇报人
    if (role === '2') {
      params.reporter = userInfo.name
      params.reporterId = userInfo.userId
    }
    // 移交人
    if (role === '3') {
      params.handover = userInfo.name
      params.handoverId = userInfo.userId
    }
    // 二线领导人
    if (role === '4') {
      params.secLeader = userInfo.name
      params.secLeaderId = userInfo.userId
    }
    // 如果是草稿就保存为待处理
    if (handleStatus === '1') {
      params.handleStatus = 0
    }
    return params
  }
  const next = () => {
    if (!handleContent && permissionList.handleContent) {
      Toast.info('请输入处理意见', 1)
      return
    }
    // 只有值班人和不是草稿的状态才能处理进度
    if (role === '0' && handleStatus !== '1') {
      setProcessModal(true)
    } else {
      Toast.loading('请稍后...', 0)
      API.eventEdit(paramsArr()).then(() => {
        Toast.hide()
        alert('', '已提交', [
          { text: '确定', onPress: () => history.push('/affair/list') }
        ])
      })
    }
  }

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      let { modules } = userInfo
      if (modules) {
        for (let i = 0, ilen = modules.length; i < ilen; i++) {
          const { templateList } = modules[i]
          // 事务处理模块
          if (modules[i].type === 1) {
            if (templateList.length) {
              for (let k = 0, klen = templateList.length; k < klen; k++) {
                const { templateType, permissionList } = templateList[k]
                // 事务处理
                if (templateType === 1) {
                  let permissionObj = {
                    handleContent: false,
                    handover: false,
                    secLeader: false
                  }
                  for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                    if (permissionList[w].name === '意见处理') {
                      permissionObj.handleContent = true
                    }
                    if (permissionList[w].name === '添加移交人') {
                      permissionObj.handover = true
                    }
                    if (permissionList[w].name === '添加二线领导') {
                      permissionObj.secLeader = true
                    }
                  }
                  setPermissionList(permissionObj)
                  break
                }
              }
            }
            break
          }
        }
      }
    }
  }, [userInfo])

  useEffect(() => {
    document.title = '事件处理'
    const fetchInfo = async () => {
      Toast.loading('请稍后...', 0)
      const detail = await API.eventDetail({ id })
      const templateId = detail.handoverEvent.templateId
      const eventList = await API.eventType({ type: 1, templateId })
      const person = await API.eventPerson({ type: 1, personType: 3, templateId })
      Toast.hide()
      setLoading(true)
      setModuleId(templateId)
      // 如果有预设二线领导
      if (person[3] && person[3].length) {
        setLeadershipList(person[3])
      } else {
        setLeaderType('1')
      }
      setEventValue({
        id: detail.handoverEvent.eventType,
        name: detail.handoverEvent.eventTypeName
      })
      setEventType(eventList)
      setTime(moment(detail.handoverEvent.createTime).format('YYYY/MM/DD HH:mm'))
      setLevelValue(levelArray[parseInt(detail.handoverEvent.level)])
      setSupervisor(() => {
        if (detail.handoverEvent.supervisor) {
          // setSupervisorId(detail.handoverEvent.supervisorId)
          return detail.handoverEvent.supervisor.split('|')
        } else {
          return []
        }
      })
      setContent(detail.handoverEvent.content)
      setFileImg(() => {
        if (detail.handoverEvent.annexBase64) {
          return detail.handoverEvent.annexBase64
        } else {
          return []
        }
      })
      setProcessValue(() => {
        let s = detail.handoverEvent.handleStatus
        if (s === '0') {
          // 待处理
          return {
            text: '待处理',
            value: 0
          }
        } else if (s === '2') {
          // 处理中
          return {
            text: '处理中',
            value: 2
          }
        } else if (s === '3') {
          // 已处理
          return {
            text: '已处理',
            value: 3
          }
        } else {
          return {}
        }
      })
      setProcessArray(() => {
        let s = detail.handoverEvent.handleStatus
        if (s === '0') {
          // 待处理
          return [
            {
              text: '处理中',
              value: 2
            },
            {
              text: '已处理',
              value: 3
            }
          ]
        } else if (s === '2') {
          // 处理中
          return [
            {
              text: '处理中',
              value: 2
            },
            {
              text: '已处理',
              value: 3
            }
          ]
        } else {
          return []
        }
      })
      setHandleStatus(detail.handoverEvent.handleStatus)
      setHbr({
        userId: detail.handoverEvent.reporterId,
        name: detail.handoverEvent.reporter
      })
      setDeptName(detail.handoverEvent.deptName)
      if (detail.handoverEvent.handleStatus !== '3') {
        // 重复权限弹窗
        if (detail.roles.length > 1) {
          setPart(() => {
            let partlist = []
            detail.roles.forEach((r) => {
              let partname = ''
              if (r === '0') {
                partname = '值班人'
              }
              if (r === '1') {
                partname = '监督人'
              }
              if (r === '2') {
                partname = '汇报人'
              }
              if (r === '3') {
                partname = '移交人'
              }
              if (r === '4') {
                partname = '二线领导人'
              }
              partlist.push({
                role: r,
                partname
              })
            })
            return {
              bool: true,
              list: partlist
            }
          })
        } else {
          setRole(detail.roles[0])
        }
      }
      setHandoverHandles(detail.handoverHandles)
    }
    fetchInfo()
  }, [id, levelArray])

  return (
    loading ? (
      <div className='scroll-view footer-reserved event-submie-view'>
        <div className='process-container'>
          <div className='base-div'>
            <div className='event-time'>
              <span><i className='date-icon' />{time}</span>
              <span>{deptName}</span>
            </div>
            <div className='event-info'>
              <div className='event-info-li'>
                <div className='label-left'>级别：</div>
                <div className='event-flex-center'>
                  <span className={`button-tiny ${levelClassName(levelValue.value, '-small').btnStyle}`}>
                    <div className='flex-centers'>
                      <i className={levelClassName(levelValue.value).btnIcon} />
                      {levelValue.text}
                    </div>
                  </span>
                  {
                    (handleStatus === '0' && role === '0') ? (
                      <em className='level-edit-icon eidt-icon' onClick={() => levelVisible(true)} />
                    ) : null
                  }
                </div>
              </div>
              <div className='event-info-li'>
                <div className='label-left'>类型：</div>
                <div className='event-flex-center'>
                  <span className='tab-button-blue-small'>{eventValue.name}</span>
                  {
                    (handleStatus === '0' && role === '0') ? (
                      <em className='level-edit-icon eidt-icon' onClick={() => eventVisible(true)} />
                    ) : null
                  }
                </div>
              </div>
              <div className='event-info-li'>
                <div className='label-left'>汇报人：</div>
                <div className='cont-right'>
                  <span className='tab-button-darkgray-small'>{hbr.name}</span>
                </div>
              </div>
              <div className='event-info-li'>
                <div className='label-left'>监督人：</div>
                <div className='cont-right'>
                  {
                    supervisor.map((name, index) => <span className='tab-button-darkgray-small' key={index}>{name}</span>)
                  }
                </div>
              </div>
            </div>
            <dl className='textarea-dl'>
              <dt>内容</dt>
              <dd className='text-cont'>
                {content}
              </dd>
            </dl>
            <dl className='textarea-dl f1'>
              <dt>附件：</dt>
              <dd>
                {
                  fileImg.map((item, index) => (
                    <div key={index}><img src={item} alt='' /></div>
                  ))
                }
                {
                  !fileImg.length && '无'
                }
              </dd>
            </dl>
          </div>
          {
            handoverHandles.length ? (
              <>
                <div className='br' />
                <div className='base-div event-info-pt'>
                  {
                    handoverHandles.map((item, index) => (
                      <div className='event-info info-style' key={index}>
                        {
                          item.watch ? (
                            <div className='event-info-li'>
                              <div className='label-left'>值班人：</div>
                              <div className='cont-right'>
                                {
                                  item.watch.split('|').map((name, k) => (
                                    <span className='tab-button-blue-small' key={k}>{name}</span>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                        {
                          item.handover ? (
                            <div className='event-info-li'>
                              <div className='label-left'>移交人：</div>
                              <div className='cont-right'>
                                {
                                  item.handover.split('|').map((name, k) => (
                                    <span className='tab-button-blue-small' key={k}>{name}</span>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                        {
                          item.secLeader ? (
                            <div className='event-info-li'>
                              <div className='label-left'>二线领导：</div>
                              <div className='cont-right'>
                                {
                                  item.secLeader.split('|').map((name, k) => (
                                    <span className='tab-button-blue-small' key={k}>{name}</span>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                        {
                          item.supervisor ? (
                            <div className='event-info-li'>
                              <div className='label-left'>监督人：</div>
                              <div className='cont-right'>
                                {
                                  item.supervisor.split('|').map((name, k) => (
                                    <span className='tab-button-blue-small' key={k}>{name}</span>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                        {
                          item.reporter ? (
                            <div className='event-info-li'>
                              <div className='label-left'>汇报人：</div>
                              <div className='cont-right'>
                                {
                                  item.reporter.split('|').map((name, k) => (
                                    <span className='tab-button-blue-small' key={k}>{name}</span>
                                  ))
                                }
                              </div>
                            </div>
                          ) : null
                        }
                        <dl className='textarea-dl'>
                          <dt>处理意见：</dt>
                          <dd className='text-cont'>
                            {item.handleContent || '无'}
                          </dd>
                        </dl>
                      </div>
                    ))
                  }
                </div>
              </>
            ) : null
          }
          <div className='br' />
          {
            handleStatus !== '3' ? (
              <div>
                <div className='base-div'>
                  <div className='event-info info-normal'>
                    {
                      userIng()
                    }
                    {
                      role === '0' ? (
                        <>
                          {
                            permissionList.handover ? (
                              <div className='event-info-li'>
                                <div className='label-left btn-rows-top'>移交人：</div>
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
                                  <i className='add-radius' onClick={() => openstaff()} />
                                </div>
                              </div>
                            ) : null
                          }
                          {
                            permissionList.secLeader ? (
                              <div className='event-info-li'>
                                <div className='label-left btn-rows-top' style={{ flex: '0 0 84px' }}>二线领导：</div>
                                <div className='cont-right btn-rows-flex'>
                                  <div className='btn-rows'>
                                    {
                                      leadership.map(({ name }, index) => (
                                        <span className='tab-button-blue-small pd-right' key={index}>
                                          {name}
                                          <s className='add-radius-rotate' onClick={() => {
                                            setLeadership(prev => {
                                              return prev.filter((v, i) => i !== index)
                                            })
                                          }} />
                                        </span>
                                      ))
                                    }
                                  </div>
                                  <i className='add-radius' onClick={() => openleader()} />
                                </div>
                              </div>
                            ) : null
                          }
                        </>
                      ) : null
                    }
                  </div>
                  {
                    (((role === '0' && handleStatus === '0') || (handleStatus === '2')) && permissionList.handleContent) ? (
                      <dl className='textarea-dl'>
                        <dt>处理意见：</dt>
                        <dd className='text-cont'>
                          <textarea
                            rows='3'
                            placeholder='请输入处理意见'
                            value={handleContent}
                            onChange={(e) => setHandleContent(e.target.value)}
                          />
                        </dd>
                      </dl>
                    ) : null
                  }
                  <div className='event-time'>
                    <span><i className='date-icon' />{moment().format('YYYY/MM/DD HH:mm')}</span>
                  </div>
                </div>
                <div className='br' />
              </div>
            ) : null
          }
          {
            handleStatus !== '1' && (
              <div className='base-div'>
                <div className='process-ing'>
                  <div className='label-left'>处理进度：</div>
                  <div className='cont-right'>
                    <span className={`button-tiny ${processClassName(processValue.value).btnStyle}`}>
                      <div className='event-flex-center'>
                        <i className={processClassName(processValue.value).btnIcon} />
                        {processValue.text}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            )
          }
          <div className='layout-footer'>
            <div className='process-foot'>
              {
                (((role === '0' && handleStatus === '0') || (handleStatus === '2')) && permissionList.handleContent) ? (
                  <div>
                    <button className='tab-button-blue current straight' type='button' onClick={() => next()}>提交</button>
                  </div>
                ) : (
                  <div>
                    <button className='tab-button-blue normal straight' type='button' onClick={() => history.push('/affair/list')}>返回</button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <Modal
          title='请选择级别'
          visible={levelModal}
          transparent
          closable
          onClose={() => setLevelModal(false)}
        >
          <ul className='level-block'>
            {
              levelArray.map((item, index) => (
                <li
                  className={`${levelClassName(index, '-small').btnStyle} ${equalsObj(item, levelValue) ? 'active' : ''}`}
                  onClick={() => levelModalSelect(item)}
                  key={index}>
                  <div className='flex-centers'>
                    <i className={levelClassName(index).btnIcon} />
                    {item.text}
                  </div>
                </li>
              ))
            }
          </ul>
        </Modal>
        <Modal
          title='请选择类型'
          visible={eventModal}
          transparent
          closable
          onClose={() => setEventModal(false)}
        >
          <ul className='level-list-modal'>
            {
              eventType.map((item, index) => (
                <li key={index}>
                  <span
                    className={`tab-button-blue ${equalsObj(item, eventValue) ? 'active' : ''}`}
                    onClick={() => eventModalSelect(item)}
                    key={index}>
                    {item.name}
                  </span>
                </li>
              ))
            }
          </ul>
        </Modal>
        <Modal
          title='请选择角色身份'
          visible={part.bool}
          transparent
        >
          <ul className='level-block'>
            {
              part.list.map((p, t) => {
                return (
                  <li onClick={() => {
                    setRole(p.role)
                    setPart((prev) => {
                      return {
                        ...prev,
                        ...{
                          bool: false
                        }
                      }
                    })
                  }} key={t}>
                    <span className='tab-button-blue block-row'>
                      {p.partname}
                    </span>
                  </li>
                )
              })
            }
          </ul>
        </Modal>
        <Modal
          title='请选择当前处理进度'
          visible={processModal}
          transparent
          closable
          onClose={() => setProcessModal(false)}
          footer={[{ text: '确定', onPress: () => { savePss() } }]}
        >
          <ul className='level-block'>
            {
              processArray.map((item, index) => (
                <li
                  className={`${processClassName(item.value).btnStyle} ${equalsObj(item, saveProcess) ? 'active' : ''}`}
                  onClick={() => processModalSelect(item)}
                  key={index}>
                  <div className='flex-centers'>
                    <i className={processClassName(item.value).btnIcon} />
                    {item.text}
                  </div>
                </li>
              ))
            }
          </ul>
        </Modal>
        <Modal
          title='请选择人员'
          visible={staffVisible}
          closable
          transparent
          onClose={() => setStaffVisible(false)}
          footer={[{ text: '确定', onPress: () => { staffConfirm() } }]}
        >
          <StaffModal select={staffSelect} list={staffList} />
        </Modal>
        <Modal
          title='请选择二线领导'
          visible={leaderVisible}
          closable
          transparent
          onClose={() => setLeaderVisible(false)}
          footer={[{ text: '确定', onPress: () => { leaderConfirm() } }]}
        >
          <StaffModal select={leaderSelect} list={leadershipList} type={leaderType} />
        </Modal>
      </div>
    ) : null
  )
}

Process.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Process
