import { ClientState, Transaction, WSReadyState } from './types'
import { Init, SetReadyState, Transact, UnknownTransact } from './actions'
import { TypedReducer, setWith } from 'redoodle'

const transactInsert = (state: ClientState, transaction: Transaction): ClientState => {
  const { users, channels } = state
  switch (transaction.entityType) {
    case 'user':
      return { ...state, users: [...users, transaction.data] }
    case 'channel':
      return { ...state, channels: [...channels, transaction.data] }
    case 'message':
      return { ...state, channels: channels.map((c) => c.id === transaction.throughId ? { ...c, messages: [...c.messages, transaction.data] } : c) }
    case 'userToChannel':
      return { ...state, channels: channels.map((c) => c.id === transaction.throughId ? { ...c, userToChannels: [...c.userToChannels, transaction.data] } : c) }
    default:
      return state
  }
}

const transactUpdate = (state: ClientState, transaction: Transaction): ClientState => {
  const { users, channels } = state
  switch (transaction.entityType) {
    case 'user':
      return { ...state, users: users.map(u => u.id === transaction.entityId ? transaction.data : u) }
    case 'channel':
      return { ...state, channels: channels.map(c => c.id === transaction.entityId ? transaction.data : c) }
    case 'message':
      return { ...state, channels: channels.map((c) => {
        return (c.id === transaction.throughId) ? { ...c, messages: c.messages.map(m => m.id === transaction.entityId ? transaction.data : m) } : c
      }) }
    case 'userToChannel':
      return { ...state, channels: channels.map((c) => {
        return (c.id === transaction.throughId) ? { ...c, userToChannels: c.userToChannels.map(u => u.id === transaction.entityId ? transaction.data : u) } : c
      }) }
    case 'subscription': {
      switch (transaction.throughType) {
        case 'channel': {
          // We are updating the subscriptions for a channel
          let stateSubscriptions = state.subscriptions
          for (const subIdx in stateSubscriptions) {
            // look through out current subscriptions
            const sub = stateSubscriptions[subIdx]
            if (sub.entityType === 'channel') {
              // if it's a channel subscription...
              for (const _subIdx in sub.subscriptions) {
                const _sub = sub.subscriptions[_subIdx]
                // look through the channel subscription's message subscriptions
                if (_sub.throughId === transaction.throughId) {
                  // we found a match, so we set it
                  state.subscriptions[subIdx][_subIdx] = transaction.data
                  // then return the new state
                  return state
                }
              }
            }
          }
          // If we've made it to this point, it means we need to add this subscription
          for (const subIdx in stateSubscriptions) {
            // look through out current subscriptions
            const sub = stateSubscriptions[subIdx]
            if (sub.entityType === 'channel') {
              // if it's a channel subscription, we append our data
              state.subscriptions[subIdx].subscriptions.push(transaction.data)
              // then return the new state data
              return state
            }
          }
          break
        }
        default:
          return state
      }
      break
    }
    default:
      return state
  }
}

const transactSet = (state: ClientState, transaction: Transaction): ClientState => {
  const { channels } = state
  switch (transaction.entityType) {
    case 'messages':
      return { ...state, channels: channels.map((c) => {
        return (c.id === transaction.throughId) ? { ...c, messages: transaction.data } : c
      }) }
    default:
      return state
  }
}

export const initialClientState: ClientState = {
  users: [],
  channels: [],
  subscriptions: [],
  lastTransaction: 0,
  readyState: null
}

function createReducer () {
  const reducer = TypedReducer.builder<ClientState>()

  reducer.withDefaultHandler((state = initialClientState, _action) => {
    return setWith(state, state)
  })

  reducer.withHandler(Init.TYPE, (state, payload) => {
    return setWith(state, payload.initialState)
  })

  reducer.withHandler(Transact.TYPE, (state, payload) => {
    const { transaction } = payload
    switch (transaction.type) {
      case 'insert': {
        return setWith(state, transactInsert(state, transaction))
      }
      case 'update': {
        return setWith(state, transactUpdate(state, transaction))
      }
      case 'set': {
        return setWith(state, transactSet(state, transaction))
      }
      default: {
        console.warn('Unknown Transaction Type:', transaction)
        return setWith(state, state)
      }
    }
  })

  reducer.withHandler(UnknownTransact.TYPE, (state, payload) => {
    const { data } = payload
    console.warn('Unknown Transaction Type:', data)
    return setWith(state, state)
  })

  reducer.withHandler(SetReadyState.TYPE, (state, readyState) => {
    const readyStates: WSReadyState[] = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
    return setWith(state, { readyState: readyStates[readyState] })
  })

  return reducer.build()
}

export const stateSyncReducer = createReducer()
