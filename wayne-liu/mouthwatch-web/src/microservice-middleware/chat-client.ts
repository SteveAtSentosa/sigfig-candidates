import { OutgoingData, OutgoingDataType, OutgoingMediaMessage, OutgoingVideoMessage, Response } from './types'

export function fetchSocketURL (window: any = null): string {
  console.warn('You are using the \'fetchSocketURL\' helper function.\n Be sure to replace this with your own implementation before deploying to production.')
  if (window) {
    return `${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${window.location.host}/ws`
  } else {
    return 'ws://localhost:8999/ws'
  }
}

export class ChatClient {

  private _ws: WebSocket | null
  private _token: string | null
  private _socketURL: string
  private _onOpen: (this: WebSocket, ev: Event) => any
  private _onClose: (this: WebSocket, ev: CloseEvent) => any
  private _onMessage: (response: Response) => void
  private _onError: (this: WebSocket, ev: Event) => any

  get hasWS () {
    return this._ws !== undefined
  }

  get wsReadyState () {
    return this._ws && this._ws.readyState
  }

  set onOpen (func: (this: WebSocket, ev: Event) => any) {
    this._onOpen = func
  }

  set onClose (func: (this: WebSocket, ev: CloseEvent) => any) {
    this._onClose = func
  }

  set onMessage (func: (response: Response) => void) {
    this._onMessage = func
  }

  set onError (func: (this: WebSocket, ev: Event) => any) {
    this._onError = func
  }

  set setToken (token: string) {
    this._token = token
  }

  get token () {
    return this._token
  }

  set setSocketURL (url: string) {
    this._socketURL = url
  }

  sendMultimediaMessage (mediaMessage: OutgoingMediaMessage) {
    const stringData: OutgoingData = { ...mediaMessage, data: JSON.stringify(mediaMessage.data) }
    this._ws.send(JSON.stringify({ ...stringData, token: this._token, type: 'sendMessage' }))
  }

  sendVideoMessage (videoMessage: OutgoingVideoMessage) {
    const stringData: OutgoingData = { ...videoMessage, data: JSON.stringify(videoMessage.data) }
    this._ws.send(JSON.stringify({ ...stringData, token: this._token, type: 'sendMessage' }))

  }

  sendMessage (data: OutgoingData, type: OutgoingDataType) {
    const wsRequest = { token: this._token, ...data, type }
    this._ws.send(JSON.stringify(wsRequest))
  }

  connect () {
    if (this._token === null) {
      throw new Error('"token" must be set on client using "setToken" method before connection.')
    }

    if (this._socketURL === null) {
      throw new Error('"socketURL" must be set on client using "setSocketURL" method before connection.')
    }
    this._ws = new WebSocket(this._socketURL)

    this._ws.onopen = this._onOpen

    this._ws.onclose = this._onClose

    this._ws.onerror = this._onError

    this._ws.onmessage = evt => {
      try {
        const response: Response = JSON.parse(evt.data)
        this._onMessage(response)
      } catch (e) {
        console.error(e)
        console.error('Received Error Response', evt.data)
      }
    }
  }

  disconnect () {
    return this._ws && this._ws.close()
  }
}
