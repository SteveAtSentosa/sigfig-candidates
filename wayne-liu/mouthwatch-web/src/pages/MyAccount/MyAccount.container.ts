import { ActionProps, StateProps } from './types'
import { ChangePassword, GetAccountById, SetDefaultAvatar, UpdateAccount, UpdateSMSOptStatus } from '#/actions/accounts'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { AppState } from '#/redux'
import { DeleteMedia } from '#/actions/media'
import { Logout } from '#/actions/auth'
import MyAccount from './MyAccount'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { getFormNames } from 'redux-form'

export const mapState = (state: AppState): StateProps => {
  const { accounts: { accounts } } = state
  return {
    accountId: getAuthAccount(state).id,
    authToken: getAuthToken(state),
    account: state.auth.data.account && state.auth.data.account.id && accounts[state.auth.data.account.id],
    saving: state.accounts.meta.saving,
    fetching: state.accounts.meta.fetching,
    deleting: state.media.deleting,
    error: state.accounts.meta.error,
    activeFormNames: getFormNames()(state)
  }
}

export const mapDispatch: ActionProps = {
  showNotificationPopUp: ShowNotificationPopUp,
  deleteMedia: DeleteMedia,
  updateAccount: UpdateAccount,
  updateSMSOptStatus: UpdateSMSOptStatus,
  getAccount: GetAccountById,
  changePassword: ChangePassword,
  logout: Logout,
  setDefaultAvatar: SetDefaultAvatar
}

export default connect(mapState, mapDispatch)(MyAccount)
