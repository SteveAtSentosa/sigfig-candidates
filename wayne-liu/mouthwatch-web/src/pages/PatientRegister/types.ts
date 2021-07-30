import { RegisterPatient, ValidateRegistration } from '#/actions/auth'

import { State as AuthState } from '#/reducers/auth'
import { GroupConsentPolicy } from '#/types'
import { RouteComponentProps } from 'react-router'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, RouteComponentProps {
  auth: AuthState
  register: typeof RegisterPatient
  validate: typeof ValidateRegistration
}

export type StateProps = Pick<Props, 'auth'>

export type ActionProps = Pick<Props, 'register' | 'validate'>

export interface State {
  email: string
  one_time_password: string
  groupConsentPolicies: GroupConsentPolicy[]
  currentPage: 'register' | 'newPassword'
}
