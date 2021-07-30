import { AccountLookup, Patient } from '#/types'

import { AddAvatar } from '#/actions/avatars'
import { Avatar } from '#/reducers/avatars'
import { User } from '#/microservice-middleware'

export interface DefaultProps {
  showAccountName: boolean
  className: string
  showStatusIndicator: boolean
  height: number
  width: number
}
export interface Props extends Partial<DefaultProps> {
  accounts: AccountLookup
  chatUsers: User[]
  token: string
  addAvatar: typeof AddAvatar
  avatars: Avatar[]
  type: 'provider' | 'patient'
  patients: Patient[]
  entityId: string
}

export type StateProps = Pick<Props, 'accounts' | 'token' | 'avatars' | 'chatUsers' | 'patients' >
export type ActionProps = Pick<Props, 'addAvatar'>
export type OwnProps = Pick<Props, 'entityId' | 'showAccountName' | 'className' | 'showStatusIndicator' | 'height' | 'width' | 'type'>
