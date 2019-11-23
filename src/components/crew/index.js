import React, {
  useReducer,
  useEffect
} from 'react'
import {
  Tabs,
  Modal
} from 'antd-mobile'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import _ from 'lodash'
import StaffModal from '@/components/staffmodal/staffmodal'
import Scroll from '@/components/scroll'
import API from '@/api/api'
import './style.scss'

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return state.set(action.value.key, action.value.val)
    default:
      return state
  }
}

function Crew (props) {
  const { onChange, setVisible } = props
  const { visible, list, title } = props

  const [data, dispatch] = useReducer(reducer, fromJS({
    // tab
    tab: [
      {
        icon: 'mt-pending-review-icon',
        title: <span className='am-badge'>{title}</span>,
        sub: '1'
      }
    ],
    // 人员弹窗打开关闭
    staffVisible: false,
    // 人员数据
    staffList: [],
    // 默认人员
    dutyNormal: []
  }))

  const resetTitle = (l) => {
    dispatch({
      type: 'changeValue',
      value: {
        key: 'tab',
        val: [
          {
            icon: 'mt-pending-review-icon',
            title: <span className='am-badge'>{`${title.split('(')[0]}(${l.length})`}</span>,
            sub: '1'
          }
        ]
      }
    })
  }

  const staffConfirm = () => {
    // 去掉重复
    const newList = _.uniqBy([...list, ...data.toJS().dutyNormal], 'userId')
    onChange(newList)
    resetTitle(newList)
    dispatch({
      type: 'changeValue',
      value: {
        key: 'staffVisible',
        val: false
      }
    })
  }

  // 人员弹窗选择的人员
  const staffSelect = (l) => {
    dispatch({
      type: 'changeValue',
      value: {
        key: 'dutyNormal',
        val: l
      }
    })
  }

  // 移除人员
  const removeStaff = (index) => {
    const newList = list.filter((k, i) => i !== index)
    onChange(newList)
    resetTitle(newList)
  }

  useEffect(() => {
    async function getTreeDeptAndUserList () {
      const treeList = await API.getTreeDeptAndUserList({
        username: ''
      })
      dispatch({
        type: 'changeValue',
        value: {
          key: 'staffList',
          val: treeList
        }
      })
    }
    getTreeDeptAndUserList()
  }, [])

  const {
    tab,
    staffList,
    staffVisible
  } = data.toJS()

  return (
    <div
      className='scroll-view footer-reserved modal-style-view crew-view padding-none'
      style={{ 'display': visible ? 'block' : 'none' }}
    >
      <Tabs
        prefixCls='tab-style'
        animated={false}
        tabs={tab}
        renderTab={tab => <><i className={tab.icon} /><span>{tab.title}</span></>}
      />
      <div className='crew-ul-fixed'>
        <Scroll>
          <ul className='meetting-avatar-area'>
            {
              list.map((item, index) => (
                <li key={index}>
                  <i className='pt-avatar' />
                  <p className='pt-name'>{item.name}</p>
                  <em onClick={() => removeStaff(index)} className='refuse-icon' />
                </li>
              ))
            }
          </ul>
        </Scroll>
      </div>
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button
              type='button'
              className='tab-button-blue white straight'
              onClick={() => setVisible(false)}
            >返回</button>
          </div>
          <div>
            <button
              type='button'
              className='tab-button-blue current straight' onClick={() => {
                dispatch({
                  type: 'changeValue',
                  value: {
                    key: 'staffVisible',
                    val: true
                  }
                })
              }}
            >继续添加</button>
          </div>
        </div>
      </div>
      <Modal
        title='请选择人员'
        visible={staffVisible}
        closable
        transparent
        onClose={() => {
          dispatch({
            type: 'changeValue',
            value: {
              key: 'staffVisible',
              val: false
            }
          })
        }}
        footer={[{ text: '确定', onPress: () => { staffConfirm() } }]}
      >
        <StaffModal select={staffSelect} list={staffList} />
      </Modal>
    </div>
  )
}

Crew.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  list: PropTypes.array,
  onChange: PropTypes.func
}

export default Crew
