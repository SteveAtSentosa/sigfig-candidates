import { Acknowledge, getActiveMessageNotificationsByChannelId } from '#/actions/notifications'
import {
  ArchiveChannel,
  Authenticate,
  ChatClient,
  Close,
  Connect,
  CreateChannel,
  MarkAsRead,
  OutgoingMessageToChannel,
  OutgoingMessageToUser,
  SendMessageToChannel,
  SendMessageToUser,
  SendMultimediaMessage,
  SendVideoMessage,
  SetSubscription,
  Touch,
  TransactError,
  UnknownTransact,
  wsInitChannel
} from '#/microservice-middleware'
import { ChangeConnectedStatus, ClearAllAttachments, socketURLSelector } from '#/actions/chat'
import { call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { getAuthToken, hasAuthenticated } from '#/actions/auth.selectors'

import { EntityId } from '#/types'
import { LoginSuccess } from '#/actions/auth'
import { OpenModal } from '#/actions/modals'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'

export let client: ChatClient = null

export function* sendMessageToChannel (action: ReturnType<typeof SendMessageToChannel>) {
  const { data, channelId } = action.payload

  const requestData: OutgoingMessageToChannel = {
    messageType: 'text',
    channelId,
    data
  }
  client.sendMessage(requestData, 'sendMessage')
}

export function* sendMessageToUser (action: ReturnType<typeof SendMessageToUser>) {
  const { data, userId } = action.payload

  const requestData: OutgoingMessageToUser = {
    messageType: 'text',
    userId,
    data
  }
  client.sendMessage(requestData, 'sendMessage')
}

export function* sendMultimediaMessage (action: ReturnType<typeof SendMultimediaMessage>) {
  client.sendMultimediaMessage(action.payload)
  yield put(ClearAllAttachments())
}

export function* sendVideoMessage (action: ReturnType<typeof SendVideoMessage>) {
  client.sendVideoMessage(action.payload)
}

export function* createChannel (action: ReturnType<typeof CreateChannel>) {
  client.sendMessage({ ...action.payload }, 'createChannel')
}

export function* archiveChannel (action: ReturnType<typeof ArchiveChannel>) {
  client.sendMessage({ ...action.payload }, 'archiveChannel')
}

export function* markAsRead (action: ReturnType<typeof MarkAsRead>) {
  client.sendMessage({ ...action.payload }, 'markAsRead')

  /* acknowledge any active notifications we have for this channel */
  const { channelId } = action.payload
  const notifications = yield select(getActiveMessageNotificationsByChannelId, channelId)
  for (let i in notifications) {
    const { id } = notifications[i]
    yield fork(acknowledgeNotification, id)
  }
}

function* acknowledgeNotification (id: EntityId) {
  yield put(Acknowledge({ id }))
}

export function* touch (action: ReturnType<typeof Touch>) {
  client.sendMessage({ ...action.payload }, 'touch')
}

export function* authenticate (_action: ReturnType<typeof Authenticate>) {
  client.sendMessage({}, 'auth')
  yield put(ChangeConnectedStatus(true))
}

export function* wsEventChannel (_action: ReturnType<typeof Connect>) {
  try {
    // WebSocket is closing or closed
    const isAuthenticated: boolean = yield select(hasAuthenticated)
    if (!isAuthenticated) {
      // Set state.chat.loadingUsers to false so that routes can load
      // allowing us to redirect to login page
      yield take(LoginSuccess.TYPE)
    }
    client = new ChatClient()
    const socketURL: string = yield select(socketURLSelector)
    const token: string = yield select(getAuthToken)
    client.setSocketURL = socketURL
    client.setToken = token
    const channel = yield call(wsInitChannel, client)
    while (true) {
      const action = yield take(channel)
      yield put(action)

    }
  } catch (error) {
    put(OpenModal({ modal: 'chatDisconnect' }))
    console.warn('Error:', error.message)
  }
}

export function* setSubscription (action: ReturnType<typeof SetSubscription>) {
  client.sendMessage({ ...action.payload }, 'setSubscription')
}

export function* unknownTransaction (action: ReturnType<typeof UnknownTransact>) {
  console.warn('error', action)
}

export function* transactionError (action: ReturnType<typeof TransactError>) {
  const { message } = action.payload
  yield put(ShowNotificationPopUp({ type: 'error', content: message }))
}

export function* close (_action: ReturnType<typeof Close>) {
  client.disconnect()
}

export function* saga () {
  yield takeEvery(Authenticate.TYPE, authenticate)
  yield takeEvery(ArchiveChannel.TYPE, archiveChannel)
  yield takeLatest(Close.TYPE, close)
  yield takeLatest(Connect.TYPE, wsEventChannel)
  yield takeEvery(CreateChannel.TYPE, createChannel)
  yield takeEvery(MarkAsRead.TYPE, markAsRead)
  yield takeEvery(SendMessageToChannel.TYPE, sendMessageToChannel)
  yield takeEvery(SendMessageToUser.TYPE, sendMessageToUser)
  yield takeEvery(SendMultimediaMessage.TYPE, sendMultimediaMessage)
  yield takeEvery(SendVideoMessage.TYPE, sendVideoMessage)
  yield takeEvery(UnknownTransact.TYPE, unknownTransaction)
  yield takeLatest(Touch.TYPE, touch)
  yield takeEvery(SetSubscription.TYPE, setSubscription)
}
