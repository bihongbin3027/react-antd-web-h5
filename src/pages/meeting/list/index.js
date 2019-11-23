import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Tabs,
  Badge,
  Icon,
  Popover,
  Modal,
  Toast
} from 'antd-mobile'
import MeScroll from 'mescroll.js'
import {
  changeMeetingTab,
  refreshMoreGetMeetingList,
  reviseList,
  deleteList
} from './store/actionCreators'
import './style.scss'

const PopoverItem = Popover.Item

function MeetingList (props) {
  const [tab] = useState([
    {
      icon: 'mt-all-icon',
      title: <Badge text={'3'}>全部</Badge>,
      sub: '1'
    },
    {
      icon: 'mt-pending-icon',
      title: <Badge text={'2'}>待参与</Badge>,
      sub: '2'
    },
    {
      icon: 'mt-related-icon',
      title: <Badge>审核中</Badge>,
      sub: '3'
    },
    {
      icon: 'mt-my-icon',
      title: <Badge>我发布的</Badge>,
      sub: '4'
    }
  ])

  const mescroll = useRef(null)

  const {
    tabIndex,
    meetingList
  } = props

  const {
    clickTabListDispatch,
    pullUpRefreshDispatch,
    reviseListDispatch,
    deleteListDispatch
  } = props

  const tabChange = function (tabs) {
    clickTabListDispatch(tabs.sub)
    mescroll.current.scrollTo(0, 0)
    mescroll.current.resetUpScroll(true)
  }

  const operationType = function (type) {
    const meetingType = [
      { name: '修改会议', value: 0 },
      { name: '结束会议', value: 1 },
      { name: '关闭会议', value: 2 },
      { name: '删除会议', value: 3 }
    ]
    return meetingType.map(({ name, value }, i) => (
      <PopoverItem className='select-popover' key={i} value={value}>{name}</PopoverItem>
    ))
  }

  const selectPopover = (opt, index) => {
    const { props: parm } = opt
    const ModalFunc = function (title, toast, fn) {
      Modal.alert('', title, [
        {
          text: '取消',
          onPress: () => {}
        },
        {
          text: '确定',
          onPress: () => {
            if (fn) {
              fn()
            }
            Toast.success(toast, 1)
          }
        }
      ])
    }
    reviseListDispatch('visible', index, false)
    // 修改会议
    if (parm.value === 0) {
      nextDetail()
    }
    if (parm.value === 1) {
      ModalFunc('确定结束会议吗？', '已结束', function () {
        reviseListDispatch('type', index, '-1')
      })
    }
    if (parm.value === 2) {
      ModalFunc('确定关闭会议吗？', '已关闭', function () {
        reviseListDispatch('type', index, '-2')
      })
    }
    if (parm.value === 3) {
      ModalFunc('确定删除会议吗？', '已删除', function () {
        deleteListDispatch(index)
      })
    }
  }

  const changePopover = (visible, index) => {
    reviseListDispatch('visible', index, visible)
  }

  const nextDetail = () => {
    props.history.push('/meeting-detail/1234')
  }

  useEffect(() => {
    document.title = '会议助手'
    const upCallback = function (page) {
      pullUpRefreshDispatch(page, function (resList, resPages) {
        mescroll.current.endByPage(resList.length, resPages)
      })
    }
    mescroll.current = new MeScroll('mescroll', {
      up: {
        callback: upCallback,
        noMoreSize: 10,
        htmlNodata: '<p class="upwarp-nodata">-- 无更多 --</p>',
        toTop: {
          src: require('@/images/mescroll-totop.png'),
          offset: 650
        },
        empty: {
          warpId: 'nodata',
          icon: require('@/images/no_result.png'),
          tip: ''
        },
        clearId: 'nodata'
      }
    })
    return function () {
      mescroll.current.destroy()
    }
  }, [pullUpRefreshDispatch])

  const list = meetingList ? meetingList.toJS() : []

  return (
    <div>
      <Tabs
        prefixCls='tab-style'
        animated={false}
        initialPage={tabIndex}
        tabs={tab}
        onChange={(tabs) => tabChange(tabs)}
        renderTab={tab => <><i className={tab.icon} /><span>{tab.title}</span></>}
      />
      <div className='meeting-list'>
        <div id='mescroll' className='mescroll'>
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li className={index === 0 ? 'close-li' : ''} key={index}>
                    <div className='mt-top' onClick={() => nextDetail()}>
                      <span className='mt-name font-16'>{item.content}</span>
                      <span className={`mt-status color${index}`}>待开始</span>
                    </div>
                    <Popover
                      visible={item.visible}
                      overlayClassName='popover-overlay'
                      overlay={operationType(item.type)}
                      align={{
                        offset: [0, -2]
                      }}
                      onVisibleChange={v => changePopover(v, index)}
                      onSelect={v => selectPopover(v, index)}
                    >
                      <div className='mt-more'>
                        <Icon type='ellipsis' color='#999' />
                      </div>
                    </Popover>
                    <div className='mt-foot' onClick={() => nextDetail()}>
                      <span>2019-09-09</span>
                      <span>周二</span>
                      <span><i className='ts-date-icon' />14:00-15:30</span>
                      <span>1小时15分钟</span>
                      <span><i className='ts-tq-icon' />25人</span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <div id='nodata' />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  tabIndex: state.getIn(['meetingList', 'tabIndex']),
  meetingList: state.getIn(['meetingList', 'meetingList'])
})

const mapDispatchToProps = (dispatch) => {
  return {
    clickTabListDispatch (sub) {
      dispatch(changeMeetingTab(sub))
    },
    pullUpRefreshDispatch (page, fn) {
      dispatch(refreshMoreGetMeetingList(page, fn))
    },
    reviseListDispatch (name, index, visible) {
      dispatch(reviseList(name, index, visible))
    },
    deleteListDispatch (index) {
      dispatch(deleteList(index))
    }
  }
}

MeetingList.propTypes = {
  history: PropTypes.object,
  tabIndex: PropTypes.number,
  meetingList: PropTypes.object,
  clickTabListDispatch: PropTypes.func,
  pullUpRefreshDispatch: PropTypes.func,
  reviseListDispatch: PropTypes.func,
  deleteListDispatch: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(MeetingList))
