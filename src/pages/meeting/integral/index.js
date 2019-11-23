import React, {
  useEffect,
  useReducer
} from 'react'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { List, Radio, Picker, Switch } from 'antd-mobile'
import './style.scss'

const Item = List.Item
const RadioItem = Radio.RadioItem

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return action.value
    default:
      return state
  }
}

function Integral (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    checkInList: [
      { label: '签到+签退', value: 1 },
      { label: '仅签退', value: 2 }
    ],
    checkInValue: [1],
    // 学分
    creditData: [
      { label: '+1', value: 1 },
      { label: '+2', value: 2 },
      { label: '+3', value: 3 },
      { label: '+4', value: 4 },
      { label: '+5', value: 5 }
    ],
    creditValue: [1],
    // 扣分项开关
    deductionVisible: false,
    // 迟到扣分开关
    lateDeductionDisable: false,
    // 迟到时长
    durationData: [
      { label: '5分钟', value: 5 },
      { label: '10分钟', value: 10 },
      { label: '15分钟', value: 15 },
      { label: '30分钟', value: 30 }
    ],
    durationValue: [5],
    // 迟到学分
    lateCreditData: [
      { label: '-1', value: -1 },
      { label: '-2', value: -2 },
      { label: '-3', value: -3 },
      { label: '-4', value: -4 },
      { label: '-5', value: -5 }
    ],
    lateCreditValue: [-1],
    // 请假扣分开关
    leaveVisible: false,
    // 请假学分
    leaveValue: [-1]
  }))

  const changeValue = (key, val) => {
    dispatch({
      type: 'changeValue',
      value: data.set(key, val)
    })
  }

  const onOk = () => {
    props.history.go(-1)
  }

  useEffect(() => {
    document.title = '积分设置'
  }, [])

  const {
    checkInList,
    checkInValue,
    creditData,
    creditValue,
    deductionVisible,
    lateDeductionDisable,
    durationData,
    durationValue,
    lateCreditData,
    lateCreditValue,
    leaveVisible,
    leaveValue
  } = data.toJS()

  return (
    <div className='scroll-view meeting-integral list-item-style'>
      <List className='list-beforeborder list-afterborder'>
        {
          checkInList.map(ckn => (
            <RadioItem
              checked={checkInValue[0] === ckn.value}
              onChange={() => changeValue('checkInValue', [ckn.value])}
              key={ckn.value}
            >{ckn.label}</RadioItem>
          ))
        }
        <Picker
          cols={1}
          data={creditData}
          value={creditValue}
          onChange={(v) => {
            changeValue('creditValue', v)
          }}
        >
          <Item arrow='horizontal'>
            学分
          </Item>
        </Picker>
      </List>
      <List className='list-item-switch list-beforeborder list-afterborder'>
        <Item
          className='switch-small'
          extra={<Switch
            checked={deductionVisible}
            onChange={() => {
              changeValue('deductionVisible', !deductionVisible)
            }}
          />}
        ><i className='deduction-icon' />扣分项</Item>
      </List>
      {
        deductionVisible && (
          <>
            <List className='list-beforeborder list-afterborder'>
              <Item
                className='switch-small'
                extra={<Switch
                  checked={lateDeductionDisable}
                  onChange={() => {
                    changeValue('lateDeductionDisable', !lateDeductionDisable)
                  }}
                />}
              >迟到扣分</Item>
              {
                lateDeductionDisable && (
                  <>
                    <Picker
                      cols={1}
                      data={durationData}
                      value={durationValue}
                      onChange={(v) => {
                        changeValue('durationValue', v)
                      }}
                    >
                      <Item arrow='horizontal'>
                        时长
                      </Item>
                    </Picker>
                    <Picker
                      cols={1}
                      data={lateCreditData}
                      value={lateCreditValue}
                      onChange={(v) => {
                        changeValue('lateCreditValue', v)
                      }}
                    >
                      <Item arrow='horizontal'>
                        学分
                      </Item>
                    </Picker>
                  </>
                )
              }
            </List>
            <List className='list-beforeborder list-afterborder leave'>
              <Item
                className='switch-small'
                extra={<Switch
                  checked={leaveVisible}
                  onChange={() => {
                    changeValue('leaveVisible', !leaveVisible)
                  }}
                />}
              >请假扣分</Item>
              {
                leaveVisible && (
                  <Picker
                    cols={1}
                    data={lateCreditData}
                    value={leaveValue}
                    onChange={(v) => {
                      changeValue('leaveValue', v)
                    }}
                  >
                    <Item arrow='horizontal'>
                      学分
                    </Item>
                  </Picker>
                )
              }
            </List>
          </>
        )
      }
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue current straight' onClick={onOk}>确定</button>
          </div>
        </div>
      </div>
    </div>
  )
}

Integral.propTypes = {
  history: PropTypes.object
}

export default Integral
