import React, {
  memo,
  useState,
  useCallback,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  SearchBar
} from 'antd-mobile'
import API from '@/api/api'
import './staffmodal.scss'

function StaffModal ({ list, type, mode, select }) {
  const [searchName, setSearchName] = useState('')
  const [searchData, setSearchData] = useState([])

  let parentArr = useRef([])
  const selectName = useCallback((e, name, userId) => {
    if (mode === 'check') {
      if (e.target.checked) {
        parentArr.current = [...parentArr.current, { name, userId }]
      } else {
        parentArr.current = _.differenceWith(parentArr.current, [{ name, userId }], _.isEqual)
      }
    }
    if (mode === 'radio') {
      parentArr.current = [{ name, userId }]
    }
    console.log(parentArr.current)
    select(parentArr.current)
  }, [mode, select])

  const search = useCallback((val) => {
    setSearchName(val)
    API.getTreeDeptAndUserList({
      username: val
    }).then(res => {
      setSearchData(res)
    })
  }, [])

  const clear = useCallback(() => {
    setSearchName('')
    setSearchData([])
  }, [])

  const listCheck = useCallback((data) => {
    return (
      <>
        {
          data.map(({ name, userId }, l) => (
            <label className='label-input' key={l}>
              <input name='treecheck' type='checkbox' onChange={(e) => {
                e.persist()
                selectName(e, name, userId)
              }} />
              {name}
            </label>
          ))
        }
      </>
    )
  }, [selectName])

  const listRadio = useCallback((data) => {
    return (
      <>
        {
          data.map(({ name, userId }, l) => (
            <label className='label-input' key={l}>
              <input name='treeradio' type='radio' onChange={(e) => {
                e.persist()
                selectName(e, name, userId)
              }} />
              {name}
            </label>
          ))
        }
      </>
    )
  }, [selectName])

  // 展开收缩
  const expandContraction = useCallback((id) => {
    const dt = document.getElementById(`tree_dt_${id}`)
    const dd = document.getElementById(`tree_dd_${id}`)
    if (dd.style.display === 'none') {
      dt.className = 'tree-up-icon'
      dd.style.display = 'block'
    } else {
      dt.className = 'tree-down-icon'
      dd.style.display = 'none'
    }
  }, [])

  const renderTree = (data, n = -1) => {
    const userList = function (st) {
      return st.map(({ name, userId }, l) => {
        let doms = null
        console.log('userId', userId)
        if (mode === 'check') {
          doms = <label className='label-input' key={l}>
            <input name='treecheck' type='checkbox' onChange={(e) => {
              e.persist()
              selectName(e, name, userId)
            }} />
            {name}
          </label>
        }
        if (mode === 'radio') {
          doms = <label className='label-input' key={l}>
            <input name='treeradio' type='radio' onChange={(e) => {
              e.persist()
              selectName(e, name, userId)
            }} />
            {name}
          </label>
        }
        return doms
      })
    }
    return data.map(({ id, name, childDept, userInfoList, isClick }, index) => {
      return (
        <dl className='dl_tree' key={id}>
          <dt onClick={() => expandContraction(id)}>
            {name}
            <i id={`tree_dt_${id}`} className={n === -1 ? 'tree-up-icon' : 'tree-down-icon'} />
          </dt>
          <dd id={`tree_dd_${id}`} style={{ display: n === -1 ? 'block' : 'none' }}>
            {
              (Object.prototype.toString.call(childDept) === '[object Array]') && renderTree(childDept, index)
            }
            <div>
              {
                userList(userInfoList)
              }
            </div>
          </dd>
        </dl>
      )
    })
  }

  return (
    <div className='accordion-tree-style' style={{ maxHeight: `${window.innerHeight - 325}px` }}>
      {
        type === '1' ? (
          <>
            <SearchBar
              cancelText='查询'
              placeholder='请输入姓名'
              showCancelButton
              onClear={clear}
              onSubmit={search}
              onCancel={search}
              maxLength={8}
            />
            {
              searchName.length ? renderTree(searchData) : renderTree(list)
            }
          </>
        ) : null
      }
      <div style={{ paddingTop: 10 }}>
        {
          (type === '2' && mode === 'check') ? (
            listCheck(list)
          ) : null
        }
        {
          (type === '2' && mode === 'radio') ? (
            listRadio(list)
          ) : null
        }
      </div>
    </div>
  )
}

StaffModal.defaultProps = {
  list: [],
  // 1 从组织结构里面查， 2、3不从组织结构里拿单选或多选
  type: '1',
  // 单选或多选模式
  mode: 'check',
  select: () => {}
}

StaffModal.propTypes = {
  list: PropTypes.array,
  type: PropTypes.string,
  mode: PropTypes.string,
  select: PropTypes.func
}

export default memo(StaffModal, () => true)
