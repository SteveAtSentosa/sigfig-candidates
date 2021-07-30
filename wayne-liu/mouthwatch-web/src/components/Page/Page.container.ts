import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import Page from './Page'
import { SetStatus } from '#/actions/chat'
import { connect } from 'react-redux'
import { isSuperUser } from '#/utils'

export const mapState = (state: AppState): StateProps => {
  return {
    isSuperAdmin: state.auth.data && isSuperUser(state.auth.data.account)
  }
}

const mapDispatch: ActionProps = {
  setStatus: SetStatus
}

export default connect(mapState, mapDispatch)(Page)
