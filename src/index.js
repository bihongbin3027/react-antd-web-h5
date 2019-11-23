import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './style/base.scss'
import * as serviceWorker from './serviceWorker'

if (/Android [4-9]/.test(navigator.appVersion)) {
  window.addEventListener('resize', function () {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      window.setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded()
      }, 0)
    }
  })
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
