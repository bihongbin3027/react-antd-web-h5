import React, {
  useEffect,
  useReducer
} from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import DateUl from '@/components/dateul'
import moment from 'moment'
import './style.scss'

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return action.value
    default:
      return state
  }
}

function MeetingRoom (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    time: moment().format('YYYY-MM-DD')
  }))

  // eslint-disable-next-line
  const changeValue = function (key, val) {
    dispatch({
      type: 'changeValue',
      value: data.set(key, val)
    })
  }

  const changeDay = (v) => {
    console.log('v', v)
  }

  useEffect(() => {
    document.title = '会议助手'
  }, [])

  return (
    <div className='meeting-room'>
      <DateUl
        onChange={changeDay}
      />
      <div className='room-ul-dv'>
        <ul>
          <li>
            <div className='dv-button'>
              <span className='dv-name'>科教楼305</span>
            </div>
            <p><i className='yuding-icon' />已预定</p>
            <p className='dv-date'>11:30-12:30<em>|</em>14:00-16:30<em>|</em>15:00-17:30</p>
          </li>
          <li>
            <div className='dv-button'>
              <span className='dv-name'>科教楼305</span>
              <button
                className='tab-button-blue-small'
                type='button'
                onClick={() => props.history.push({
                  pathname: '/meeting-delimit',
                  search: 'selectRoomId=1234'
                })}
              >预定</button>
            </div>
            <p>未预定</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

MeetingRoom.propTypes = {
  history: PropTypes.object
}

export default MeetingRoom
