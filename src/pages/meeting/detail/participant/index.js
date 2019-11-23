import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import {
  Tabs
} from 'antd-mobile'
import './style.scss'

function MeetingRoom (props) {
  const [tab] = useState([
    {
      icon: 'mt-partake-icon',
      title: <span className='am-badge'>参加(12)</span>,
      sub: '1'
    },
    {
      icon: 'mt-askforleave-icon',
      title: <span className='am-badge'>请假(6)</span>,
      sub: '2'
    },
    {
      icon: 'mt-feedback-icon',
      title: <span className='am-badge'>未反馈(3)</span>,
      sub: '3'
    }
  ])

  const tabChange = function (tabs) {
    console.log(tabs)
  }

  useEffect(() => {
    document.title = '报名情况'
  }, [])

  return (
    <div className='participant-view'>
      <Tabs
        prefixCls='tab-style'
        animated={false}
        tabs={tab}
        onChange={(tabs) => tabChange(tabs)}
        renderTab={tab => <><i className={tab.icon} /><span>{tab.title}</span></>}
      />
      <ul className='meetting-avatar-area'>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
        <li>
          <i className='pt-avatar' />
          <p className='pt-name'>诸葛九九</p>
        </li>
      </ul>
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue normal straight' onClick={() => props.history.go(-1)}>返回</button>
          </div>
        </div>
      </div>
    </div>
  )
}

MeetingRoom.propTypes = {
  history: PropTypes.object
}

export default MeetingRoom
