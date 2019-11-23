import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Switch, Toast } from 'antd-mobile'
import { parse } from 'query-string'
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
  const [loading, setLoading] = useState(false)
  const [time] = useState(moment().format('YYYY/MM/DD HH:mm'))
  const [dataInfo, setDataInfo] = useState({
    templateId: '',
    successorId: '',
    extraResource: [],
    addRemark: '',
    watchLog: ''
  })
  const [isSwitch, setIsSwitch] = useState(false)
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
                <div className='cont-right'>
                  <span className='tab-button-darkgray-small'>{dataInfo.handoverPerson}</span>
                </div>
              </div>
              <div className='event-info-li'>
                <div className='label-left'>接班人：</div>
                <div className='cont-right'>
                  <span className='tab-button-darkgray-small'>{dataInfo.successor}</span>
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
      </div>
    ) : null
  )
}

Process.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Process
