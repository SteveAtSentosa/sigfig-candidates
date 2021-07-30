import { State as AuthState } from '#/reducers/auth'
import { UpdateSMSOptStatus } from '#/actions/accounts'
import { RouteComponentProps } from 'react-router'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, RouteComponentProps {
  auth: AuthState
  sendTextAlerts: boolean
  updateSMSOptStatus: typeof UpdateSMSOptStatus
}

export type StateProps = Pick<Props, 'auth' | 'sendTextAlerts'>

export type ActionProps = Pick<Props, 'updateSMSOptStatus'>
