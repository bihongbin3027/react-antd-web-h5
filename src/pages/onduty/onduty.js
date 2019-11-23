import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import TabBar from '@/components/tabbar/tabbar'
import ContentNav from '@/components/contentnav/contentnav'
import DutyLog from './dutylog/dutylog'
import Schedule from './schedule/schedule'
import { loadFromLocal } from '@/utils/index'

function Home ({ match, history }) {
  const { path } = match
  const tab = [
    {
      icon: 'dutylog',
      text: '值班日志',
      url: 'dutylog'
    },
    {
      text: '',
      type: 'add',
      url: ''
    },
    {
      icon: 'schedule',
      text: '排班表',
      url: 'schedule'
    }
  ]
  let add = []
  const userInfo = loadFromLocal('h5', 'userInfo')

  if (userInfo) {
    const { modules } = userInfo
    if (modules) {
      for (let i = 0, ilen = modules.length; i < ilen; i++) {
        const { templateList } = modules[i]
        // 总值值班模块
        if (modules[i].type === 2) {
          for (let k = 0, klen = templateList.length; k < klen; k++) {
            const { id, templateType, templateName, permissionList } = templateList[k]
            // 行政处理
            if (templateType === 3) {
              for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                if (permissionList[w].name === '新建日志') {
                  add.push({
                    templateId: id,
                    text: templateName,
                    value: '#/createattendance?watchLogType=3'
                  })
                  break
                }
              }
            }
            // 投诉建议
            if (templateType === 4) {
              for (let w = 0, wlen = permissionList.length; w < wlen; w++) {
                if (permissionList[w].name === '新建日志') {
                  add.push({
                    templateId: id,
                    text: templateName,
                    value: '#/createattendance?watchLogType=4'
                  })
                  break
                }
              }
            }
          }
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
        <Route path={`${path}/dutylog`} component={DutyLog} />
        <Route path={`${path}/schedule`} component={Schedule} />
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
