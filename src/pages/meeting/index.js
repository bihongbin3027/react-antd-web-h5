import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import TabBar from '@/components/tabbar/tabbar'
import ContentNav from '@/components/contentnav/contentnav'
import MeetingList from './list'
import MeetingRoom from './room'

function Meeting ({ match, history }) {
  const { path } = match
  const tab = [
    {
      icon: 'myhuiyi',
      text: '我的会议',
      url: 'list'
    },
    {
      text: '',
      type: 'add',
      url: ''
    },
    {
      icon: 'huiyishi',
      text: '会议室',
      url: 'room'
    }
  ]
  const add = [
    {
      templateType: 5,
      templateId: '',
      text: '选择会议模板',
      value: '#/meeting-module'
    },
    {
      templateType: 6,
      templateId: '',
      text: '自定义',
      value: '#/meeting-delimit'
    }
  ]

  return (
    <Fragment>
      <ContentNav foot>
        <Route path={`${path}/list`} component={MeetingList} />
        <Route path={`${path}/room`} component={MeetingRoom} />
      </ContentNav>
      <TabBar tab={tab} match={match} history={history} add={add} />
    </Fragment>
  )
}

Meeting.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default Meeting
