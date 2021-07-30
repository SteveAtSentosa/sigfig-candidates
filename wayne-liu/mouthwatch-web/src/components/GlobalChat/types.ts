import { CloseConversation, OpenConversation } from '#/actions/gchat'

import { AccountLookup } from '#/types'
import { Conversation } from '#/reducers/gchat'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  conversations: Conversation[]
  chatUsers: AccountLookup
  openConversation: typeof OpenConversation
  closeConversation: typeof CloseConversation
}

export type StateProps = Pick<Props, 'conversations' | 'chatUsers'>
export type ActionProps = Pick<Props, 'openConversation' | 'closeConversation'>
