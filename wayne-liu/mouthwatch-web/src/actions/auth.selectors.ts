import { AppState } from '#/redux'
import { select } from 'redux-saga/effects'

export function getAuthToken (state: AppState) {
  return state.auth.data && state.auth.data.token
}

export function hasAuthenticated (state: AppState) {
  return !!state.auth.data
}

export function getAuthAccount (state: AppState) {
  return state.auth.data ? state.auth.data.account : null
}

export function* withAuthToken (worker: (authToken: string) => Generator) {
  const authToken = yield select(getAuthToken)
  yield* worker(authToken) as any
}
