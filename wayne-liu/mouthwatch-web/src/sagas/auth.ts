import * as Actions from '#/actions/auth'
import * as Api from '#/api'
import * as React from 'react'

import { Account, EntityId, Patient, RoleName } from '#/types'
import { ClearPatientList, LoadPatientSuccess } from '#/actions/patients'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { ClearAppointmentList } from '#/actions/appointments'
import { ClearTaskList } from '#/actions/tasks'
import { Connect } from '#/microservice-middleware'
import { IoTConnect } from '#/actions/iot'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { UpdateAccount } from '#/actions/accounts'
import localForage from 'localforage'

// Sagas
export function* saga () {
  yield all([
    takeLatest(Actions.Login.TYPE, loginSaga),
    takeLatest(Actions.Logout.TYPE, logoutSaga),
    takeLatest(Actions.RegisterPatient.TYPE, registerPatientSaga),
    takeLatest(Actions.RegisterProvider.TYPE, registerProviderSaga),
    takeLatest(Actions.ConnectFacebook.TYPE, connectFacebookSaga),
    takeLatest(Actions.LoginFacebook.TYPE, loginFacebookSaga),
    takeLatest(Actions.ConnectGoogle.TYPE, connectGoogleSaga),
    takeLatest(Actions.LoginGoogle.TYPE, loginGoogleSaga),
    takeLatest(Actions.ValidateRegistration.TYPE, validateRegistrationSaga),
    takeLatest(Actions.AcceptConsentPolicies.TYPE, acceptConsentPolicies)
  ])
}

export function* loginSaga (action: ReturnType<typeof Actions.Login>) {
  const { username, password, after = () => { /* no-op*/ } } = action.payload
  try {
    const loginRes: Api.LoginResponse = yield call(Api.login, username.trim(), password)
    const { updated_consent_policies, ...data } = loginRes
    yield put(Actions.LoginSuccess({ data }))
    if (updated_consent_policies) {
      yield put(Actions.SetUpdatedConsentPolicies({ consentPolicies: updated_consent_policies }))
    }
    after()
  } catch (error) {
    yield put(Actions.LoginError({ error }))
    after && after(error)
  }
}

export function* logoutSaga (action: ReturnType<typeof Actions.Logout>) {
  try {
    yield put(ClearPatientList())
    yield put(ClearTaskList())
    yield put(ClearAppointmentList())
    yield localForage.removeItem('persist:root')
    yield localForage.clear()
    if (action.payload.redirect) {
      window.location.href = action.payload.redirect
    }
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Error: ' + error.message }))
  }
}

export function* validateRegistrationSaga (action: ReturnType<typeof Actions.ValidateRegistration>) {
  const { after = () => { /* no-op*/ } } = action.payload
  try {
    const { email, one_time_password } = action.payload
    const { group_consent_policy } = yield call(Api.validateRegistration, email, one_time_password)
    after(group_consent_policy)
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
  }
}

export function* registerPatientSaga (action: ReturnType<typeof Actions.RegisterPatient>) {
  const { after = () => { /* no-op*/ } } = action.payload
  try {
    const { email, one_time_password, password } = action.payload
    const data: Api.LoginResponse = yield call(Api.registerPatient, email, one_time_password, password)

    // Connect to microservice and iot
    yield put(Connect())
    yield put(IoTConnect())

    const { data: account }: Api.DataResponse<Account> = yield call(Api.getAccountFromLambda(data.token), data.account.id)
    const { data: patient }: Api.DataResponse<Patient> = yield call(Api.getPatientFromLambda(data.token), account.patient_id)
    yield put(LoadPatientSuccess({ patient }))
    yield put(Actions.RegisterSuccess({ data }))
    after(patient.id)
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(Actions.RegisterError({ error }))
    after && after(error)
  }
}

export function* registerProviderSaga (action: ReturnType<typeof Actions.RegisterProvider>) {
  const { username, one_time_password, password, after = () => { /* no-op*/ } } = action.payload
  try {
    const data: Api.LoginResponse = yield call(Api.registerProvider, username, one_time_password, password)
    const roles: RoleName[] = data.account.account_roles.map(role => role.name)
    yield put(Actions.RegisterSuccess({ data }))
    after && after(roles)
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(Actions.RegisterError({ error }))
    after && after(error)
  }
}

export function* connectFacebookSaga (action: ReturnType<typeof Actions.ConnectFacebook>) {
  try {
    const { authToken } = yield select(getAuthToken)
    const { accountId, facebookId, accessToken } = action.payload
    yield call(Api.connectFacebook(authToken), accountId, facebookId, accessToken)
    yield refreshUser(accountId)
    yield put(Actions.ConnectFacebookSuccess())
    const successMessage = React.createElement('div', null, 'Facebook acount connected')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(Actions.ConnectFacebookError({ error }))
  }
}

export function* loginFacebookSaga (action: ReturnType<typeof Actions.LoginFacebook>) {
  try {
    const { facebookId, accessToken } = action.payload
    const data: Api.LoginResponse = yield call(Api.loginFacebook, facebookId, accessToken)
    yield put(Actions.LoginSuccess({ data }))
    window.location.href = '/'
  } catch (error) {
    yield put(Actions.LoginError({ error }))
  }
}

export function* connectGoogleSaga (action: ReturnType<typeof Actions.ConnectGoogle>) {
  try {
    const { authToken } = yield select(getAuthToken)
    const { accountId, idToken } = action.payload
    yield call(Api.connectGoogle(authToken), accountId, idToken)
    yield refreshUser(accountId)
    yield put(Actions.ConnectGoogleSuccess())
    const successMessage = React.createElement('div', null, 'Google account connected')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(Actions.ConnectGoogleError({ error }))
  }
}

export function* loginGoogleSaga (action: ReturnType<typeof Actions.LoginGoogle>) {
  try {
    const { idToken } = action.payload
    const data: Api.LoginResponse = yield call(Api.loginGoogle, idToken)
    yield put(Actions.LoginSuccess({ data }))
    window.location.href = '/'
  } catch (error) {
    yield put(Actions.LoginError({ error }))
  }
}

function* refreshUser (accountId: EntityId) {
  const { authToken } = yield select(getAuthToken)
  // refresh the auth user data
  const { data: updatedAccount } = yield call(Api.getAccountFromLambda(authToken), accountId)
  yield put(Actions.RefreshUser({ account: updatedAccount as Api.LoginResponseAccount }))
}

function* acceptConsentPolicies () {
  try {
    const authAccount = yield select(getAuthAccount)
    const { id, updated_at } = authAccount
    const op = 'agreed_to_consent_policy_at' in authAccount ? 'replace' : 'add'
    const data: Api.PatchedEntity = { agreed_to_consent_policy_at: { value: (new Date()).toISOString(), op } }
    yield put(UpdateAccount({ id, data, updated_at }))
    yield put(Actions.AcceptConsentPoliciesSuccess())
  } catch (error) {
    yield put(Actions.AcceptConsentPoliciesError({ error }))
  }
}
