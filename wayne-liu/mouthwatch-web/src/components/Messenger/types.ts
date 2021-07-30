import { AttachedFile } from '#/types'
import { Channel } from '#/microservice-middleware'
import { LoginResponseAccount } from '#/api'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  selectedChannel: Channel
  loggedInUser: LoginResponseAccount
  isAttachmentMenuOpen: boolean
  attachments: AttachedFile[]
}

export interface RouteParams {
  accountId?: string
  patientId?: string
}

export type StateProps = Pick<Props, 'selectedChannel' | 'loggedInUser' | 'isAttachmentMenuOpen' | 'attachments'>
