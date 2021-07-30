import { Login } from '#/actions/auth'
import { State as AuthState } from '#/reducers/auth'
import { RouteComponentProps } from 'react-router-dom'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, RouteComponentProps {
  auth: AuthState
  login: typeof Login
}

export type StateProps = Pick<Props, 'auth'>

export type ActionProps = Pick<Props, 'login'>

export interface State {
  username?: string
  message: null | string
}
