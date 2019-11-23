import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import {
  Tabs,
  Modal,
  Toast
} from 'antd-mobile'

function Approval (props) {
  const [tab] = useState([
    {
      icon: 'mt-pending-review-icon',
      title: <span className='am-badge'>待审批(12)</span>,
      sub: '1'
    },
    {
      icon: 'mt-audited-icon',
      title: <span className='am-badge'>已审批(6)</span>,
      sub: '2'
    },
    {
      icon: 'mt-checkedno-icon',
      title: <span className='am-badge'>不通过(0)</span>,
      sub: '3'
    }
  ])

  const tabChange = function (tabs) {
    console.log(tabs)
  }

  const agreeChange = function (index) {
    Modal.alert('', '确认审批通过吗？', [
      {
        text: '取消',
        onPress: () => {}
      },
      {
        text: '确定',
        onPress: () => {
          Toast.success('已通过', 1)
        }
      }
    ])
  }

  const refuseChange = function (index) {
    Modal.alert('', '确认拒绝吗？', [
      {
        text: '取消',
        onPress: () => {}
      },
      {
        text: '确定',
        onPress: () => {
          Toast.success('已拒绝', 1)
        }
      }
    ])
  }

  useEffect(() => {
    document.title = '人工审批'
  }, [])

  return (
    <div className='approval-view'>
      <Tabs
        prefixCls='tab-style'
        animated={false}
        tabs={tab}
        onChange={(tabs) => tabChange(tabs)}
        renderTab={tab => <><i className={tab.icon} /><span>{tab.title}</span></>}
      />
      <ul className='meetting-list-area'>
        <li>
          <div className='meetting-listrow'>
            <div className='list-photo' />
            <div className='list-user-dtl'>
              <div className='list-dtl-name'>张三<span>财务科</span></div>
              <div className='list-dtl-phone'>13088888888</div>
            </div>
            <div className='list-dtl-operat'>
              <i className='refuse-icon' onClick={() => refuseChange()} />
              <i className='agree-icon' onClick={() => agreeChange()} />
            </div>
          </div>
          <p className='list-dtl-p'>请假理由：由于某某原因，特向领导请假，望批准。由于某某原因，特向领导请假，望批准。由于某某原因，特向领导请假，望批准。</p>
        </li>
        <li>
          <div className='meetting-listrow'>
            <div className='list-photo' />
            <div className='list-user-dtl'>
              <div className='list-dtl-name'>张三<span>财务科</span></div>
              <div className='list-dtl-phone'>13088888888</div>
            </div>
            <div className='list-dtl-operat'>
              <span className='color2'>已审批</span>
            </div>
          </div>
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

Approval.propTypes = {
  history: PropTypes.object
}

export default Approval
