import React, {
  useState,
  useEffect
} from 'react'
import './notpermission.scss'

function NotPermission () {
  const [requireImg] = useState(() => {
    return {
      not1: require('../../images/not_module_1.png')
    }
  })
  const renderImg = function (width, img) {
    return <img width={width} src={img} alt='' />
  }

  useEffect(() => {
    document.title = '温馨提示'
  }, [])

  return (
    <div className='scroll-view footer-reserved permission-view'>
      <div className='text-center'>
        <div className='permission-list'>
          { renderImg(260, requireImg.not1) }
        </div>
      </div>
      <div className='layout-footer'>
        <div className='process-foot'>
          <button className='tab-button-blue normal straight btn-block' type='button' onClick={() => {
            // eslint-disable-next-line
            wx.closeWindow()
          }}>返回</button>
        </div>
      </div>
    </div>
  )
}

export default NotPermission
