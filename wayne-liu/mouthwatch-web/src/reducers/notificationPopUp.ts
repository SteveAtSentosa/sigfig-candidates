import * as Actions from '#/actions/notificationPopUp'
import * as React from 'react'

import { TypedReducer, setWith } from 'redoodle'

const {
  ShowNotificationPopUpStart,
  HideNotificationPopUp
} = Actions

// State

export interface State {
  show: boolean
  type: string
  content: React.ReactNode
}

export const initialState: State = {
  show: false,
  type: '',
  content: null
}

// Reducer

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(ShowNotificationPopUpStart.TYPE, (state, payload) => {
    return setWith(state, {
      show: true,
      type: payload.type,
      content: payload.content
    })
  })

  reducer.withHandler(HideNotificationPopUp.TYPE, (state) => {
    return setWith(state, {
      show: false,
      type: '',
      content: null
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
