import { Conversation, ViewState } from '#/reducers/gchat'

import { AppState } from '#/redux'
import { Selector } from 'reselect'
import { defineAction } from 'redoodle'

export const ControlCommunicationList = defineAction('[gchat] open communication list')<'open' | 'close'>()
export const StartConversation = defineAction('[gchat] start conversation')<{userId: string}>()
export const OpenConversation = defineAction('[gchat] open conversation')<{ userId: string }>()
export const CloseConversation = defineAction('[gchat] close conversation')<{ userId: string }>()
export const CreateConversation = defineAction('[gchat] create conversation')<{ userId: string, channelId?: string }>()

export const conversationsSelector: Selector<AppState, Conversation[]> = (state) => state.gchat.conversations
export const conversationListState: Selector<AppState, ViewState> = (state) => state.gchat.conversationList.viewState
