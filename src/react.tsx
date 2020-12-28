import * as React from 'react'
import * as ReactDOM from 'react-dom'

// CSS imports
import '@css/base.css'
import App from '@frontend/App'

// Render application
ReactDOM.render(<App />, document.getElementById('app'))

// @ts-ignore
if (module.hot) module.hot.accept()
