import { ArchiveChannel, Channel, MarkAsRead, User } from '#/microservice-middleware'
import { ClearAllAttachments, ClearSelectedChannel, PartitionedChannels, SelectChannel } from '#/actions/chat'

import { ChatType } from '#/pages/Chat/types'
import { LoginResponseAccount } from '#/api'
import { RouteComponentProps } from 'react-router'
import { RouteParams } from '#/components/Messenger'

export interface DefaultProps {
  channels: PartitionedChannels
}

export type ArchiveModalType = 'archive' | 'newMessage'

export interface Props extends Partial<DefaultProps>, RouteComponentProps<RouteParams> {
  type: ChatType
  selectChannel: typeof SelectChannel
  markChannelAsRead: typeof MarkAsRead
  selectedChannel: string
  loggedInAccount: LoginResponseAccount
  userRole: string
  chatUsers: User[]
  initialized: boolean
  clearAllAttachments: typeof ClearAllAttachments
  microserviceChannels: Channel[]
  archiveChannel: typeof ArchiveChannel
  clearSelectedChannel: typeof ClearSelectedChannel
  hide (): void
}

export interface State {
  isAddNewMessageModalOpen: boolean
  initialized: boolean
  width: number
}

export type StateProps = Pick<Props,
'channels' | 'selectedChannel' | 'loggedInAccount' | 'userRole' | 'chatUsers' | 'initialized' | 'microserviceChannels'>

export type ActionProps = Pick<Props, 'selectChannel' | 'markChannelAsRead' | 'clearAllAttachments' | 'archiveChannel' | 'clearSelectedChannel'>
