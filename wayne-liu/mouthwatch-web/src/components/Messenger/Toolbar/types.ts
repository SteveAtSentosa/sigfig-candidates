import { Channel } from '#/microservice-middleware'
import { CreateSession } from '#/actions/video'
import { LoginResponseAccount } from '#/api'
import { ViewPermissions } from '#/types'

export interface DefaultProps {
  className: string
}

export interface Props extends Partial<DefaultProps> {
  loggedInUser: LoginResponseAccount
  channel: Channel
  createVideoSession: typeof CreateSession
  selectedChannel: string
  viewPerms: ViewPermissions
}

export type OwnProps = Pick<Props, 'className'>
export type StateProps = Pick<Props, 'channel' | 'loggedInUser' | 'selectedChannel' | 'viewPerms'>
export type ActionProps = Pick <Props, 'createVideoSession'>
