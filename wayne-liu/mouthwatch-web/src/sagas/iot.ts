import * as Api from '#/api'

import { IoTClose, IoTConnect } from '#/actions/iot'
import { Notification, NotificationPayloadType } from '#/types'
import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import { getAuthAccount, getAuthToken, hasAuthenticated } from '#/actions/auth.selectors'
import mqtt, { MqttClient } from 'mqtt'

import { LoginSuccess } from '#/actions/auth'
import { Poll } from '#/actions/notifications'
import { ReloadAppointments } from '#/actions/appointments'
import { ReloadTasks } from '#/actions/tasks'
import config from '#/config'
import { eventChannel } from 'redux-saga'

export class IoTClient {

  private _mqttWS: MqttClient | null
  private _endpointURL: string
  private _onConnect: mqtt.OnConnectCallback = () => null
  private _onError: mqtt.OnErrorCallback = () => null
  private _onClose: Function = () => null
  private _onMessage: (topic: String, message: Object) => any = () => null

  get hasIoT () {
    return this._mqttWS !== undefined
  }

  get connected () {
    return this._mqttWS.connected
  }

  set onConnect (func: mqtt.OnConnectCallback) {
    this._onConnect = func
  }

  set onClose (func: Function) {
    this._onClose = func
  }

  set onError (func: mqtt.OnErrorCallback) {
    this._onError = func
  }

  set onMessage (func: (topic: string, message: Object) => any) {
    this._onMessage = func
  }

  set setEndpointURL (url: string) {
    this._endpointURL = url
  }

  subscribe (topic: string) {
    this._mqttWS.subscribe(topic)
  }

  connect (clientId: string) {
    if (this._endpointURL === null) {
      throw new Error('"socketURL" must be set on client using "setEndpointURL" method before connection.')
    }

    this._mqttWS = mqtt.connect(this._endpointURL, {
      clientId,
      reconnectPeriod: 0
    })

    this._mqttWS.on('connect', this._onConnect)

    this._mqttWS.on('close', this._onClose)

    this._mqttWS.on('error', this._onError)

    this._mqttWS.on('message', (topic: string, payload: Buffer) => {
      try {
        const response: Object = JSON.parse(payload.toString('utf8'))
        this._onMessage(topic, response)
      } catch (e) {
        console.error('Received Error Response', payload.toString('utf8'))
      }
    })
  }

  disconnect () {
    return this._mqttWS && this._mqttWS.end()
  }
}

export let client: IoTClient = null

function iotInitChannel (client: IoTClient, userId: string) {
  return eventChannel(emitter => {
    client.onConnect = () => {
      client.subscribe(`${config.iot.prefixTopic}/${userId}`)
    }

    const interval = setInterval(() => {
      if (!client.connected) {
        client.disconnect()
        emitter(IoTConnect())
      }
    }, config.iot.reconnectPeriod)

    client.onMessage = (_, message: Notification<NotificationPayloadType>) => {
      if (message.type === 'Task Assignee') {
        emitter(ReloadTasks())
      } else if (message.type === 'Appointment' || message.type === 'Appointment Change') {
        emitter(ReloadAppointments())
      }
      emitter(Poll({}))
    }

    if (!client.hasIoT) {
      client.connect(`${config.iot.prefixTopic}-${userId}-${Date.now()}`)
    }

    return () => {
      clearInterval(interval)
      client.disconnect()
    }
  })
}

export function* iotEventChannel (_action: ReturnType<typeof IoTConnect>) {
  try {
    // IoT Mqtt is closing or closed
    const isAuthenticated: boolean = yield select(hasAuthenticated)
    const user = yield select(getAuthAccount)

    if (!isAuthenticated) {
      yield take(LoginSuccess.TYPE)
    }

    client = new IoTClient()

    const authToken = yield select(getAuthToken)
    const iotEndpointRes: Api.DataResponse<string> = yield call(Api.getIoTEndpoint(authToken))

    client.setEndpointURL = iotEndpointRes.data

    const channel = yield call(iotInitChannel, client, user.id)
    while (true) {
      const action = yield take(channel)
      yield put(action)
    }
  } catch (error) {
    console.warn('Error:', error.message)
  }
}

export function* close (_action: ReturnType<typeof IoTClose>) {
  client.disconnect()
}

export function* saga () {
  yield takeLatest(IoTConnect.TYPE, iotEventChannel)
  yield takeLatest(IoTClose.TYPE, close)
}
