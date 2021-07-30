import * as Modal from '#/components/Modal'

import { EntityId, Option } from '#/types'

import { InjectedProps } from '#/hocs/withUserGroups'
import { LoginResponseAccount } from '#/api/types'

export interface FormProps {
  isUnderage: boolean
  hasValidEmail: boolean
  selectedGroupId: EntityId
  changeSelectedGroupId: (e: EntityId) => void
  practiceOptions: Option[]
  groupOptions: Option[]
}

export interface FormValues {
  first_name: string
  middle_name?: string
  last_name: string
  gender: string
  dob: string
  email?: string
  send_invite?: boolean
  groups?: Option[]
  practices?: Option[]
}

export interface OwnProps extends Modal.ModalProps, InjectedProps {
  onSubmit: (e: FormValues) => void
}

export interface StateProps {
  account: LoginResponseAccount
  posting: boolean
  error: Error
  hasValidEmail: boolean
  isUnderage: boolean
}

export type Props = OwnProps & StateProps

export interface State {
  selectedGroupId: EntityId
}
