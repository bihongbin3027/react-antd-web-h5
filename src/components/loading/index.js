import React from 'react'
import './style.scss'

function Loading () {
  return (
    <div className='spinner-box'>
      <div className='spinner-wrap'>
        <div className='spinner-icon' />
        <div className='spinner-text'>加载中...</div>
      </div>
    </div>
  )
}

export default Loading
