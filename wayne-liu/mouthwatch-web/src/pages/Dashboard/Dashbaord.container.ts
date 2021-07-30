import { StateProps } from './types'
import { AppState } from '#/redux'
import Dashboard from './Dashboard'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => ({
  viewPerms: state.ui.permissions
})

export const mapDispatch = {}

export default connect(mapState, mapDispatch)(Dashboard)
