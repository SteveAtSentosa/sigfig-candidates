export type OnlineStatus = 'online' | 'offline' | 'idle'

export interface User {
  id: string
  status: OnlineStatus
  createdAt?: Date
  updatedAt?: Date
  messages?: Message[]
  channels?: Channel[]
  accountData: AccountData
}

export interface Channel {
  id: string
  private: boolean
  createdAt?: Date
  updatedAt?: Date
  messages?: Message[]
  userToChannels?: UserToChannel[]
  readOnly: boolean
}

export interface AccountData {
  id: string
  email: string
  first_name: string
  last_name: string
  dob: string
  is_patient: boolean
  status: 'active' | 'inactive' | 'invited'
  display_name: string
  patient_id: string
}

export interface Message {
  id: string
  timestamp: Date
  data: string
  userId: string
  channelId: string
  messageType: MessageType
  createdAt?: Date
  updatedAt?: Date
}

export interface UserToChannel {
  id: string
  channelId: string
  archived?: boolean
  unread?: boolean
  createdAt?: Date
  updatedAt?: Date
  userId: string
  accountData: AccountData
}

export type EntityType = 'user' | 'channel' | 'message' | 'userToChannel' | 'subscription' | 'messages'

export type TransactionType = 'insert' | 'update' | 'set'

export interface BaseTransaction {
  id: number
  type: TransactionType
  entityId: string
  entityType: EntityType
  throughType?: EntityType
  throughId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserTransaction extends BaseTransaction {
  entityType: 'user'
  data: User
}
export interface ChannelTransaction extends BaseTransaction {
  entityType: 'channel'
  data: Channel
}

export interface MessageTransaction extends BaseTransaction {
  entityType: 'message'
  data: Message
}

export interface MessagesTransaction extends BaseTransaction {
  entityType: 'messages'
  data: Message[]
}

export interface UserToChannelTransaction extends BaseTransaction {
  entityType: 'userToChannel'
  data: UserToChannel
}

export interface SubscriptionTransaction extends BaseTransaction {
  entityType: 'subscription'
  data: Subscription
}

export type MessageType = 'text' | 'video' | 'image' | 'doc' | 'file' | 'media'

export type Transaction = UserTransaction | ChannelTransaction | MessageTransaction | MessagesTransaction | UserToChannelTransaction | SubscriptionTransaction

export type OutgoingDataType = 'setSubscription' | 'archiveChannel' | 'markAsRead' | 'sendMessage' | 'createChannel' | 'auth' | 'touch'

export interface OutgoingWSData {
  type: OutgoingDataType
  messageType: MessageType
  data: string
  channelId: string
  userId: string
  userIds: string[]
  latest: Date | string
  token: string
  archived: boolean
  updateUsers: boolean
  entityType: string
  throughId: string
  throughType: EntityType
  from: string | null
  to: string | null
  count: number
}

export interface MediaMessageData {
  mediaIds: string[]
  message?: string
}

export interface OutgoingMediaMessage {
  channelId: string
  messageType: 'media'
  data: MediaMessageData
}

export interface VideoMessageData {
  room_id: string
  first_name: string
}

export interface OutgoingVideoMessage {
  channelId: string
  messageType: 'video'
  data: VideoMessageData
}

export type OutgoingMessageToChannel = Pick<OutgoingWSData, 'messageType' | 'channelId' | 'data'>
export type OutgoingMessageToUser = Pick<OutgoingWSData, 'messageType' | 'userId' | 'data' >
export type OutgoingArchiveChannel = Pick<OutgoingWSData, 'channelId' | 'archived'>
export type OutgoingMarkAsRead = Pick<OutgoingWSData, 'channelId'>
export type OutgoingSetSubscription = Pick<OutgoingWSData, 'entityType' | 'throughId' | 'throughType' | 'to' | 'from' | 'count'>
export type OutgoingFetch = Pick<OutgoingWSData, 'channelId'>
export type OutgoingTouch = Pick<OutgoingWSData, 'updateUsers'>
export type OutgoingCreateChannel = Partial<Pick<OutgoingWSData, 'userIds' | 'userId'>> & Partial<OutgoingMessageToChannel>
export type OutgoingData = OutgoingCreateChannel | OutgoingMessageToUser | OutgoingMessageToChannel | OutgoingArchiveChannel | OutgoingMarkAsRead | OutgoingSetSubscription | OutgoingTouch

export interface SyncAction {
  type: string
  state?: ClientState
  transaction?: Transaction
}

export type WSReadyState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'

export interface Subscription {
  first?: string | null
  count?: number
  from?: string | null
  to?: string | null
  throughId?: string
  entityType?: EntityType
  subscriptions?: Subscription[]
}

export interface ClientState {
  users: User[]
  channels: Channel[]
  subscriptions: Subscription[]
  lastTransaction: number
  readyState: WSReadyState
}

export interface TransactionResponse {
  type: 'init' | 'transaction'
  transaction?: Transaction
  state?: ClientState
}

export interface ActionResponse {
  type: 'response'
}

export interface ActionChannelResponse extends ActionResponse {
  action: 'createChannel'
  data: {
    channel: Channel
  }
}

export interface ActionMessageResponse extends ActionResponse {
  action: 'sendMessage'
  data: {
    message: Message
    channel: Channel
  }
}

export type ActionResponses = ActionChannelResponse | ActionMessageResponse

export interface ErrorResponse {
  type: 'error'
  message: string
}

export type Response = TransactionResponse | ErrorResponse | ActionResponses
