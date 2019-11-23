import { combineReducers } from 'redux-immutable'
import { reducer as meetingListReducer } from '@/pages/meeting/list/store'

export default combineReducers({
  meetingList: meetingListReducer
})
