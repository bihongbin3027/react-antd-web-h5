import * as actionTypes from './constants'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  tabIndex: 0,
  meetingList: [],
  enterLoading: true
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_MEETING_TAB:
      return state.set('tabIndex', action.data)
    case actionTypes.CHANGE_MEETING_LIST:
      return state.set('meetingList', action.data)
    case actionTypes.CHANGE_MEETING_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}
