import { Channel, Message, SetSubscription, Subscription } from '#/microservice-middleware'
import { InitViewableMessages, SetViewableMessages, SyncMessages, UpdateScrollPosition } from '#/actions/chat'

import { LoginResponseAccount } from '#/api'
import { LoginToSession } from '#/actions/video'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  channel: Channel
  loggedInUser: LoginResponseAccount
  selectedChannel: string
  updateScrollPosition: typeof UpdateScrollPosition
  scrollPositions: {[key: string]: number}
  token: string
  setSubscription: typeof SetSubscription
  channelSubscriptions: Subscription
  viewableMessages: Message[]
  setViewableMessages: typeof SetViewableMessages
  initViewableMessages: typeof InitViewableMessages
  messagesSynced: boolean
  syncMessages: typeof SyncMessages
  DEFAULT_VIEWABLE_MESSAGES: number
  DEFAULT_MESSAGE_SUBSCRIPTION_COUNT: number
  loginToSession: typeof LoginToSession
}

export interface State {
  loading: boolean
}

export type StateProps = Pick<Props, 'channel' | 'loggedInUser' | 'selectedChannel' | 'scrollPositions' | 'token' | 'channelSubscriptions' | 'viewableMessages' | 'messagesSynced' | 'DEFAULT_VIEWABLE_MESSAGES' | 'DEFAULT_MESSAGE_SUBSCRIPTION_COUNT'>
export type ActionProps = Pick<Props, 'updateScrollPosition' | 'setSubscription' | 'setViewableMessages' | 'initViewableMessages' | 'syncMessages' | 'loginToSession'>
