import React, {
  useState,
  memo,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'

const Child = ({ name, onClick }) => {
  console.log('子组件?')
  return (
    <>
      <div style={{ color: name.color }}>我是一个子组件，父级传过来的数据：{name.name}</div>
      <button onClick={() => onClick('新的子组件name')}>改变name</button>
    </>
  )
}

Child.propTypes = {
  name: PropTypes.object,
  onClick: PropTypes.func
}

const ChildMemo = memo(Child)

function Test () {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Child组件')

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>加1</button>
      <p>count:{count}</p>
      <ChildMemo
        name={useMemo(() => ({ name, color: name.indexOf('name') !== -1 ? 'red' : 'green' }), [name])}
        onClick={useCallback((newName) => setName(newName), [])}
      />
    </div>
  )
}

export default Test
