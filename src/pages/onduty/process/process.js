import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Switch, Toast } from 'antd-mobile'
import { parse } from 'query-string'
import StaffModal from '@/components/staffmodal/staffmodal'
import { loadFromLocal } from '@/utils/index'
import API from '@/api/api'

function Process ({ history, location }) {
  let wxToken = loadFromLocal('h5', 'wxToken')
  const alert = Modal.alert
  const { id } = parse(location.search)
  const [userId] = useState(() => {
    try {
      return loadFromLocal('h5', 'userInfo').userId
    } catch (error) {
      return ''
    }
  })
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
  const [loading, setLoading] = useState(false)
  const [time] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [dataInfo, setDataInfo] = useState({
    templateId: '',
    successorId: '',
    extraResource: [],
    addRemark: '',
    watchLog: '',
    handoverPerson: '',
    successor: '',
    handoverType: '',
    // 值班人姓名
    watchName: '',
    // 接班人姓名
    receiveName: ''
  })
  const [isSwitch, setIsSwitch] = useState(false)
  // 人员弹窗打开关闭
  const [staffVisible, setStaffVisible] = useState(false)
  const [staffModalType, setStaffModalType] = useState(1)
  // 人员弹窗默认选择的人员
  const [dutyNormal, setDutyNormal] = useState([])
  // 接班人、值班人
  const [staffList, setStaffList] = useState({
    // 单选
    type: '1',
    list: []
  })

  const footSwitch = () => {
    const { successorId, handoverStatus } = dataInfo
    /**
     * 0 待接班
     * 1 草稿
     * 2 已接班
     */
    if (handoverStatus === 0 && (userId === successorId)) {
      return <div>
        <button className='tab-button-blue current straight' type='button' onClick={() => nexts()}>接班</button>
      </div>
    } else {
      return <div>
        <button className='tab-button-blue normal straight' type='button' onClick={() => history.push('/onduty/dutylog')}>返回</button>
      </div>
    }
  }

  const nexts = () => {
    const params = {
      id,
      templateId: dataInfo.templateId,
      addRemark: dataInfo.addRemark
    }
    Toast.loading('请稍后...', 0)
    if (dataInfo.handoverType === 2) {
      params.watchName = dataInfo.watchName
      params.receiveName = dataInfo.receiveName
    }
    API.updateRotaLog(params).then(() => {
      Toast.hide()
      alert('', '已接班', [
        {
          text: '确定',
          onPress: () => {
            history.push('/onduty/dutylog')
          }
        }
      ])
    })
  }

  /**
   * @description 人员弹窗change
   * @author bihongbin
   * @param {select}  人员弹窗选择的人员
   * @return undefined
   * @Date 2019-11-23 16:19:24
   */
  const staffSelect = (select) => {
    setDutyNormal(select)
  }

  /**
   * @description 不同类型的人打开选择人员弹窗
   * @author bihongbin
   * @param {type} 1值班人 2接班人
   * @return undefined
   * @Date 2019-11-23 16:14:50
   */
  const openStaff = (type) => {
    if (type === 1) {
      setStaffList({
        type: '2',
        list: handover.shiftUserList
      })
    }
    if (type === 2) {
      setStaffList({
        type: '2',
        list: handover.successorList
      })
    }
    setStaffModalType(type)
    setStaffVisible(true)
  }

  const handoverFormat = (str, classType, setName) => {
    return str.split(',').map((item, index) => {
      return (
        <span className={classType === 2 ? 'tab-button-blue-small pd-right' : 'tab-button-darkgray-small'} key={index}>
          {item}
          {
            (classType === 2 && dataInfo.handoverStatus !== 2) && (
              <s className='add-radius-rotate' onClick={() => {
                if (setName === 'watchName') {
                  setDataInfo(prev => {
                    return {
                      ...prev,
                      watchName: prev.watchName.split(',').filter((v, i) => i !== index).join(',')
                    }
                  })
                }
                if (setName === 'receiveName') {
                  setDataInfo(prev => {
                    return {
                      ...prev,
                      receiveName: prev.receiveName.split(',').filter((v, i) => i !== index).join(',')
                    }
                  })
                }
              }} />
            )
          }
        </span>
      )
    })
  }

  // 人员弹窗确定
  const staffConfirm = () => {
    if (staffModalType === 1) {
      setDataInfo((prev) => {
        return {
          ...prev,
          watchName: dutyNormal.map(it => it.name).join(',')
        }
      })
    }
    if (staffModalType === 2) {
      setDataInfo((prev) => {
        return {
          ...prev,
          receiveName: dutyNormal.map(it => it.name).join(',')
        }
      })
    }
    setStaffVisible(false)
  }

  useEffect(() => {
    document.title = '值班处理'
    async function fetchData () {
      const query = { id }
      Toast.loading('请稍后...', 0)
      const result = await API.getRotaLogDetail(query)
      const extUrl = result.extraResource
      Toast.hide()
      setLoading(true)
      if (extUrl) {
        result.extraResource = extUrl
      } else {
        result.extraResource = []
      }
      if (result.addRemark) {
        setIsSwitch(true)
      } else {
        result.addRemark = ''
      }
      if (!result.watchLog) {
        result.watchLog = ''
      }
      setDataInfo(result)
    }
    fetchData()
  }, [id, wxToken])

  return (
    loading ? (
      <div className='scroll-view footer-reserved event-submie-view'>
        <div className='process-container'>
          <div className='base-div'>
            <div className='event-time'>
              <span><i className='date-icon' />{moment(dataInfo.handoverTime).format('YYYY/MM/DD HH:mm')}</span>
              {/* <span>信息科</span> */}
            </div>
            <div className='event-info'>
              <div className='event-info-li'>
                <div className='label-left'>值班人：</div>
                <div className='cont-right btn-rows-flex'>
                  <div className='btn-rows'>
                    {
                      dataInfo.handoverType === 1 ? handoverFormat(dataInfo.handoverPerson, 1) : handoverFormat(dataInfo.watchName, 2, 'watchName')
                    }
                  </div>
                  {
                    (dataInfo.handoverStatus === 0 && dataInfo.handoverType === 2) && <i className='add-radius' onClick={() => openStaff(1)} />
                  }
                </div>
              </div>
              <div className='event-info-li'>
                <div className='label-left'>接班人：</div>
                <div className='cont-right btn-rows-flex'>
                  <div className='btn-rows'>
                    {
                      dataInfo.handoverType === 1 ? handoverFormat(dataInfo.successor, 1) : handoverFormat(dataInfo.receiveName, 2, 'receiveName')
                    }
                  </div>
                  {
                    (dataInfo.handoverStatus === 0 && dataInfo.handoverType === 2) && <i className='add-radius' onClick={() => openStaff(2)} />
                  }
                </div>
              </div>
            </div>
            <dl className='textarea-dl'>
              <dt>值班日志</dt>
              <dd className='text-cont'>
                <pre>{dataInfo.watchLog}</pre>
              </dd>
            </dl>
            {
              dataInfo.extraResource.length ? (
                <dl className='textarea-dl f1'>
                  <dt>附件：</dt>
                  <dd>
                    {
                      dataInfo.extraResource.map((item, index) => (
                        <div key={index}><img src={item} alt='' /></div>
                      ))
                    }
                  </dd>
                </dl>
              ) : null
            }
            <div className='event-time' style={{ paddingTop: 10 }}>
              <span><i className='date-icon' />{time}</span>
            </div>
          </div>
          {
            ((userId === dataInfo.successorId) || ((dataInfo.handoverStatus > 0) && dataInfo.addRemark)) ? (
              <>
                <div className='br' />
                <dl className='textarea-dl' style={{ paddingBottom: 10 }}>
                  <dt className='switch-label'>
                    <div>加注</div>
                    {
                      dataInfo.handoverStatus === 0 ? (
                        <Switch
                          checked={isSwitch}
                          onChange={() => setIsSwitch(() => !isSwitch)}
                          platform='android'
                          color='#4f77aa'
                        />
                      ) : null
                    }
                  </dt>
                  <dd>
                    <textarea
                      disabled={dataInfo.handoverStatus === 2}
                      value={dataInfo.addRemark}
                      onChange={(e) => {
                        e.persist()
                        setDataInfo((prev) => {
                          return {
                            ...prev,
                            addRemark: e.target.value
                          }
                        })
                      }}
                      style={{ display: isSwitch ? 'block' : 'none' }}
                      rows='3'
                      placeholder='请输入内容'
                    />
                  </dd>
                </dl>
              </>
            ) : null
          }
          <div className='layout-footer'>
            <div className='process-foot'>
              {
                footSwitch()
              }
            </div>
          </div>
        </div>
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
            mode='check'
          />
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
