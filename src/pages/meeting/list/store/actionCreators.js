import API from '@/api/api'
import {
  CHANGE_MEETING_TAB,
  CHANGE_MEETING_LIST,
  CHANGE_MEETING_ENTER_LOADING
} from './constants'
import { fromJS } from 'immutable'

// 当前tab索引
export const changeMeetingTab = (index) => ({
  type: CHANGE_MEETING_TAB,
  data: Number(index) - 1
})

// 列表数据
export const changeMeetingList = (data) => ({
  type: CHANGE_MEETING_LIST,
  data: fromJS(data)
})

// 进场loading
export const changeMeetingEnterLoading = (data) => ({
  type: CHANGE_MEETING_ENTER_LOADING,
  data
})

// 修改list对应的状态
export const reviseList = (name, index, value) => {
  return (dispatch, getState) => {
    const meetingList = getState().getIn(['meetingList', 'meetingList'])
    if (meetingList.get(index).toJS()[name] !== value) {
      dispatch(changeMeetingList(meetingList.update(index, item => {
        return item.set(name, value)
      })))
    }
  }
}

// 删除list对象的某一项
export const deleteList = (index) => {
  return (dispatch, getState) => {
    const meetingList = getState().getIn(['meetingList', 'meetingList'])
    dispatch(changeMeetingList(meetingList.delete(index)))
  }
}

// 获取列表
export const refreshMoreGetMeetingList = (page, fn) => {
  return (dispatch, getState) => {
    const params = {
      type: 1,
      dateMonth: '2019-11',
      page: page.num,
      pageSize: page.size
    }
    const tabIndex = getState().getIn(['meetingList', 'tabIndex'])
    const meetingList = getState().getIn(['meetingList', 'meetingList'])
    // params.tabIndex = tabIndex
    console.log('params上拉加载：', params)
    console.log('tabIndex', tabIndex)
    dispatch(changeMeetingEnterLoading(true))
    API.eventList(params).then(res => {
      let list = res.list.map(item => ({
        visible: false,
        ...item
      }))
      if (page.num === 1) {
        dispatch(changeMeetingList(list))
      } else {
        dispatch(changeMeetingList([...meetingList.toJS(), ...list]))
      }
      dispatch(changeMeetingEnterLoading(false))
      if (fn) {
        fn(list, res.pages)
      }
    })
  }
}
