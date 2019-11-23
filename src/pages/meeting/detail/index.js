import React, {
  useReducer,
  useEffect,
  useRef
} from 'react'
import { fromJS } from 'immutable'
import { List, Badge } from 'antd-mobile'
import PropTypes from 'prop-types'
import Scroll from '@/components/scroll'
import CheckIn from '@/components/checkin'
import './style.scss'

const Item = List.Item

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return state.set(action.value.key, action.value.val)
    default:
      return state
  }
}

function MeetingDetails (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    // 签到弹窗
    checkInModal: false,
    title: '会议标题会议标题会议标题会议标题会议',
    status: '进行中',
    date: '2019/07/10',
    designation: '张三',
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容，上午9时有患者家属在院闹事，与医务人员发生冲突。内容内容内容内容内容内容内。',
    roomName: '科教楼',
    startDate: '2019/11/11 周二 14:00',
    endDate: '2019/11/11 周二 16:00',
    totalPeople: {
      all: 25,
      takePart: 15,
      leave: 15,
      nofeedback: 15
    },
    signingNumber: 10,
    manualReview: 1,
    leaveRequest: 1
  }))

  const scroll = useRef(null)

  const changeValue = function (key, val) {
    dispatch({
      type: 'changeValue',
      value: {
        key,
        val
      }
    })
  }

  const setCheckModal = (bool) => {
    changeValue('checkInModal', bool)
  }

  useEffect(() => {
    document.title = '会议详情'
  }, [])

  const {
    checkInModal,
    title,
    status,
    date,
    designation,
    content,
    roomName,
    startDate,
    endDate,
    totalPeople,
    signingNumber,
    manualReview,
    leaveRequest
  } = data.toJS()

  return (
    <div className='scroll-view footer-reserved meeting-detail list-item-style'>
      <Scroll ref={scroll} bounceTop={false} bounceBottom={false}>
        <div>
          <div className='meet-detail-wrap'>
            <div className='ml-tbox'>
              <div className='ml-title'>{title}<span className='color4'>{status}</span></div>
              <div className='ml-date'><i className='date-icon' />{date}<span>{designation}</span></div>
            </div>
            <p className='ml-cont-text'>{content}</p>
            <div className='ml-file'>
              <p><img src={require('../../../images/f1.png')} alt='' /></p>
            </div>
          </div>
          <List className='meet-detail-bom list-beforeborder list-afterborder'>
            <Item extra={roomName}>会议室</Item>
            <Item extra={startDate}>开始时间</Item>
            <Item extra={endDate}>结束时间</Item>
            <Item
              className='item-afterborder am-list-extra-length'
              arrow='horizontal'
              extra={`参加(${totalPeople.takePart})请假(${totalPeople.leave})未反馈(${totalPeople.nofeedback})`}
              onClick={() => props.history.push('/meeting-participant/1234')}
            >总参会人数:{totalPeople.all}</Item>
            <Item
              extra={`${signingNumber}人已签到`}
              arrow='horizontal'
              onClick={() => props.history.push('/meeting-signsituation/1234')}
            >签到情况</Item>
            <Item
              extra={<Badge text={manualReview}
                overflowCount={1000}
              />}
              onClick={() => props.history.push('/meeting-manualreview/1234')}
            >人工审核</Item>
            <Item
              extra={<Badge text={leaveRequest}
                overflowCount={1000}
              />}
              onClick={() => props.history.push('/meeting-approval/1234')}
            >请假申请</Item>
          </List>
          <div className='placeholder_div' />
          <div className='tab-button-darkgray-small tab-button-block'>结束会议</div>
          <div className='placeholder_div' />
        </div>
      </Scroll>
      {/* <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue current straight'>申请临时加入</button>
            <button type='button' className='tab-button-blue current straight'>查看会议报告</button>
          </div>
        </div>
      </div> */}
      <ul className='meeting-detail-foot'>
        {/* <li>
          <div><i className='takepart-icon' /></div>
          <p>确认参加</p>
        </li>
        <li>
          <div><i className='meeting-qd-icon' /></div>
          <p>签退</p>
        </li>
        <li>
          <div><i className='takepart-icon' /></div>
          <p>删除会议</p>
        </li> */}
        <li onClick={() => setCheckModal(true)}>
          <div><i className='meeting-qd-icon' /></div>
          <p>签到</p>
        </li>
        <li>
          <div><i className='leave-icon' /></div>
          <p>请假</p>
        </li>
        <li>
          <div><i className='editweeting-icon' /></div>
          <p>修改会议</p>
        </li>
        <li>
          <div><i className='closeweeting-icon' /></div>
          <p>关闭会议</p>
        </li>
      </ul>
      <CheckIn
        visible={checkInModal}
        status={1}
        changeVisible={setCheckModal}
      />
    </div>
  )
}

MeetingDetails.propTypes = {
  history: PropTypes.object
}

export default MeetingDetails
