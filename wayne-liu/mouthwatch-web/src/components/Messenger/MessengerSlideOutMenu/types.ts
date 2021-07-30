import { AddAttachments, ClearAllAttachments, CloseAttachmentsMenu, RemoveAttachments } from '#/actions/chat'
import { AttachedFile, EntityId, Media } from '#/types'

import { User as MicroserviceUser } from '#/microservice-middleware'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  token: string
  closeAttachmentsMenu: typeof CloseAttachmentsMenu
  isOpen: boolean
  attachments: AttachedFile[]
  addAttachments: typeof AddAttachments
  removeAttachments: typeof RemoveAttachments
  clearAllAttachments: typeof ClearAllAttachments
  media: Media[]
  patientInChatUsers: MicroserviceUser
  loggedInUser: string
}

export interface State {
  selectedMedia: EntityId[]
}

export type StateProps = Pick<Props, 'token' | 'attachments' | 'media' | 'isOpen' | 'patientInChatUsers' | 'loggedInUser'>
export type ActionProps = Pick<Props, 'closeAttachmentsMenu' | 'addAttachments' | 'clearAllAttachments' | 'removeAttachments'>
