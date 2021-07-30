import { Authenticate, CloseSuccess, Init, ResponseTransaction, SetReadyState, Transact, TransactError, UnknownTransact } from './actions'

import { ChatClient } from './chat-client'
import { Response } from './types'
import { eventChannel } from 'redux-saga'

export function wsInitChannel (client: ChatClient) {
  return eventChannel(emitter => {
    client.onOpen = (event) => {
      console.info('client is open', event)
      return emitter(Authenticate())
    }

    let readyState: number = null

    const interval = setInterval(() => {
      // Avoid calling unnecessarily
      if (readyState !== client.wsReadyState) {
        readyState = client.wsReadyState
        emitter(SetReadyState(client.wsReadyState))
      }
    }, 500)

    client.onClose = (event) => {
      console.info('client is closed!', event)
      return emitter(CloseSuccess())
    }

    client.onMessage = (data: Response) => {
      switch (data.type) {
        case 'init': {
          return emitter(Init({ initialState: data.state }))
        }
        case 'transaction': {
          return emitter(Transact({ transaction: data.transaction }))
        }
        case 'response': {
          return emitter(ResponseTransaction({ response: data }))
        }
        case 'error': {
          return emitter(TransactError({ message: data.message }))
        }
        default: {
          return emitter(UnknownTransact({ data }))
        }
      }
    }

    client.onError = (event) => {
      console.info('event: ', event)
    }

    if (!client.hasWS) {
      client.connect()
    }

    return () => {
      client.disconnect()
      clearInterval(interval)
    }
  })
}
