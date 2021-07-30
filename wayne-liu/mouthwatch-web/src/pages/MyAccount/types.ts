import { Account, EntityId } from '#/types'
import { ChangePassword, GetAccountById, SetDefaultAvatar, UpdateAccount, UpdateSMSOptStatus } from '#/actions/accounts'

import { DeleteMedia } from '#/actions/media'
import { Logout } from '#/actions/auth'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  accountId: EntityId
  account: Account
  authToken: string
  fetching: boolean
  saving: boolean
  deleting: boolean
  error: Error
  activeFormNames: string[]
  showNotificationPopUp: typeof ShowNotificationPopUp
  updateAccount: typeof UpdateAccount
  updateSMSOptStatus: typeof UpdateSMSOptStatus
  deleteMedia: typeof DeleteMedia
  getAccount: typeof GetAccountById
  changePassword: typeof ChangePassword
  logout: typeof Logout
  setDefaultAvatar: typeof SetDefaultAvatar
}

export type StateProps = Pick<Props, 'accountId' | 'account' | 'authToken' | 'fetching' | 'saving' | 'error' | 'activeFormNames' | 'deleting'>
export type ActionProps = Pick<Props, 'setDefaultAvatar' | 'updateAccount' | 'updateSMSOptStatus' | 'showNotificationPopUp' | 'deleteMedia' | 'getAccount' | 'changePassword' | 'logout'>

export interface State {
  showSaveBtn: boolean
}
