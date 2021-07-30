import { TypedReducer, defineAction, setWith } from 'redoodle'

import { VideoSession } from '#/types'

// Actions

export const CreateSession = defineAction('[video] create_session')<{ participants: string[], autoLogin?: boolean, channelId?: string}>()
export const CreateSessionSuccess = defineAction('[video] create_session_success')<{ session: VideoSession }>()
export const CreateSessionError = defineAction('[video] create_session_error')<{ error: Error }>()

export const LoginToSession = defineAction('[video] login_to_session')<{ redirect_uri: string }>()
export const LoginToSessionSuccess = defineAction('[video] login_to_session_success')<{ login_uri: string }>()
export const LoginToSessionError = defineAction('[video] login_to_session_error')<{ error: Error }>()

// State

export interface State {
  creatingSession: boolean
  loggingIn: boolean
  createSessionError?: Error
  loginError?: Error
  videoSession?: VideoSession
  login_uri?: string
}

export const initialState: State = {
  creatingSession: false,
  loggingIn: false
}

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(CreateSession.TYPE, (state) => {
    return setWith(state, {
      creatingSession: true
    })
  })

  reducer.withHandler(CreateSessionSuccess.TYPE, (state, payload) => {

    return setWith(state, {
      creatingSession: false,
      videoSession: payload.session,
      createSessionError: null
    })
  })

  reducer.withHandler(CreateSessionError.TYPE, (state, payload) => {
    return setWith(state, {
      creatingSession: false,
      createSessionError: payload.error
    })
  })

  reducer.withHandler(LoginToSession.TYPE, (state) => {
    return setWith(state, {
      loggingIn: true
    })
  })

  reducer.withHandler(LoginToSessionSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      loggingIn: false,
      login_uri: payload.login_uri,
      loginError: null,
      videoSession: null,
      creatingSession: false
    })
  })

  reducer.withHandler(LoginToSessionError.TYPE, (state, payload) => {
    return setWith(state, {
      loggingIn: false,
      loginError: payload.error
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
