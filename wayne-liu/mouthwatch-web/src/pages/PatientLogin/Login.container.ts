import PPLogin from './Login'
import { AppState } from '#/redux'
import { connect } from 'react-redux'
import { Login } from '#/actions/auth'
import { withRouter } from 'react-router-dom'
import { ActionProps, StateProps } from './types'

export const mapState = (state: AppState): StateProps => {
  const { auth } = state
  return { auth }
}

export const actions: ActionProps = {
  login: Login
}

export default connect(mapState, actions)(withRouter(PPLogin))
