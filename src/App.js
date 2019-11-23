import React, {
  useEffect
} from 'react'
import {
  HashRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toast } from 'antd-mobile'
import store from './store'

import Test from './test'
// 启动跳转页
import Startup from './pages/startup/startup'
// 首页
import Home from './pages/home/home'
// 事件处理列表
import Affair from './pages/affair/affair'
// 选择事件程度与类型
import SelectType from './pages/ceateevent/selecttype'
// 事件提交
import EventSubmit from './pages/ceateevent/eventsubmit'
// 事件详情状态
import EventProcess from './pages/ceateevent/eventprocess'
// 投诉建议
import ComplaintSubmit from './pages/ceateevent/complaintsubmit'
// 投诉建议详情状态
import complaintProcess from './pages/ceateevent/complaintprocess'
// 值班日志和排班表
import Onduty from './pages/onduty/onduty'
// 创建值班
import CreateAttendance from './pages/onduty/create/create'
// 值班状态
import attProcess from './pages/onduty/process/process'
// 事件性质
import TimeLimit from './pages/timelimit/timelimit'
// 无模板
import NotPermission from './pages/notpermission/notpermission'
// 会议助手
import Meeting from './pages/meeting'
// 选择会议模板
import MeetingModule from './pages/meeting/templet'
// 自定义会议
import MeetingDelimit from './pages/meeting/delimit'
// 积分
import Integral from './pages/meeting/integral'
// 会议详情
import MeetingDetails from './pages/meeting/detail'
// 参会人员情况
import Participant from './pages/meeting/detail/participant'
// 签到情况
import SignSituation from './pages/meeting/detail/signsituation'
// 人工审核
import ManualReview from './pages/meeting/detail/manualreview'
// 人工审批
import Approval from './pages/meeting/detail/approval'
// 选择会议室
import SelectRoom from './pages/meeting/room/select'

function App () {
  useEffect(() => {
    window.addEventListener('online', function () {
      Toast.info('网络已恢复', 1)
    })

    window.addEventListener('offline', function () {
      Toast.info('暂无网络', 1)
    })
  }, [])

  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path='/test' component={Test} />
          <Route path='/page' component={Startup} />
          <Route path='/home' component={Home} />
          <Route path='/affair' component={Affair} />
          <Route path='/selecttype' component={SelectType} />
          <Route path='/eventsubmit' component={EventSubmit} />
          <Route path='/eventprocess' component={EventProcess} />
          <Route path='/complaintsubmit' component={ComplaintSubmit} />
          <Route path='/complaintprocess' component={complaintProcess} />
          <Route path='/onduty' component={Onduty} />
          <Route path='/createattendance' component={CreateAttendance} />
          <Route path='/attprocess' component={attProcess} />
          <Route path='/timelimit' component={TimeLimit} />
          <Route path='/notpermission' component={NotPermission} />
          <Route path='/meeting' component={Meeting} />
          <Route path='/meeting-module' component={MeetingModule} />
          <Route path='/meeting-delimit' component={MeetingDelimit} />
          <Route path='/integral' component={Integral} />
          <Route path='/meeting-detail/:id' component={MeetingDetails} />
          <Route path='/meeting-participant/:id' component={Participant} />
          <Route path='/meeting-signsituation/:id' component={SignSituation} />
          <Route path='/meeting-manualreview/:id' component={ManualReview} />
          <Route path='/meeting-approval/:id' component={Approval} />
          <Route path='/selectroom' component={SelectRoom} />
          <Redirect to='/home' />
        </Switch>
        <span id='prev-router' className='prev-tool' onClick={() => window.history.back(-1)}>返回</span>
      </HashRouter>
    </Provider>
  )
}

export default App
