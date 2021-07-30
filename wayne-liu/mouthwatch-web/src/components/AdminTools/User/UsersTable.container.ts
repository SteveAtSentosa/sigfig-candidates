import { ActionProps, StateProps } from './types'
import { MapStateToProps, connect } from 'react-redux'

import { AdminToolsSearchAccounts } from '#/actions/accounts'
import { AppState } from '#/redux'
import UsersTable from './UsersTable'
import { withRouter } from 'react-router-dom'

export const mapState: MapStateToProps<StateProps, {}, AppState> = (state) => {
  return {
    accountState: state.accounts,
    authedAccount: state.auth.data.account
  }
}

export const mapDispatch: ActionProps = {
  searchAccounts: AdminToolsSearchAccounts
}

export default withRouter(connect(mapState,mapDispatch)(UsersTable))
