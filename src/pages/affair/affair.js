import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import TabBar from '@/components/tabbar/tabbar'
import ContentNav from '@/components/contentnav/contentnav'
import List from './list/list'
import MyJob from '../home/myjob/myjob'
import { loadFromLocal } from '@/utils/index'

function Home ({ match, history }) {
  const { path } = match
  const tab = [
    {
      icon: 'workcenter',
      text: '工作列表',
      url: 'list'
    },
    {
      text: '',
      type: 'add',
      url: ''
    },
    {
      icon: 'myjob',
      text: '个人中心',
      url: 'myjob'
    }
  ]
  let add = []
  const userInfo = loadFromLocal('h5', 'userInfo')

  if (userInfo) {
    const { modules } = userInfo
    if (modules) {
      for (let i = 0, ilen = modules.length; i < ilen; i++) {
        const { templateList } = modules[i]
        // 事务处理模块
        if (modules[i].type === 1) {
          for (let k = 0, klen = templateList.length; k < klen; k++) {
            const { id, templateType, templateName, permissionList } = templateList[k]
            // 事务处理
            if (templateType === 1) {
              for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                if (permissionList[w].name === '新建事务') {
                  add.push({
                    templateType,
                    templateId: id,
                    text: templateName,
                    value: '#/selecttype'
                  })
                  break
                }
              }
            }
            // 投诉建议
            if (templateType === 2) {
              for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                if (permissionList[w].name === '新建事务') {
                  add.push({
                    templateType,
                    templateId: id,
                    text: templateName,
                    value: '#/complaintsubmit'
                  })
                  break
                }
              }
            }
          }
          break
        }
      }
      if (!add.length) {
        tab.splice(1, 1)
      }
    }
  }

  return (
    <Fragment>
      <ContentNav foot>
        <Route path={`${path}/list`} component={List} />
        <Route path={`${path}/myjob`} component={MyJob} />
      </ContentNav>
      <TabBar tab={tab} match={match} history={history} add={add} />
    </Fragment>
  )
}

Home.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default Home
