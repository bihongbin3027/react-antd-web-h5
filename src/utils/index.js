import moment from 'moment'

// 定时器
let timer = null
// 存入localStorage属性名
const localName = 'qywx_gzzx'

// 设置localStorage
export function saveToLocal (id, key, value) {
  let store = window.localStorage[localName]
  if (!store) {
    store = {}
    store[id] = {}
  } else {
    store = JSON.parse(store)
    if (!store[id]) {
      store[id] = {}
    }
  }
  store[id][key] = value
  window.localStorage[localName] = JSON.stringify(store)
}

// 读取localStorage
export function loadFromLocal (id, key, def) {
  let store = window.localStorage[localName]
  if (!store) {
    return def
  }
  store = JSON.parse(store)[id]
  if (!store) {
    return def
  }
  let ret = store[key]
  return ret || def
}

// 去抖动
export const debounce = (func, delay) => {
  let timer
  return function (...args) {
    console.log(...args)
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, delay)
  }
}

// 深度比较两个对象是否相同
export function equalsObj (oldData, newData) {
  // 判断此对象是否是Object类型
  const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'
  // 判断此类型是否是Array类型
  const isArray = (arr) => Object.prototype.toString.call(arr) === '[object Array]'
  // 类型为基本类型时,如果相同,则返回true
  if (oldData === newData) {
    return true
  }
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    // 类型为对象并且元素个数相同
    // 遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key])) {
          // 对象中具有不相同属性 返回false
          return false
        }
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    // 类型为数组并且数组长度相同
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i])) {
        // 如果数组元素中具有不相同元素,返回false
        return false
      }
    }
  } else {
    // 其它类型,均返回false
    return false
  }
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true
}

export function currentTime (dom) {
  const viewFunc = function () {
    let viewSpan = document.getElementById(dom)
    if (viewSpan) {
      viewSpan.innerHTML = moment().format('HH:mm:ss')
    } else {
      clearInterval(timer)
    }
  }
  clearInterval(timer)
  viewFunc()
  timer = setInterval(function () {
    viewFunc()
  }, 1000)
}
