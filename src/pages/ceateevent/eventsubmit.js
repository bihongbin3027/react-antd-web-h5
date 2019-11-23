import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Toast } from 'antd-mobile'
import { parse } from 'query-string'
import _ from 'lodash'
import API from '@/api/api'
import { loadFromLocal, equalsObj } from '@/utils/index'
import StaffModal from '@/components/staffmodal/staffmodal'
import ImageUpload from '@/components/imageupload/imageupload'
import './submit.scss'

const alert = Modal.alert

function EventSubmit ({ history, location }) {
  let { templateId, id, level, genre } = parse(location.search)
  const userInfo = loadFromLocal('h5', 'userInfo')
  const levelArray = [
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
  ]
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
                if (templateType === 1) {
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
  const [eventType, setEventType] = useState([])
  const [time] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [levelValue, setLevelValue] = useState(levelArray[level])
  const [levelModal, setLevelModal] = useState(false)
  const [eventValue, setEventValue] = useState({})
  const [eventModal, setEventModal] = useState(false)
  const [hbr] = useState(() => {
    return userInfo
  })
  const [staffVisible, setStaffVisible] = useState(false)
  const [dutyNormal, setDutyNormal] = useState([])
  const [dutyPerson, setdutyPerson] = useState([])
  const [dutyBool, setDutyBool] = useState(true)
  const [staffList, setStaffList] = useState([])
  const [content, setContent] = useState('')
  const [serverId, setServerId] = useState([])
  const [supervisor, setSupervisor] = useState([])
  const [fileNormal, setFileNormal] = useState([])
  const staffSelect = (select) => {
    setDutyNormal(select)
  }
  const staffConfirm = () => {
    setdutyPerson(_.uniqBy([...dutyPerson, ...dutyNormal], 'userId'))
    setStaffVisible(false)
  }
  const levelVisible = (bool) => setLevelModal(bool)
  const eventVisible = (bool) => setEventModal(bool)
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
  const levelModalSelect = (item) => {
    setLevelValue(item)
    levelVisible(false)
  }
  const eventModalSelect = (item) => {
    setEventValue(item)
    eventVisible(false)
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
        // 内容
        content,
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
        level: levelValue.value,
        // 汇报人
        reporter: hbr.name,
        // 汇报人id
        reporterId: hbr.userId,
        // 监督人
        supervisor: supervisor.map((k) => k.name).join('|'),
        // 家督人id
        supervisorId: supervisor.map((k) => k.userId).join('|'),
        // 事物类别 1：事件 2：投诉
        type: 1,
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
    if (!content) {
      history.push('/affair/list')
      return
    }
    alert('', '是否存为草稿？', [
      { text: '取消', onPress: () => { history.push('/affair/list') } },
      {
        text: '确认',
        onPress: () => {
          let params = paramsArr()
          if (!content) {
            Toast.info('请输入内容', 1)
            return false
          }
          if (serverId.length > 9) {
            Toast.info('最多上传9张图片', 1)
            return false
          }
          if (!dutyPerson.length) {
            Toast.info('请选择值班人', 1)
            return false
          }
          params.event.handleStatus = 1
          Toast.loading('请稍后...', 0)
          API.submitEvent(params).then(() => {
            Toast.info('已保存', 1)
            setTimeout(() => {
              history.push('/affair/list')
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
      return
    }
    if (content === '') {
      Toast.info('请输入内容', 1)
      return
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
    document.title = '事件提交'
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
      setContent(detail.handoverEvent.content)
      setdutyPerson(arr)
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
      const person = await API.eventPerson({ type: 1, templateId: moduleId })
      for (let i in person) {
        // 监督人
        if (i === '1') {
          setSupervisor(person[i])
        }
        // 值班人员
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
      const result = await API.eventType({ type: 1, templateId: moduleId })
      for (let i = 0, len = result.length; i < len; i++) {
        if (result[i].id === genre) {
          setEventValue(result[i])
          break
        }
      }
      setEventType(result)
    }
    if (moduleId) {
      fetchEventType()
      getInfo()
    }
  }, [moduleId, genre])

  return (
    <div className='scroll-view footer-reserved event-submie-view'>
      <div className='event-time'>
        <span><i className='date-icon' />{time}</span>
        <span>{ userInfo.departmentName }</span>
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
            <em className='level-edit-icon eidt-icon' onClick={() => levelVisible(true)} />
          </div>
        </div>
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
                        <s className='add-radius-rotate' onClick={() => {
                          setdutyPerson(prev => {
                            return prev.filter((v, i) => i !== index)
                          })
                        }} />
                      </span>
                    ))
                  }
                </div>
                <i className='add-radius' onClick={() => openStaff()} />
              </div>
            </div>
          ) : null
        }
      </div>
      <dl className='textarea-dl'>
        <dt>内容</dt>
        <dd>
          <textarea
            rows='5'
            placeholder='请输入内容'
            value={content}
            onChange={(e) => setContent(e.target.value)}
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

EventSubmit.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default EventSubmit
