import { AccountLookup, Notification, NotificationPayloadType } from '#/types'

import { Acknowledge } from '#/actions/notifications'
import { Channel } from '#/microservice-middleware'
import { LoginResponseAccount } from '#/api'
import { LoginToSession } from '#/actions/video'
import { RouteComponentProps } from 'react-router-dom'

export interface OwnProps extends RouteComponentProps {
  isOpen: boolean
  hideActivityFeed: () => void
}

export interface StateProps {
  notifications: Notification<NotificationPayloadType>[]
  channels: Channel[]
  token: string
  loggedInAccount: LoginResponseAccount
  chatUsers: AccountLookup
}

export interface ActionProps {
  acknowledge: typeof Acknowledge
  loginToSession: typeof LoginToSession
}

export type Props = OwnProps & ActionProps & StateProps
