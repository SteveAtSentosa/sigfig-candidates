import { TypedReducer, setWith } from 'redoodle'
import * as Actions from '#/actions/password'

const {
  ForgotPassword,
  ForgotPasswordSuccess,
  ForgotPasswordError,
  ResetPassword,
  ResetPasswordSuccess,
  ResetPasswordError
} = Actions

// State

export interface State {
  loading: boolean
  error?: Error
  status?: boolean
}

export const initialState: State = {
  loading: false
}

export const stateNamespace = 'auth'

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(ForgotPassword.TYPE, (state) => {
    return setWith(state, {
      loading: true,
      error: undefined,
      status: undefined
    })
  })

  reducer.withHandler(ForgotPasswordSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      loading: false,
      status: payload.status,
      error: null
    })
  })

  reducer.withHandler(ForgotPasswordError.TYPE, (state, payload) => {
    return setWith(state, {
      loading: false,
      error: payload.error
    })
  })

  reducer.withHandler(ResetPassword.TYPE, (state) => {
    return setWith(state, {
      loading: true,
      error: undefined,
      status: undefined
    })
  })

  reducer.withHandler(ResetPasswordSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      loading: false,
      status: payload.status,
      error: null
    })
  })

  reducer.withHandler(ResetPasswordError.TYPE, (state, payload) => {
    return setWith(state, {
      loading: false,
      error: payload.error
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
