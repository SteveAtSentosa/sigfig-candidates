import * as Actions from '#/actions/signup'

import { TypedReducer, setWith } from 'redoodle'

// State

export interface State {
  creating: boolean
  error?: Error
}

export const initialState: State = {
  creating: false
}

export const stateNamespace = 'signup'

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(Actions.SignUp.TYPE, (state) => {
    return setWith(state, {
      creating: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.SignUpSuccess.TYPE, (state) => {
    return setWith(state, {
      creating: false,
      error: undefined
    })
  })

  reducer.withHandler(Actions.SignUpError.TYPE, (state, payload) => {
    return setWith(state, {
      creating: false,
      error: payload.error
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
