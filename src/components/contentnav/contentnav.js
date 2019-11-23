import React, {
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'

function ContentNav ({ children, foot }) {
  let [height, setHeight] = useState('')
  const contentComputed = () => {
    return foot ? { bottom: `${height}px` } : { bottom: 0 }
  }
  useEffect(() => {
    setHeight(document.getElementById('foottab').offsetHeight)
  }, [])
  return (
    <div className='container' style={contentComputed()}>{ children }</div>
  )
}

ContentNav.propTypes = {
  children: PropTypes.array,
  foot: PropTypes.bool
}

export default ContentNav
