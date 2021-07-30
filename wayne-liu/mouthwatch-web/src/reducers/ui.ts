import * as Actions from '#/actions/ui'

import { TypedReducer, setWith } from 'redoodle'

import { EntityId, SubscriptionStatus, ViewPermissions } from '#/types'

const {
  GetViewPermissions,
  GetViewPermissionsSuccess
} = Actions

// State
export interface State {
  permissions?: ViewPermissions
  groupId?: EntityId
  subscriptionStatus: SubscriptionStatus
  isPatient: boolean
  createdAt: string
  fetching: boolean
}

export const initialState: State = {
  permissions: null,
  groupId: null,
  subscriptionStatus: null,
  isPatient: false,
  createdAt: '',
  fetching: true
}

// Reducer
function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(GetViewPermissions.TYPE, (state) => {
    return setWith(state, {
      fetching: true
    })
  })

  reducer.withHandler(GetViewPermissionsSuccess.TYPE, (state, { viewPerms, groupId, subscriptionStatus, isPatient, createdAt }) => {
    return setWith(state, {
      permissions: viewPerms,
      groupId,
      subscriptionStatus,
      isPatient,
      createdAt,
      fetching: false
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
