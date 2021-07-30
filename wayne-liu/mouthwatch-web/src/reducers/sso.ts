import { TypedReducer, setWith } from 'redoodle'
import * as Actions from '#/actions/sso'

const {
  SsoLogin,
  SsoLoginSuccess,
  SsoLoginError
} = Actions

// State

export interface State {
  authing: boolean
  error?: Error
  redirectUrl?: string
  isSSO?: boolean
}

export const initialState: State = {
  authing: false,
  isSSO: false
}

export const stateNamespace = 'sso'

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(SsoLogin.TYPE, (state) => {
    return setWith(state, {
      authing: true
    })
  })

  reducer.withHandler(SsoLoginError.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      error: payload.error
    })
  })

  reducer.withHandler(SsoLoginSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      redirectUrl: payload.bounceTo,
      isSSO: true,
      error: null
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
