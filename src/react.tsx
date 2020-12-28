import * as React from 'react'
import * as ReactDOM from 'react-dom'

import '@css/base.css'
import App from '@frontend/App'

// Render application
ReactDOM.render(<App />, document.getElementById('app'))

// Handle HMR of React component reloads
// @ts-ignore
if (module.hot) module.hot.accept()
