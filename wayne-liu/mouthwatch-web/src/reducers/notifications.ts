import * as Actions from '#/actions/notifications'

import { EntityId, Notification, NotificationPayloadType } from '#/types'
import { TypedReducer, setWith } from 'redoodle'

import localforage from 'localforage'
import { persistReducer } from 'redux-persist'
import { unionBy } from 'lodash'

const {
  Poll,
  PollSuccess,
  PollError,
  AcknowledgeSuccess,
  AcknowledgeError,
  FetchHistoryError,
  SendError,
  NotifyBrowser,
  NotifyBrowserError
} = Actions

export const stateNamespace = 'notifications'

// State

export interface State {
  fetching: boolean
  perPage: number
  count: number
  currentPage?: number
  activeNotifications: Notification<NotificationPayloadType>[]
  notificationHistory: Notification<NotificationPayloadType>[]
  pollError?: Error
  acknowledgeError?: Error
  fetchHistoryError?: Error
  sendError?: Error
  browserNotificationIds: EntityId[]
  browserNotificationError?: Error
}

export const initialState: State = {
  fetching: false,
  activeNotifications: [],
  notificationHistory: [],
  browserNotificationIds: [],
  perPage: 100,
  count: 0
}

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(Poll.TYPE, (state) => {
    return setWith(state, {
      fetching: true
    })
  })

  reducer.withHandler(PollSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      fetching: false,
      activeNotifications: payload.page <= state.currentPage
        ? unionBy(payload.notifications, state.activeNotifications, 'id')
        : unionBy(state.activeNotifications, payload.notifications, 'id'),
      currentPage: payload.page,
      perPage: payload.perPage,
      count: payload.count,
      pollError: null
    })
  })

  reducer.withHandler(PollError.TYPE, (state, { error }) => {
    return setWith(state, {
      fetching: false,
      pollError: error
    })
  })

  reducer.withHandler(AcknowledgeSuccess.TYPE, (state, { id }) => {
    return setWith(state, {
      activeNotifications: state.activeNotifications.filter(obj => obj.id !== id),
      count: state.count - 1
    })
  })

  reducer.withHandler(AcknowledgeError.TYPE, (state, { error }) => {
    return setWith(state, {
      acknowledgeError: error
    })
  })

  reducer.withHandler(FetchHistoryError.TYPE, (state, { error }) => {
    return setWith(state, {
      fetchHistoryError: error
    })
  })

  reducer.withHandler(SendError.TYPE, (state, { error }) => {
    return setWith(state, {
      sendError: error
    })
  })

  reducer.withHandler(NotifyBrowser.TYPE, (state, payload) => {
    const { notification: { id } } = payload
    const browserNotificationIds = [...state.browserNotificationIds]
    if (!browserNotificationIds.includes(id)) {
      browserNotificationIds.push(id)
    }
    return setWith(state, {
      browserNotificationIds: browserNotificationIds,
      browserNotificationError: null
    })
  })

  reducer.withHandler(NotifyBrowserError.TYPE, (state, { error }) => {
    return setWith(state, {
      browserNotificationError: error
    })
  })

  return reducer.build()
}

export const reducer = persistReducer({
  key: 'notifications',
  storage: localforage,
  whitelist: ['browserNotificationIds']
}, createReducer())
