import React, {
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import './timelimit.scss'

function TimeLimit ({ history }) {
  const [requireImg] = useState(() => {
    return {
      bg: require('../../images/timelimit_top.png'),
      h2: require('../../images/2h.png'),
      h15: require('../../images/15h.png'),
      h24: require('../../images/24h.png')
    }
  })
  const renderImg = function (width, img) {
    return <img width={width} src={img} alt='' />
  }

  useEffect(() => {
    document.title = '事件性质'
  })

  return (
    <div className='scroll-view footer-reserved timelimit-view'>
      <div className='text-center'>
        <div style={{ marginTop: '22px' }}>
          { renderImg(331, requireImg.bg) }
        </div>
        <div className='duty-time'>受理时间</div>
        <div className='duty_div'>
          <h4>工作日受理时间</h4>
          <div className='duty-dl'>
            <dl>
              <dt>
                { renderImg(52, requireImg.h2) }
              </dt>
              <dd>12：00-14：00</dd>
            </dl>
            <dl>
              <dt>
                { renderImg(52, requireImg.h15) }
              </dt>
              <dd>17：00-08：00</dd>
            </dl>
          </div>
        </div>
        <div className='duty_div'>
          <h4 style={{ marginTop: '45px' }}>节假日受理时间</h4>
          <div className='duty-dl'>
            <dl>
              <dt>
                { renderImg(52, requireImg.h24) }
              </dt>
              <dd>00：00-24：00</dd>
            </dl>
          </div>
        </div>
      </div>
      <div className='layout-footer'>
        <div className='process-foot'>
          <button className='tab-button-blue normal straight btn-block' type='button' onClick={() => history.go(-1)}>返回</button>
        </div>
      </div>
    </div>
  )
}

TimeLimit.propTypes = {
  history: PropTypes.object
}

export default TimeLimit
