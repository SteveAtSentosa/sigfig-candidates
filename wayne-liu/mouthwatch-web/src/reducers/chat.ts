import {
  AddAttachments,
  ChangeConnectedStatus,
  ClearAllAttachments,
  ClearPopulatedMessage,
  ClearSelectedChannel,
  CloseAttachmentsMenu,
  DeSelectAttachment,
  Filter,
  InitSuccess,
  OpenAttachmentsMenu,
  PopulateMessage,
  RemoveAttachments,
  ResetViewableMessages,
  SelectAttachment,
  SelectChannelSuccess,
  SetOnlineStatus,
  SetViewableMessages,
  SyncMessages,
  UpdateScrollPosition,
  UploadMessageAttachments,
  UploadMessageAttachmentsSuccess
} from '#/actions/chat'
import { AttachedFile, EntityId, Media } from '#/types'
import { CloseSuccess, Message } from '#/microservice-middleware'
import { TypedReducer, setWith } from 'redoodle'

import config from '#/config'
import { without } from 'lodash'

export type FilterState = {
  users: string
  messages: string
}

export type ViewableMessages = {
  [channelId: string]: Message[]
}

export type MessagesSynced = {
  [channelId: string]: boolean
}

export interface AttachmentMenuState {
  isOpen: boolean
  selected: EntityId[]
}

export interface State {
  socketURL: string
  connected: boolean
  selectedChannel: string
  filter: FilterState
  error: Error
  initialized: boolean
  scrollPositions: {
    [key: string]: number
  }
  attachments: AttachedFile[]
  mediaByChannelId: {
    [channelId: string]: Media[]
  }
  uploading: boolean
  attachmentsMenu: AttachmentMenuState
  loadingUsers: boolean
  initialMessage: string
  viewableMessages: ViewableMessages
  messagesSynced: MessagesSynced
  DEFAULT_VIEWABLE_MESSAGES: number
  DEFAULT_MESSAGE_SUBSCRIPTION_COUNT: number
  online: boolean
}

export const initialState: State = {
  socketURL: config.api.chatUrl,
  connected: false,
  filter: {
    users: '',
    messages: ''
  },
  selectedChannel: null,
  error: null,
  scrollPositions: {},
  mediaByChannelId: {},
  initialized: false,
  attachments: [],
  uploading: false,
  attachmentsMenu: {
    isOpen: false,
    selected: []
  },
  loadingUsers: true,
  initialMessage: null,
  viewableMessages: {},
  messagesSynced: {},
  DEFAULT_VIEWABLE_MESSAGES: 8,
  DEFAULT_MESSAGE_SUBSCRIPTION_COUNT: 15,
  online: navigator.onLine
}

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(SelectChannelSuccess.TYPE, (state, selectedChannel) => {
    const attachmentsMenu = { ...state.attachmentsMenu, isOpen: false }
    return setWith(state, { selectedChannel: selectedChannel.channelId, attachmentsMenu })
  })

  reducer.withHandler(ClearSelectedChannel.TYPE, (state) => {
    return setWith(state, { selectedChannel: null })
  })

  reducer.withHandler(InitSuccess.TYPE, (state) => {
    return setWith(state, { initialized: true, loadingUsers: false })
  })

  reducer.withHandler(Filter.TYPE, (state, payload) => {
    const { searchTerm, type } = payload
    const key = type === 'contacts' ? 'users' : 'messages'
    return setWith(state, { filter: { ...state.filter, [key]: searchTerm.toLowerCase() } })
  })

  reducer.withHandler(UpdateScrollPosition.TYPE, (state, payload) => {
    const { channel, position } = payload
    return setWith(state, { scrollPositions: { ...state.scrollPositions, ...{ [channel]: position } } })
  })

  reducer.withHandler(ChangeConnectedStatus.TYPE, (state, isConnected) => {
    return setWith(state, { connected: isConnected })
  })

  reducer.withHandler(SetOnlineStatus.TYPE, (state, isOnline) => {
    return setWith(state, { online: isOnline })
  })

  reducer.withHandler(CloseSuccess.TYPE, (state) => {
    return setWith(state, { connected: false, initialized: false })
  })

  reducer.withHandler(CloseAttachmentsMenu.TYPE, (state) => {
    return setWith(state, {
      attachmentsMenu: {
        ...state.attachmentsMenu,
        isOpen: false
      }
    })
  })

  reducer.withHandler(OpenAttachmentsMenu.TYPE, (state) => {
    return setWith(state, {
      attachmentsMenu: {
        ...state.attachmentsMenu,
        isOpen: true
      }
    })
  })

  reducer.withHandler(SelectAttachment.TYPE, (state, incomingMediaID) => {
    return setWith(state, {
      attachmentsMenu: {
        ...state.attachmentsMenu,
        selected: [...state.attachmentsMenu.selected, incomingMediaID]
      }
    })
  })

  reducer.withHandler(DeSelectAttachment.TYPE, (state, incomingMediaID) => {
    return setWith(state, {
      attachmentsMenu: {
        ...state.attachmentsMenu,
        selected: state.attachmentsMenu.selected.filter(mediaID => mediaID !== incomingMediaID)
      }
    })
  })

  reducer.withHandler(AddAttachments.TYPE, (state, incomingMedia) => {
    return setWith(state, {
      attachments: [...state.attachments, ...incomingMedia]
    })
  })

  reducer.withHandler(RemoveAttachments.TYPE, (state, incomingMedia) => {
    return setWith(state, {
      attachments: without(state.attachments, ...incomingMedia)
    })
  })

  reducer.withHandler(ClearAllAttachments.TYPE, (state) => {
    return setWith(state, {
      attachments: []
    })
  })

  reducer.withHandler(UploadMessageAttachments.TYPE, (state) => {
    return setWith(state, {
      uploading: true
    })
  })

  reducer.withHandler(UploadMessageAttachmentsSuccess.TYPE, (state) => {
    return setWith(state, {
      uploading: false
    })
  })

  reducer.withHandler(PopulateMessage.TYPE, (state, initialMessage) => {
    return setWith(state, {
      initialMessage
    })
  })

  reducer.withHandler(ClearPopulatedMessage.TYPE, (state) => {
    return setWith(state, {
      initialMessage: null
    })
  })

  reducer.withHandler(ResetViewableMessages.TYPE, (state, payload) => {
    const { channelId, messages } = payload
    return setWith(state, {
      viewableMessages: { ...state.viewableMessages, [channelId]: messages },
      messagesSynced: { ...state.messagesSynced, [channelId]: true }
    })
  })

  reducer.withHandler(SetViewableMessages.TYPE, (state, payload) => {
    const { channelId, messages } = payload
    return setWith(state, {
      viewableMessages: { ...state.viewableMessages, [channelId]: messages },
      messagesSynced: { ...state.messagesSynced, [channelId]: false }
    })
  })

  reducer.withHandler(SyncMessages.TYPE, (state, payload) => {
    const { channelId } = payload
    return setWith(state, {
      messagesSynced: { ...state.messagesSynced, [channelId]: true }
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
