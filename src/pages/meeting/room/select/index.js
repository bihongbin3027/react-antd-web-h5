import React, {
  useReducer
} from 'react'
import { fromJS } from 'immutable'
import {
  List,
  Switch
} from 'antd-mobile'
import PropTypes from 'prop-types'
import LocationModal from '@/components/locationmodal'
import './style.scss'

const Item = List.Item

function reducer (state, action) {
  switch (action.type) {
    case 'changeValue':
      return state.set(action.value.key, action.value.val)
    default:
      return state
  }
}

function SelectRoom (props) {
  const [data, dispatch] = useReducer(reducer, fromJS({
    liIndex: null,
    list: [
      { name: '科教楼301', content: '深圳市龙岗区北京中医药大学深圳医院科教楼三楼301' },
      { name: '科教楼302', content: '深圳市龙岗区北京中医药大学深圳医院科教楼三楼302' }
    ],
    // 创建临时会议开关
    temporarySwitch: false,
    // 地址详情
    address: '',
    // 范围
    range: [
      { text: '50米', value: 50 },
      { text: '100米', value: 100 },
      { text: '200米', value: 200 },
      { text: '100米', value: 300 },
      { text: '500米', value: 500 }
    ],
    rangeIndex: 0,
    // 定位层
    locationVisble: false,
    // 定位地址
    locations: {
      address: '暂无地址'
    }
  }))

  const setVisible = (bool) => {
    dispatch({
      type: 'changeValue',
      value: {
        key: 'locationVisble',
        val: bool
      }
    })
  }

  const activeList = (item, index) => {
    dispatch({
      type: 'changeValue',
      value: {
        key: 'liIndex',
        val: index
      }
    })
    dispatch({
      type: 'changeValue',
      value: {
        key: 'temporarySwitch',
        val: false
      }
    })
  }

  const mapAddress = (loc) => {
    dispatch({
      type: 'changeValue',
      value: {
        key: 'locations',
        val: loc
      }
    })
  }

  const {
    liIndex,
    list,
    temporarySwitch,
    address,
    range,
    rangeIndex,
    locationVisble,
    locations
  } = data.toJS()

  return (
    <div className='scroll-view footer-reserved select-room list-item-style'>
      <ul>
        {
          list.map((item, index) => (
            <li
              className={index === liIndex ? 'active' : null}
              onClick={() => activeList(item, index)}
              key={index}
            >
              <div className='sr-name'>{item.name}</div>
              <p>{item.content}</p>
            </li>
          ))
        }
      </ul>
      <List className='list-item-switch list-beforeborder list-afterborder'>
        <Item
          className='switch-small'
          extra={<Switch
            checked={temporarySwitch}
            onChange={() => {
              dispatch({
                type: 'changeValue',
                value: {
                  key: 'temporarySwitch',
                  val: !temporarySwitch
                }
              })
              if (!temporarySwitch) {
                dispatch({
                  type: 'changeValue',
                  value: {
                    key: 'liIndex',
                    val: null
                  }
                })
              }
            }}
          />}
        ><i className='linshi-icon' />创建临时会议</Item>
      </List>
      {
        temporarySwitch && (
          <div className='rm-range'>
            <div className='rm-address'>
              <p>{locations.address}</p>
              <span onClick={() => {
                dispatch({
                  type: 'changeValue',
                  value: {
                    key: 'locationVisble',
                    val: true
                  }
                })
              }}><i className='gps-icon' />定位地址</span>
            </div>
            <div className='rm-ads-detail'>
              地址详情：<input value={address} onChange={(e) => {
                dispatch({
                  type: 'changeValue',
                  value: {
                    key: 'address',
                    val: e.target.value
                  }
                })
              }} placeholder='请输入地址详情' />
            </div>
            <div className='rm-range-ol'>
              <div>范围：</div>
              <ol>
                {
                  range.map((item, index) => (
                    <li
                      className={`tab-button-blue-small ${rangeIndex === index ? 'current' : ''}`}
                      onClick={() => {
                        dispatch({
                          type: 'changeValue',
                          value: {
                            key: 'rangeIndex',
                            val: index
                          }
                        })
                      }}
                      key={index}
                    >{item.text}</li>
                  ))
                }
              </ol>
            </div>
          </div>
        )
      }
      <div className='layout-footer'>
        <div className='event-foot'>
          <div>
            <button type='button' className='tab-button-blue white straight' onClick={() => props.history.go(-1)}>返回</button>
          </div>
          <div>
            <button type='button' className='tab-button-blue current straight'>确定</button>
          </div>
        </div>
      </div>
      <LocationModal
        visible={locationVisble}
        ranges={range[rangeIndex].value}
        setVisible={setVisible}
        onChange={mapAddress}
      />
    </div>
  )
}

SelectRoom.propTypes = {
  history: PropTypes.object
}

export default SelectRoom
