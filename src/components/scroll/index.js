import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import LoadingV1 from '@/components/loading-v1'
import LoadingV2 from '@/components/loading-v2'
import { debounce } from '@/utils'
import './style.scss'

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState()

  const scrollContaninerRef = useRef()

  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props

  const { pullUp, pullDown, onScroll } = props

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])

  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])

  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if (!bScroll || !pullUp) return
    bScroll.on('scrollEnd', () => {
      // 判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, pullUpDebounce, bScroll])

  useEffect(() => {
    if (!bScroll || !pullDown) return
    bScroll.on('touchEnd', (pos) => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce()
      }
    })
    return () => {
      bScroll.off('touchEnd')
    }
  }, [pullDown, pullDownDebounce, bScroll])

  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh () {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll () {
      if (bScroll) {
        return bScroll
      }
    }
  }))

  const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }
  return (
    <div className='scroll-container' ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <div style={PullUpdisplayStyle}><LoadingV1 /></div>
      {/* 顶部下拉刷新动画 */}
      <div style={PullDowndisplayStyle}><LoadingV2 /></div>
    </div>
  )
})

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

Scroll.propTypes = {
  children: PropTypes.node,
  // 横向还是纵向滚动
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  click: PropTypes.bool,
  // 是否重新计算better-scroll
  refresh: PropTypes.bool,
  // 滚动监听
  onScroll: PropTypes.func,
  // 向上滚动监听
  pullUp: PropTypes.func,
  // 向下滚动监听
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  // 是否支持向上吸顶
  bounceTop: PropTypes.bool,
  // 是否支持向下吸顶
  bounceBottom: PropTypes.bool
}

export default Scroll
