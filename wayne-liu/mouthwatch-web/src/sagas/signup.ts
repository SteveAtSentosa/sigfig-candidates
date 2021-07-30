import * as Actions from '#/actions/signup'
import * as Api from '#/api'

import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import { AdditionalUserFormValues } from '@m***/library'
import { Login } from '#/actions/auth'
import { getAuthToken } from '#/actions/auth.selectors'

// Sagas

export function* saga () {
  yield all([
    takeLatest(Actions.SignUp.TYPE, signUpSaga)
  ])
}

function formatRequestPayload (formValues: AdditionalUserFormValues): Api.AdditionalUserRequestPayload {
  const props = Object.keys(formValues)

  /*
    This reduce function formats the form values for the POST payload
  */
  const requestObj = props.reduce((obj, prop) => {
    const propValue = formValues[prop]
    if (Array.isArray(propValue)) {
      // e.g. [key]: [{ label: string, value: string }, ...] --> [key]: [value1, value2, ...]
      obj[prop] = propValue.map(p => p.value)
    } else if (typeof propValue === 'object') {
      // e.g. [key]: { label: string, value: string } --> [key]: value
      obj[prop] = propValue.value
    } else {
      obj[prop] = propValue.trim()
    }
    return obj
  }, {} as Api.AdditionalUserRequestPayload)

  return requestObj
}

export function* signUpSaga (action: ReturnType<typeof Actions.SignUp>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data, clearForm, redirectAfterAuth } = action.payload
    const {
      recaptcha_token,
      checkout: { recurly_token, ...checkoutValues },
      account_owner: { account_name, confirm_password, phone, ...accountOwnerValues },
      users
    } = data
    const { card_first_name, card_last_name, terms_agreed, selected_plan, ...addressValues } = checkoutValues

    const billing_information: Api.BillingInformationPayload = { ...addressValues, token: recurly_token }

    const plan_id = selected_plan.value

    const group: Api.GroupRequestPayload = { name: account_name, plan_id, phone }

    const account_owner: Api.AccountOwnerRequestPayload = accountOwnerValues

    const memberKeys = Object.keys(users)
    const members: Api.AdditionalUserRequestPayload[] = memberKeys.map(key => formatRequestPayload(users[key]))

    yield call(Api.teledentSignUp(authToken), recaptcha_token, group, account_owner, members, billing_information)
    yield put(Actions.SignUpSuccess())
    clearForm()
    const { email: username, password } = account_owner
    yield put(Login({ username, password, after: redirectAfterAuth }))
  } catch (e) {
    const error = new Error('This user is already in TeleDent')
    yield put(Actions.SignUpError({ error }))
    console.error(e.message)
  }
}
