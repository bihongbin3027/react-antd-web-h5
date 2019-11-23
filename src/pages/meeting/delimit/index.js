import React, {
  useEffect,
  useReducer,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { List, Picker, Switch } from 'antd-mobile'
import { fromJS } from 'immutable'
import EventCalendar from '@/components/eventcalendar'
import ImageUpload from '@/components/imageupload/imageupload'
import Crew from '@/components/crew'
import './style.scss'

const Item = List.Item

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return action.value
    default:
      return state
  }
}

function MeetingDelimit (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    // 会议标题
    titleNormal: '请输入标题',
    titleValue: '请输入标题',
    // 会议内容
    meettingContent: '',
    // 默认图片附件
    fileImgNormal: [],
    // 会议室
    mettingRoom: {
      id: 123,
      value: '科教楼305'
    },
    // 参与人
    participant: [{ name: '张三', userId: '-1' }, { name: '李四', userId: '-2' }],
    participantModal: false,
    // 发起人
    sponsor: [{ name: '张三', userId: '-1' }],
    sponsorModal: false,
    // 会议提醒
    reminderData: [
      { label: '不提醒', value: 0 },
      { label: '5分钟', value: 5 },
      { label: '10分钟', value: 10 },
      { label: '15分钟', value: 15 },
      { label: '30分钟', value: 30 },
      { label: '1小时', value: 60 },
      { label: '2小时', value: 120 }
    ],
    reminderValue: [0],
    // 高级设置
    settingsVisible: true,
    // 积分设置
    integral: {
      text: '3积分',
      value: 3
    },
    // 提交审核
    submitReview: [{ name: '李四', userId: '-2' }],
    stReviewModal: false,
    // 签到方式
    checkInData: [
      { label: '不设置', value: 0 },
      { label: 'GPS定位+二维码签到', value: 1 },
      { label: 'GPS定位', value: 2 },
      { label: '二维码签到', value: 3 }
    ],
    checkInValue: [0],
    // 扫码地区限制
    regionLimit: false,
    // 签退设置
    signOff: false,
    // 仅相关人可见
    relatedEvident: false,
    // 允许中途加入
    joinHalfway: true,
    // 设置时间范围
    timeRangeData: [
      { label: '15分钟内', value: 15 },
      { label: '30分钟内', value: 30 },
      { label: '45分钟内', value: 45 },
      { label: '1小时内', value: 60 }
    ],
    timeRangeValue: [15]
  }))

  const changeValue = (key, val) => {
    dispatch({
      type: 'changeValue',
      value: data.set(key, val)
    })
  }

  const fileListChange = (serverId) => {
    console.log('图片附件serverId', serverId)
  }

  const setParticipantVisible = (bool) => {
    changeValue('participantModal', bool)
  }

  const setSponsorVisible = (bool) => {
    changeValue('sponsorModal', bool)
  }

  const setSubmitReviewVisible = (bool) => {
    changeValue('stReviewModal', bool)
  }

  const changeCrew = (r) => {
    changeValue('participant', r)
  }

  const changeSponsorCrew = (r) => {
    changeValue('sponsor', r)
  }

  const changeSubmitReview = (r) => {
    changeValue('submitReview', r)
  }

  useEffect(() => {
    document.title = '创建会议'
  }, [])

  const {
    titleNormal,
    titleValue,
    fileImgNormal,
    mettingRoom,
    participant,
    participantModal,
    sponsor,
    sponsorModal,
    reminderData,
    reminderValue,
    settingsVisible,
    integral,
    submitReview,
    stReviewModal,
    checkInData,
    checkInValue,
    regionLimit,
    signOff,
    relatedEvident,
    joinHalfway,
    timeRangeData,
    timeRangeValue
  } = data.toJS()

  return (
    <div className='scroll-view footer-reserved meeting-edit'>
      <div className='me-top'>
        <input
          className='me-title'
          type='text'
          onChange={(e) => {
            changeValue('titleValue', e.target.value)
          }}
          onFocus={() => {
            if (titleValue === titleNormal || titleValue === '') {
              changeValue('titleValue', '')
            }
          }}
          onBlur={() => {
            if (titleValue === titleNormal || titleValue === '') {
              changeValue('titleValue', titleNormal)
            }
          }}
          value={titleValue}
        />
        <textarea
          className='me-content'
          rows={3}
          onChange={(e) => {
            changeValue('meettingContent', e.target.value)
          }}
          placeholder='请输入内容'
        />
        <div className='me-file'>
          <ImageUpload
            imglist={useCallback(() => fileListChange, [])}
            normal={fileImgNormal}
          />
        </div>
      </div>
      <div className='meeting-date-wrap list-item-style'>
        <List className='list-beforeborder'>
          <Item
            extra={mettingRoom.value}
            arrow='horizontal'
            onClick={() => props.history.push('/selectroom')}
          >会议室</Item>
        </List>
        <EventCalendar />
        <List className='crew list-beforeborder list-afterborder'>
          <Item
            extra={participant.length ? participant.length + '人' : '添加'}
            onClick={() => {
              changeValue('participantModal', true)
            }}
            arrow='horizontal'
          >
            参与人
          </Item>
          <Item
            extra={sponsor.length ? sponsor.length + '人' : '添加'}
            onClick={() => {
              changeValue('sponsorModal', true)
            }}
            arrow='horizontal'
          >
            发起人
          </Item>
          <Picker
            cols={1}
            data={reminderData}
            value={reminderValue}
            onChange={(v) => {
              changeValue('reminderValue', v)
            }}
          >
            <Item
              arrow='horizontal'
            >
              会议提醒
            </Item>
          </Picker>
        </List>
        <List className='list-item-switch list-beforeborder list-afterborder'>
          <Item
            className='switch-small'
            extra={<Switch
              checked={settingsVisible}
              onChange={() => {
                changeValue('settingsVisible', !settingsVisible)
              }}
            />}
          ><i className='high-icon' />高级设置</Item>
        </List>
        {
          settingsVisible ? (
            <List className='list-beforeborder list-afterborder'>
              <Item
                extra={integral.text}
                arrow='horizontal'
                onClick={() => props.history.push('/integral')}
              >
                积分设置
              </Item>
              <Item
                extra={submitReview.length ? submitReview.length + '人' : '添加'}
                onClick={() => {
                  changeValue('stReviewModal', true)
                }}
                arrow='horizontal'
              >
                提交审核
              </Item>
              <Picker
                cols={1}
                data={checkInData}
                value={checkInValue}
                onChange={(v) => {
                  changeValue('checkInValue', v)
                }}
              >
                <Item
                  className='item-afterborder'
                  arrow='horizontal'
                >
                  签到方式
                </Item>
              </Picker>
              {
                checkInValue[0] !== 0 && (
                  <>
                    {
                      checkInValue[0] === 1 && (
                        <Item
                          className='switch-small item-afterborder'
                          extra={<Switch
                            checked={regionLimit}
                            onChange={() => {
                              changeValue('regionLimit', !regionLimit)
                            }}
                          />}
                        >扫码地区限制</Item>
                      )
                    }
                    <Item
                      className='switch-small'
                      extra={<Switch
                        checked={signOff}
                        onChange={() => {
                          changeValue('signOff', !signOff)
                        }}
                      />}
                    >签退设置</Item>
                  </>
                )
              }
              <Item
                className='switch-small'
                extra={<Switch
                  checked={relatedEvident}
                  onChange={() => {
                    changeValue('relatedEvident', !relatedEvident)
                  }}
                />}
              >仅相关人可见</Item>
              <Item
                className='switch-small item-afterborder'
                extra={<Switch
                  checked={joinHalfway}
                  onChange={() => {
                    changeValue('joinHalfway', !joinHalfway)
                  }}
                />}
              >允许中途加入</Item>
              {
                joinHalfway && (
                  <Picker
                    cols={1}
                    data={timeRangeData}
                    value={timeRangeValue}
                    onChange={(v) => {
                      changeValue('timeRangeValue', v)
                    }}
                  >
                    <Item
                      className='item-afterborder'
                      arrow='horizontal'
                    >
                      设置时间范围
                    </Item>
                  </Picker>
                )
              }
            </List>
          ) : null
        }
      </div>
      <Crew
        title={`参与人(${participant.length})`}
        visible={participantModal}
        setVisible={setParticipantVisible}
        list={participant}
        onChange={changeCrew}
      />
      <Crew
        title={`发起人(${sponsor.length})`}
        visible={sponsorModal}
        setVisible={setSponsorVisible}
        list={sponsor}
        onChange={changeSponsorCrew}
      />
      <Crew
        title={`审核人(${submitReview.length})`}
        visible={stReviewModal}
        setVisible={setSubmitReviewVisible}
        list={submitReview}
        onChange={changeSubmitReview}
      />
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue white straight'>存为草稿</button>
          </div>
          <div>
            <button type='button' className='tab-button-blue current straight'>确定发布</button>
          </div>
        </div>
      </div>
    </div>
  )
}

MeetingDelimit.propTypes = {
  history: PropTypes.object
}

export default MeetingDelimit
