import * as React from 'react'

import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { TypedActionDefinition2 } from 'redoodle'
import { put } from 'redux-saga/effects'

export function* handleSuccessWithMessage<P = undefined> (message: string, SuccessAction: TypedActionDefinition2<string, P>, payload: P, after: Function) {
  yield put(SuccessAction(payload))
  const successMessage = React.createElement('div', null, message)
  yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))

  if (after) {
    after()
  }
}

export function* handleErrorWithMessage (message: string, ErrorAction: TypedActionDefinition2<string, undefined>) {
  yield put(ErrorAction())
  const errorMessage = React.createElement('div', null, message)
  yield put(ShowNotificationPopUp({ type: 'error', content: (errorMessage) }))
}
