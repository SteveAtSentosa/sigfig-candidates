import * as Api from '#/api'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as Actions from '#/actions/password'

const {
  ForgotPassword,
  ForgotPasswordSuccess,
  ForgotPasswordError,
  ResetPassword,
  ResetPasswordSuccess,
  ResetPasswordError
} = Actions

// Sagas

export function* saga () {
  yield all([
    takeLatest(ForgotPassword.TYPE, forgotPasswordSaga),
    takeLatest(ResetPassword.TYPE, resetPasswordSaga)
  ])
}

export function* forgotPasswordSaga (action: ReturnType<typeof ForgotPassword>) {
  try {
    const { username } = action.payload
    const data = yield call(Api.forgotPassword, username)
    const { status } = data
    yield put(ForgotPasswordSuccess({ status }))
  } catch (error) {
    yield put(ForgotPasswordError({ error }))
  }
}

export function* resetPasswordSaga (action: ReturnType<typeof ResetPassword>) {
  try {
    const { password, token } = action.payload
    yield call(Api.resetPassword, token, password)
    yield put(ResetPasswordSuccess({ status: true }))
  } catch (error) {
    yield put(ResetPasswordError({ error }))
  }
}
