import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import MeScroll from 'mescroll.js'
import API from '@/api/api'
import { loadFromLocal } from '@/utils/index'
import './workcenter.scss'

function WorkCenter ({ history }) {
  const [tabEntrance, setTabEntrance] = useState([])
  const [userInfo] = useState(loadFromLocal('h5', 'userInfo'))
  const [data, setData] = useState([])
  const mescroll = useRef(null)
  const handleStatusSwitch = (value) => {
    let obj = {}
    switch (value) {
      case 0:
        obj.text = '待处理'
        obj.className = 'color1'
        break
      case 1:
        obj.text = '草稿'
        obj.className = 'color3'
        break
      case 2:
        obj.text = '进行中'
        obj.className = 'color4'
        break
      case 3:
        obj.text = '已处理'
        obj.className = 'color2'
        break
      case 4:
        obj.text = '不处理'
        obj.className = 'color3'
        break
      default:
        break
    }
    return obj
  }
  const entrancePath = ({ path }) => {
    if (path) {
      history.push(path)
    } else {
      Toast.info('敬请期待', 1)
    }
  }
  const nextDetail = (id, typeCode) => {
    let path = {}
    // typeCode 1事务处理 2投诉建议 3行政日志 4投诉日志
    if (typeCode === 1) {
      path = {
        pathname: '/eventprocess',
        search: `id=${id}`
      }
    } else if (typeCode === 2) {
      path = {
        pathname: '/complaintprocess',
        search: `id=${id}`
      }
    } else {
      path = {
        pathname: '/attprocess',
        search: `id=${id}`
      }
    }
    history.push(path)
  }

  useEffect(() => {
    function templateList () {
      if (userInfo) {
        const { modules } = userInfo
        let topMenu = []
        if (modules) {
          for (let i = 0, ilen = modules.length; i < ilen; i++) {
            const { type } = modules[i]
            // 事务处理模块
            if (type === 1) {
              topMenu.push({
                icon: 'general-affairs',
                path: '/affair/list',
                text: '事务处理'
              })
            }
            // 总值值班
            if (type === 2) {
              topMenu.push({
                icon: 'totalvalue-duty',
                path: '/onduty/dutylog',
                text: '总值值班'
              })
            }
          }
        }
        setTabEntrance(topMenu)
        setTabEntrance(() => {
          return topMenu.concat([
            {
              icon: 'work-report',
              path: '/meeting/list',
              text: '会议助手'
            }
          ])
        })
      }
    }
    templateList()
  }, [userInfo])

  useEffect(() => {
    document.title = '工作中心'
    async function upCallback (page) {
      const query = {
        page: page.num,
        pageSize: page.size
      }
      const result = await API.getWaitCandleTask(query)
      let curPageData = result.dataList
      let totalPage = result.pages
      mescroll.current.endByPage(curPageData.length, totalPage)
      setData((prev) => {
        if (page.num === 1) {
          return result.dataList
        } else {
          return [...prev, ...result.dataList]
        }
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
  }, [])

  return (
    <div className='workcenter-view'>
      <ul className='tab-entrance'>
        {
          tabEntrance.map((item, index) => (
            <li key={index} onClick={() => entrancePath(item)}>
              <i className={`${item.icon}-icon`} />
              <span>{item.text}</span>
            </li>
          ))
        }
      </ul>
      <dl className='todo-item'>
        <dt><i className='daiban-icon' />待办事项</dt>
        <dd>
          <div id='mescroll' className='mescroll' style={{ position: 'fixed', top: 160, bottom: 50, height: 'auto' }}>
            <div style={{ paddingLeft: 12, paddingRight: 12, backgroundColor: '#fff' }}>
              <table className='table'>
                <tbody>
                  {
                    data.map(({ id, type, level, handoverPerson, handoverStatusName, handoverStatus, moduleName, createTime, typeCode }, index) => (
                      <tr onClick={() => nextDetail(id, typeCode)} key={index}>
                        <td className='font-16' width='90'>{type}</td>
                        <td className={`text-center ${handleStatusSwitch(handoverStatus).className}`}>
                          <span className='font-min'>{handoverStatusName}</span>
                        </td>
                        <td className='text-center color3'>
                          <span className='font-min'>{handoverPerson}</span>
                        </td>
                        <td className='text-right color3 font-12' width='80'>{createTime}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div id='nodata' />
          </div>
        </dd>
      </dl>
    </div>
  )
}

WorkCenter.propTypes = {
  history: PropTypes.object.isRequired
}

export default WorkCenter
