import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Toast } from 'antd-mobile'
import _ from 'lodash'
import { parse } from 'query-string'
import { loadFromLocal, equalsObj } from '@/utils/index'
import API from '@/api/api'
import StaffModal from '@/components/staffmodal/staffmodal'
import ImageUpload from '@/components/imageupload/imageupload'
import './submit.scss'

const alert = Modal.alert

function ComplaintSubmit ({ history, location }) {
  let { templateId, id } = parse(location.search)
  const userInfo = loadFromLocal('h5', 'userInfo')
  const [fileVisible] = useState(() => {
    try {
      const { modules } = userInfo
      if (modules) {
        // 存储用户信息
        for (let i = 0, ilen = modules.length; i < ilen; i++) {
          const { templateList } = modules[i]
          // 事务处理模块
          if (modules[i].type === 1) {
            if (templateList.length) {
              for (let k = 0, klen = templateList.length; k < klen; k++) {
                const { templateType, permissionList } = templateList[k]
                // 事务处理
                if (parseInt(templateType) === 2) {
                  for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                    if (permissionList[w].name === '添加附件') {
                      return true
                    }
                  }
                  break
                }
              }
            }
            break
          }
        }
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  })
  const [moduleId, setModuleId] = useState(templateId)
  const [time] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [eventValue, setEventValue] = useState({})
  const [eventType, setEventType] = useState([])
  const [eventModal, setEventModal] = useState(false)
  const [hbr] = useState(() => {
    return userInfo
  })
  const [supervisor, setSupervisor] = useState([])
  const [dutyNormal, setDutyNormal] = useState([])
  const [dutyPerson, setdutyPerson] = useState([])
  const [dutyBool, setDutyBool] = useState(true)
  const [staffVisible, setStaffVisible] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [serverId, setServerId] = useState([])
  const [complaint, setComplaint] = useState('')
  const [complaintMobile, setComplaintMobile] = useState('')
  const [complaintReasons, setComplaintReasons] = useState('')
  const [fileNormal, setFileNormal] = useState([])
  const eventVisible = (bool) => setEventModal(bool)
  const eventModalSelect = (item) => {
    setEventValue(item)
    eventVisible(false)
  }
  const staffConfirm = () => {
    setdutyPerson(_.uniqBy([...dutyPerson, ...dutyNormal], 'userId'))
    setStaffVisible(false)
  }
  const staffSelect = (select) => {
    setDutyNormal(select)
  }
  const openStaff = async () => {
    if (dutyBool && !staffList.length) {
      Toast.loading('请稍后...', 0)
      const treeList = await API.getTreeDeptAndUserList({
        username: ''
      })
      Toast.hide()
      setStaffList(treeList)
      setStaffVisible(true)
    } else {
      setStaffVisible(true)
    }
  }
  const paramsArr = () => {
    return {
      event: {
        id,
        templateId: moduleId,
        // 附件
        annex: serverId.join(','),
        // 投诉人
        complaint,
        // 投诉人电话
        complaintMobile,
        // 投诉事由
        complaintReasons,
        // 内容
        content: '',
        // 科室
        deptId: userInfo.department,
        // 科室名称
        deptName: userInfo.departmentName,
        // 类型
        eventType: eventValue.id,
        // 类型名称
        eventTypeName: eventValue.name,
        // 处理状态 0：待处理 1：草稿 2：进行中 3：已处理 4：不处理
        handleStatus: 0,
        // 等级
        level: '',
        // 汇报人
        reporter: hbr.name,
        // 汇报人id
        reporterId: hbr.userId,
        // 监督人
        supervisor: supervisor.map((k) => k.name).join('|'),
        // 家督人id
        supervisorId: supervisor.map((k) => k.userId).join('|'),
        // 事物类别 1：事件 2：投诉
        type: 2,
        // 值班人
        watch: dutyPerson.map((k) => k.name).join('|'),
        // 值班人id
        watchId: dutyPerson.map((k) => k.userId).join('|')
      }
    }
  }
  const fileList = (serverId) => {
    setServerId(serverId)
  }
  const cancel = () => {
    if (!complaint && !complaintMobile && !complaintReasons) {
      history.push('/affair/list')
      return
    }
    alert('', '是否存为草稿？', [
      { text: '取消', onPress: () => { history.push('/affair/list') } },
      {
        text: '确认',
        onPress: () => {
          let params = paramsArr()
          if (complaint === '') {
            Toast.info('请输入投诉人', 1)
            return false
          }
          if (complaintMobile === '') {
            Toast.info('请输入联系电话', 1)
            return false
          }
          if (complaintReasons === '') {
            Toast.info('请输入投诉事由', 1)
            return false
          }
          if (serverId.length > 9) {
            Toast.info('最多上传9张图片', 1)
            return
          }
          params.event.handleStatus = 1
          Toast.loading('请稍后...', 0)
          API.submitEvent(params).then(() => {
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
    if (!dutyPerson.length) {
      Toast.info('请选择值班人', 1)
      return false
    }
    if (!complaint) {
      Toast.info('请输入投诉人', 1)
      return false
    }
    if (!complaintMobile) {
      Toast.info('请输入联系电话', 1)
      return false
    }
    if (!complaintReasons) {
      Toast.info('请输入投诉事由', 1)
      return false
    }
    if (serverId.length > 9) {
      Toast.info('最多上传9张图片', 1)
      return
    }
    params.event.handleStatus = 0
    Toast.loading('请稍后...', 0)
    API.submitEvent(params).then(() => {
      Toast.hide()
      alert('', '已提交', [
        { text: '确定', onPress: () => history.push('/affair/list') }
      ])
    })
  }

  useEffect(() => {
    document.title = '投诉建议'
    const fetchDetail = async () => {
      Toast.loading('请稍后...', 0)
      const detail = await API.eventDetail({ id })
      Toast.hide()
      let arr = []
      if (dutyBool && detail.handoverEvent.watch) {
        detail.handoverEvent.watch.split('|').forEach((n, h) => {
          arr.push({
            userId: detail.handoverEvent.watchId.split('|')[h],
            name: n
          })
        })
      }
      if (detail.handoverEvent.annexBase64) {
        setFileNormal(detail.handoverEvent.annexBase64.map((iu, io) => {
          const extraResourceUrl = detail.handoverEvent.annex.split(',')
          return {
            img: iu,
            url: extraResourceUrl[io]
          }
        }))
      }
      setdutyPerson(arr)
      setComplaint(detail.handoverEvent.complaint)
      setComplaintMobile(detail.handoverEvent.complaintMobile)
      setComplaintReasons(detail.handoverEvent.complaintReasons)
      setModuleId(detail.handoverEvent.templateId)
    }
    if (id) {
      fetchDetail()
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    const getInfo = async () => {
      let bool = true
      const person = await API.eventPerson({ type: 2, templateId: moduleId })
      for (let i in person) {
        if (i === '1') {
          setSupervisor(person[i])
        }
        if (i === '2') {
          bool = false
          setDutyBool(false)
          setdutyPerson(() => {
            return person[i].map(({ userId, name }) => {
              return {
                userId,
                name
              }
            })
          })
        }
      }
      if (bool) {
        setDutyBool(true)
      }
    }
    const fetchEventType = async () => {
      const result = await API.eventType({ type: 2, templateId: moduleId })
      setEventType(result)
      setEventValue(result[0])
    }
    if (moduleId) {
      fetchEventType()
      getInfo()
    }
  }, [moduleId])

  return (
    <div className='scroll-view footer-reserved event-submie-view'>
      <div className='event-time'>
        <span><i className='date-icon' />{time}</span>
        <span>{ userInfo.departmentName }</span>
      </div>
      <div className='event-info'>
        <div className='event-info-li'>
          <div className='label-left'>类型：</div>
          <div className='event-flex-center'>
            {
              Object.keys(eventValue).length ? <span className='tab-button-blue-small'>{eventValue.name}</span> : <span />
            }
            <em className='level-edit-icon eidt-icon' onClick={() => eventVisible(true)} />
          </div>
        </div>
        <div className='event-info-li'>
          <div className='label-left'>汇报人：</div>
          <div className='cont-right'>
            <span className='tab-button-blue-small'>{hbr.name}</span>
          </div>
        </div>
        <div className='event-info-li'>
          <div className='label-left'>监督人：</div>
          <div className='cont-right'>
            {
              supervisor.map(({ name }, index) => <span className='tab-button-blue-small' key={index}>{name}</span>)
            }
          </div>
        </div>
        {
          dutyBool ? (
            <div className='event-info-li'>
              <div className='label-left'>值班人：</div>
              <div className='cont-right btn-rows-flex'>
                <div className='btn-rows'>
                  {
                    dutyPerson.map(({ name }, index) => (
                      <span className='tab-button-blue-small pd-right' key={index}>
                        {name}
                        {
                          dutyBool && (
                            <s className='add-radius-rotate' onClick={() => {
                              setdutyPerson(prev => {
                                return prev.filter((v, i) => i !== index)
                              })
                            }} />
                          )
                        }
                      </span>
                    ))
                  }
                </div>
                {
                  dutyBool && <i className='add-radius' onClick={() => openStaff()} />
                }
              </div>
            </div>
          ) : null
        }
      </div>
      <div className='cplaint-name'>
        <div className='label-ti'>
          <div className='label-left'>投诉人：</div>
          <div className='label-content'>
            <input
              className='input'
              type='text'
              placeholder='请输入投诉人'
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </div>
        </div>
        <div className='label-ti'>
          <div className='label-left'>联系电话：</div>
          <div className='label-content'>
            <input
              className='input'
              type='number'
              placeholder='请输入联系电话'
              value={complaintMobile}
              onChange={(e) => {
                let value = e.target.value
                if (value.length <= 11) {
                  setComplaintMobile(value)
                }
              }}
            />
          </div>
        </div>
      </div>
      <dl className='textarea-dl'>
        <dt>投诉事由</dt>
        <dd>
          <textarea
            rows='3'
            placeholder='请输入内容'
            value={complaintReasons}
            onChange={(e) => setComplaintReasons(e.target.value)}
          />
        </dd>
      </dl>
      { fileVisible && <ImageUpload imglist={fileList} normal={fileNormal} /> }
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
        title='请选择人员'
        visible={staffVisible}
        closable
        transparent
        onClose={() => setStaffVisible(false)}
        footer={[{ text: '确定', onPress: () => { staffConfirm() } }]}
      >
        <StaffModal select={staffSelect} list={staffList} />
      </Modal>
    </div>
  )
}

ComplaintSubmit.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default ComplaintSubmit
