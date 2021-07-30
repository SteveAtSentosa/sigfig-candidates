import { Account, AccountLookup, Patient } from '#/types'
import { ArchivePatient, ClearArchiveError } from '#/actions/patients'

import { BaseModalProps } from '#/components/Modal'
import { RouteComponentProps } from 'react-router-dom'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'

export interface Props extends BaseModalProps, RouteComponentProps {
  user: Patient | Account
  archivePatient: typeof ArchivePatient
  clearArchiveError: typeof ClearArchiveError
  showNotificationPopUp: typeof ShowNotificationPopUp
  saving: boolean
  error: Error
  chatUsers: AccountLookup
}

export type StateProps = Pick<Props, 'saving' | 'error' | 'chatUsers'>
export type ActionProps = Pick<Props, 'clearArchiveError' | 'archivePatient' | 'showNotificationPopUp' >
export type OwnProps = Pick<Props, 'user' >
