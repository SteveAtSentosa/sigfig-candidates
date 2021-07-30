import { AccountLookup } from '#/types'
import { InjectedFormProps } from 'redux-form'
import { PartitionedChannels } from '#/actions/chat'
import { StartConversation } from '#/actions/gchat'

export interface DefaultProps {}

export interface FormData {
  searchTerm: string
}

export interface Props extends Partial<DefaultProps> {
  partitionedChannels: PartitionedChannels
  chatUsers: AccountLookup
  chatUsersIds: string[]
  form: string
  startConversation: typeof StartConversation
}

export type StateProps = Pick<Props, 'chatUsers' | 'partitionedChannels' | 'chatUsersIds'>
export type OwnProps = Pick<Props, 'form'>
export type ActionProps = Pick<Props, 'startConversation'>
export type ReduxFormProps = InjectedFormProps<FormData, OwnProps>
