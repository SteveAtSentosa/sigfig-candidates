import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from '#/app/'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
