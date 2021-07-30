import * as Actions from '#/actions/sso'

import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import { GetAccountById } from '#/actions/accounts'
import { LoginSuccess } from '#/actions/auth'
import { getAccountByIdSaga } from '#/sagas/accounts'

const {
  SsoLogin,
  SsoLoginSuccess,
  SsoLoginError
} = Actions

// Sagas

export function* saga () {
  yield all([
    takeLatest(SsoLogin.TYPE, ssoLoginSaga)
  ])
}

export function* ssoLoginSaga (action: ReturnType<typeof SsoLogin>) {

  try {
    const { accountId, bounceTo, token } = action.payload
    yield call(getAccountByIdSaga, ({ type: '[accounts] get_account_by_id', payload: { id: accountId, ssoToken: token } } as ReturnType<typeof GetAccountById>))
    const account = yield select(state => state.accounts.accounts[accountId])
    yield put(LoginSuccess({ data: { token, account } }))
    yield put(SsoLoginSuccess({ bounceTo }))
  } catch (error) {
    yield put(SsoLoginError({ error: new Error(`Unable to SSO login: ${error.message}`) }))
  }
}
