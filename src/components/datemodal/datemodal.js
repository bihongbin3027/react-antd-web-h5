import React, {
  useState,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, PickerView } from 'antd-mobile'
import './datemodal.scss'

function DateModal ({ initTime, modalSelect, resetVisible, modalVisible }) {
  const [cascade, setCascade] = useState(false)
  const [dateInfo, setDateInfo] = useState(() => {
    let newInit = []
    let times = moment().format('YYYY/MM')
    let timeSplit = times.split('/')
    let regular = 2019
    let newTime = parseInt(timeSplit[0], 10)
    let computedTime = []
    let month = new Array(12).join(',').split(',')
    times = times.split('/')
    times = [times[0], times[1]]
    month = month.map((y, i) => {
      let val = 0
      let j = i + 1
      if (j < 10) {
        val = `0${j}`
      } else {
        val = `${j}`
      }
      return {
        label: val,
        value: val
      }
    })
    for (let s = regular, len = newTime; s <= len; s++) {
      computedTime.push(s)
    }
    computedTime = computedTime.map((y) => {
      let yr = `${y}`
      return {
        label: yr,
        value: yr
      }
    })
    newInit = [
      [
        ...computedTime
      ],
      [
        ...month
      ]
    ]
    return {
      seasons: newInit,
      // 当前['年', '月']
      value: [timeSplit[0], timeSplit[1]],
      // 打开&关闭
      visible: modalVisible
    }
  })
  const closeModal = useCallback(() => {
    setDateInfo((prev) => {
      return {
        ...prev,
        visible: false
      }
    })
    resetVisible(false)
  }, [resetVisible])

  useEffect(() => {
    if (initTime && initTime.length) {
      setCascade(true)
      setDateInfo((prev) => {
        return {
          seasons: initTime,
          value: prev.value,
          visible: prev.visible
        }
      })
    }
  }, [initTime])

  useEffect(() => {
    setDateInfo((prev) => {
      return {
        ...prev,
        visible: modalVisible
      }
    })
  }, [modalVisible])

  return (
    <Modal
      title='请选择日期'
      visible={dateInfo.visible}
      transparent
      closable
      onClose={() => {
        closeModal()
      }}
      footer={[{
        text: '确定',
        onPress: () => {
          modalSelect(dateInfo.value)
          closeModal()
        }
      }]}
    >
      <div className='picker-modal-style'>
        <PickerView
          cascade={cascade}
          cols={2}
          value={dateInfo.value}
          data={dateInfo.seasons}
          onChange={(val) => {
            setDateInfo((prev) => {
              return {
                ...prev,
                value: val
              }
            })
          }}
        />
      </div>
    </Modal>
  )
}

DateModal.defaultProps = {
  initTime: [],
  modalSelect: () => {},
  resetVisible: () => {},
  modalVisible: false
}

DateModal.propTypes = {
  // 初始值
  initTime: PropTypes.array,
  // 选择日期回调函数
  modalSelect: PropTypes.func,
  // 打开或关闭日期函数
  resetVisible: PropTypes.func,
  // 默认打开还是关闭参数
  modalVisible: PropTypes.bool
}

export default React.memo(DateModal)
