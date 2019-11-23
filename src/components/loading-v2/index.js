import React from 'react'
import './style.scss'

function LoadingV2 () {
  return (
    <div className='loading-v2'>
      <p />
      <span>加载中 ...</span>
    </div>
  )
}

export default React.memo(LoadingV2)
