import { CloseConversation, ControlCommunicationList, CreateConversation, OpenConversation } from '#/actions/gchat'
import { TypedReducer, setWith } from 'redoodle'

import { AttachedFile } from '#/types'

export interface Conversation {
  open: boolean
  userId: string
  channelId?: string
  attachments: AttachedFile[]
  draft?: boolean
}

export type ViewState = 'collapsed' | 'revealed'

export interface State {
  conversationList: {
    viewState: ViewState
  }
  conversations: Conversation[]
}

export const initialState: State = {
  conversationList: {
    viewState: 'revealed'
  },
  conversations: []
}

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(ControlCommunicationList.TYPE, (state, payload) => {

    return setWith(state, {
      conversationList: {
        viewState: payload === 'open' ? 'revealed' : 'collapsed'
      }
    })
  })

  reducer.withHandler(CreateConversation.TYPE, (state, { userId, channelId }) => {
    const conversation: Conversation = {
      userId,
      attachments: [],
      open: false
    }

    if (channelId) {
      conversation.channelId = channelId
      conversation.open = true
    } else {
      conversation.draft = true
    }

    return setWith(state, {
      conversations: [...state.conversations, conversation]
    })
  })

  reducer.withHandler(OpenConversation.TYPE, (state, { userId }) => {

    const conversations = updateConversations(state.conversations, userId, { open: true })

    return setWith(state, {
      conversations
    })
  })

  reducer.withHandler(CloseConversation.TYPE, (state, { userId }) => {

    const conversations = updateConversations(state.conversations, userId, { open: false })

    return setWith(state, {
      conversations
    })
  })

  return reducer.build()
}

export const reducer = createReducer()

export const updateConversations = (conversations: Conversation[], userId: string, obj: Partial<Conversation>) => {

  const index = conversations.findIndex(c => c.userId === userId)
  const previousConversation = conversations[index]
  const tempConversations = [...conversations ]
  tempConversations[index] = { ...previousConversation, ...obj }

  return tempConversations
}
