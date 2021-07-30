import { ActionProps, StateProps } from './types'

import AccountAvatar from './AccountAvatar'
import { AddAvatar } from '#/actions/avatars'
import { AppState } from '#/redux'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    accounts: state.accounts.accounts,
    token: state.auth.data.token,
    avatars: state.avatars.byId,
    chatUsers: state.microservice.users,
    patients: state.patients.data
  }
}

export const actions: ActionProps = {
  addAvatar: AddAvatar
}

export default connect(mapState, actions)(AccountAvatar)
