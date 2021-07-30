import { ControlCommunicationList } from '#/actions/gchat'
import { LoginResponseAccount } from '#/api'
import { ViewState } from '#/reducers/gchat'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  viewState: ViewState
  controlCommunicationList: typeof ControlCommunicationList
  loggedInAccount: LoginResponseAccount
}

export type StateProps = Pick<Props, 'viewState' | 'loggedInAccount'>
export type ActionProps = Pick<Props, 'controlCommunicationList'>
