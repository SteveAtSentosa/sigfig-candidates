import { Channel } from '#/microservice-middleware'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  selectedChannel: Channel
}

export interface RouteParams {
  accountId?: string
  patientId?: string
}

export type StateProps = Pick<Props, 'selectedChannel'>
