import * as Actions from '#/actions/auth'
import * as Api from '#/api'

import { TypedReducer, setWith } from 'redoodle'
import { GroupConsentPolicy } from '#/types'

// State

export interface State {
  authing: boolean
  error?: Error
  data?: Api.LoginResponse
  socialMediaConnecting?: boolean
  redirectTo?: string
  updatedConsentPolicies?: GroupConsentPolicy[]
}

export const initialState: State = {
  authing: false
}

export const stateNamespace = 'auth'

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(Actions.Login.TYPE, (state) => {
    return setWith(state, {
      authing: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.LoginSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      data: payload.data,
      error: null
    })
  })

  reducer.withHandler(Actions.LoginError.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      error: payload.error
    })
  })

  reducer.withHandler(Actions.Logout.TYPE, (state) => {
    localStorage.clear()
    return setWith(state, {
      authing: false,
      error: undefined,
      data: undefined
    })
  })

  reducer.withHandler(Actions.RefreshUser.TYPE, (state, payload) => {
    const { account } = payload

    const newData = { ...state.data, account: { ...state.data.account, ...account } }
    return setWith(state, {
      data: newData
    })
  })

  reducer.withHandler(Actions.RegisterPatient.TYPE, (state) => {
    return setWith(state, {
      authing: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.RegisterSuccess.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      data: payload.data,
      error: null
    })
  })

  reducer.withHandler(Actions.RegisterError.TYPE, (state, payload) => {
    return setWith(state, {
      authing: false,
      error: payload.error
    })
  })

  reducer.withHandler(Actions.ConnectFacebook.TYPE, (state) => {
    return setWith(state, {
      socialMediaConnecting: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.ConnectFacebookSuccess.TYPE, (state) => {
    return setWith(state, {
      socialMediaConnecting: false,
      error: null
    })
  })

  reducer.withHandler(Actions.ConnectFacebookError.TYPE, (state, { error }) => {
    return setWith(state, {
      socialMediaConnecting: false,
      error
    })
  })

  reducer.withHandler(Actions.LoginFacebook.TYPE, (state) => {
    return setWith(state, {
      authing: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.ConnectGoogle.TYPE, (state) => {
    return setWith(state, {
      socialMediaConnecting: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.ConnectGoogleSuccess.TYPE, (state) => {
    return setWith(state, {
      authing: false,
      error: null
    })
  })

  reducer.withHandler(Actions.ConnectGoogleError.TYPE, (state, { error }) => {
    return setWith(state, {
      authing: false,
      error: error
    })
  })

  reducer.withHandler(Actions.LoginGoogle.TYPE, (state) => {
    return setWith(state, {
      authing: true,
      error: undefined
    })
  })

  reducer.withHandler(Actions.SetRedirectAfterAuth.TYPE, (state, { redirectTo }) => {
    return setWith(state, {
      redirectTo
    })
  })

  reducer.withHandler(Actions.ClearRedirectAfterAuth.TYPE, (state) => {
    return setWith(state, {
      redirectTo: null
    })
  })

  reducer.withHandler(Actions.SetUpdatedConsentPolicies.TYPE, (state, { consentPolicies }) => {
    return setWith(state, {
      updatedConsentPolicies: consentPolicies
    })
  })

  reducer.withHandler(Actions.AcceptConsentPolicies.TYPE, (state) => {
    return setWith(state, {
      error: undefined
    })
  })

  reducer.withHandler(Actions.AcceptConsentPoliciesSuccess.TYPE, (state) => {
    return setWith(state, {
      error: undefined,
      updatedConsentPolicies: undefined
    })
  })

  reducer.withHandler(Actions.AcceptConsentPoliciesError.TYPE, (state, { error }) => {
    return setWith(state, {
      error: error
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
