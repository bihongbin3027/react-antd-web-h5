import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

function LoadingV1 (props) {
  const { show } = props
  return (
    <div className='loading-v1' style={show ? { display: '' } : { display: 'none' }}>
      <div />
      <div />
    </div>
  )
}

LoadingV1.defaultProps = {
  show: true
}

LoadingV1.propTypes = {
  show: PropTypes.bool
}

export default React.memo(LoadingV1)
