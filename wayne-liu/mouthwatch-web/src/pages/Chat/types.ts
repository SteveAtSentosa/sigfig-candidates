import { AcceptConsentPolicies } from '#/actions/auth'
import { Channel } from '#/microservice-middleware'
import { ClearSelectedChannel } from '#/actions/chat'
import { CloseModal } from '#/actions/modals'
import { GroupConsentPolicy } from '#/types'
import { LoginResponseAccount } from '#/api'
import { RouteComponentProps } from 'react-router-dom'

export type ChatType = 'patient' | 'provider'

export interface DefaultProps {}

export interface Props extends RouteComponentProps {
  type: ChatType
  openWelcomeModal: boolean
  openConsentPolicyModal: boolean
  selectedChannel: Channel
  loggedInUser: LoginResponseAccount
  closeModal: typeof CloseModal
  clearSelectedChannel: typeof ClearSelectedChannel
  updatedConsentPolicies: GroupConsentPolicy[]
  acceptConsentPolicies: typeof AcceptConsentPolicies
}

export type OwnProps = Pick<Props, 'type'>

export type ActionProps = Pick<Props, 'clearSelectedChannel' | 'closeModal' | 'acceptConsentPolicies'>

export type StateProps = Pick<Props, 'loggedInUser' | 'openWelcomeModal' | 'selectedChannel' | 'updatedConsentPolicies'>

export interface State {
  welcomeModalIsOpen: boolean
}
