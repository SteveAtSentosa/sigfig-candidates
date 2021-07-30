import * as Actions from '#/actions/accounts'
import * as Api from '#/api'

import { AccountLookup, Role } from '#/types'
import { assign, merge, uniq, uniqBy } from 'lodash'

import { TypedReducer } from 'redoodle'
import produce from 'immer'

// State
export interface AccountMeta {
  roles: Role[]
  fetching?: boolean
  saving?: boolean
  perPage: number
  count: number
  currentPage?: number
  creating: boolean
  inviting: boolean
  savingAvatar?: boolean
  error: Error
}

export interface AccountSearch {
  where?: Api.WhereValue[]
  page?: number
  fetching: boolean
  results: string[]
  error?: Error
}

export interface QuickAddSearch {
  fetching: boolean
  results: string[]
  error?: Error
}

export interface State {
  accounts: AccountLookup // Account dictionary
  accountIds: string[] // An ordered list of account id's as they're received.
  search: AccountSearch
  meta: AccountMeta
  quickAddSearch: QuickAddSearch
}

const initialAccounts = {}
initialAccounts[Symbol.iterator] = function () {

  // get the properties of the object
  const properties = Object.keys(this)
  let count = 0
  // set to true when the loop is done
  let isDone = false

  // define the next method, need for iterator
  const next = () => {
     // control on last property reach
    if (count >= properties.length) {
      isDone = true
    }
    return { done: isDone, value: this[properties[count++]] }
  }

  // return the next method used to iterate
  return { next }
}

export const initialState: State = {
  accounts: initialAccounts as AccountLookup,
  accountIds: [],
  search: {
    fetching: false,
    results: []
  },
  quickAddSearch: {
    fetching: false,
    results: []
  },
  meta: {
    roles: [],
    fetching: false,
    creating: false,
    inviting: false,
    count: 0,
    saving: false,
    perPage: 10,
    savingAvatar: false,
    error: null
  }
}

export const stateNamespace = 'accounts'

// Reducer
function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(Actions.InviteUserToPatientPortal.TYPE, (state) => {
    return produce(state, (draft) => {
      draft.meta.inviting = true
    })
  })

  reducer.withHandler(Actions.InviteSuccess.TYPE, (state) => {
    return produce(state, (draft) => {
      draft.meta.inviting = false
    })
  })

  reducer.withHandler(Actions.InviteError.TYPE, (state, { error }) => {
    return produce(state, (draft) => {
      draft.meta.inviting = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.GetAccounts.TYPE, (state) => {
    return produce(state, (draft) => {
      const search: AccountSearch = {
        fetching: true,
        results: []
      }
      draft.search = search
      draft.meta.fetching = true
    })
  })

  reducer.withHandler(Actions.GetAccountsSuccess.TYPE, (state, payload) => {
    const { accounts, accountIds , page, per_page, count, search } = payload

    return produce(state, (draft) => {
      draft.accounts = merge(draft.accounts, accounts)
      draft.accountIds = accountIds
      draft.search = search
      draft.meta.fetching = false
      draft.meta.currentPage = page
      draft.meta.perPage = per_page
      draft.meta.count = count
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.GetAccountsError.TYPE, (state, { error }) => {
    return produce(state, (draft) => {
      const search: AccountSearch = {
        fetching: true,
        results: [],
        error: error
      }
      draft.search = search
      draft.meta.fetching = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.LoadAccountGroupsSuccess.TYPE, (state, payload) => {
    const { id, groups } = payload
    const existingGroups = 'groups' in state.accounts[id]

    return produce(state, (draft) => {
      draft.accounts[id]['groups'] = existingGroups ? uniqBy([...draft.accounts[id].groups, ...groups], 'id') : groups
      draft.accounts[id]['groups'] = groups
    })
  })

  reducer.withHandler(Actions.LoadAccountMediaSuccess.TYPE, (state, payload) => {
    const { id, media } = payload
    const existingMedia = 'media' in state.accounts[id]
    return produce(state, (draft) => {
      draft.accounts[id]['media'] = existingMedia ? uniqBy([...draft.accounts[id].media, ...media], 'id') : media
    })
  })

  reducer.withHandler(Actions.GetAccountsForPracticeEdit.TYPE, (state) => {
    return produce(state, (draft) => {
      draft.quickAddSearch.fetching = true
    })
  })

  reducer.withHandler(Actions.GetAccountsForPracticeEditSuccess.TYPE, (state, { accounts, accountIds }) => {
    return produce(state, (draft) => {
      draft.accounts = merge(draft.accounts, accounts)
      draft.quickAddSearch.results = accountIds
      draft.quickAddSearch.fetching = false
    })
  })

  reducer.withHandler(Actions.GetAccountsForPracticeEditError.TYPE, (state, { error }) => {
    return produce(state, (draft) => {
      draft.meta.error = error
      draft.quickAddSearch.fetching = false
      draft.quickAddSearch.error = error
    })
  })

  reducer.withHandler(Actions.GetAccountById.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.fetching = true
    })
  })

  reducer.withHandler(Actions.GetAccountByIdSuccess.TYPE, (state, { account, accountId }) => {
    return produce(state, draft => {
      draft.meta.fetching = false
      draft.meta.error = null
      draft.accounts = assign(draft.accounts, account)
      draft.accountIds = uniq(draft.accountIds.concat(accountId))
    })
  })

  reducer.withHandler(Actions.GetAccountByIdError.TYPE, (state, { error }) => {
    return produce(state, draft => {
      draft.meta.fetching = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.ChangePassword.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.saving = true
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.ChangePasswordSuccess.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.saving = false
    })
  })

  reducer.withHandler(Actions.ChangePasswordError.TYPE, (state, { error }) => {
    return produce(state, draft => {
      draft.meta.saving = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.UpdateAccount.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.saving = true
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.UpdateAccountSuccess.TYPE, (state, { account, accountId }) => {
    return produce(state, draft => {
      draft.accounts = assign(draft.accounts, account)
      draft.accountIds = uniq(draft.accountIds.concat(accountId))
      draft.meta.saving = false
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.UpdateAccountError.TYPE, (state, { error }) => {
    return produce(state, draft => {
      draft.meta.saving = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.SaveAccountAvatar.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.saving = true
    })
  })

  reducer.withHandler(Actions.SaveAccountAvatarEnd.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.saving = false
    })
  })

  reducer.withHandler(Actions.GetAccountRoles.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.fetching = true

    })
  })

  reducer.withHandler(Actions.GetAccountRolesSuccess.TYPE, (state, { roles }) => {
    return produce(state, draft => {
      draft.meta.fetching = false
      draft.meta.roles = roles
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.GetAccountRolesError.TYPE, (state, { error }) => {
    return produce(state, draft => {
      draft.meta.fetching = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.CreateAccount.TYPE, (state) => {
    return produce(state, draft => {
      draft.meta.creating = true
    })
  })

  reducer.withHandler(Actions.CreateAccountSuccess.TYPE, (state) => {
    // FIXME: This should return the account and update the state.
    return produce(state, draft => {
      draft.meta.creating = false
      draft.meta.error = null
    })
  })

  reducer.withHandler(Actions.CreateAccountError.TYPE, (state, { error }) => {
    return produce(state, draft => {
      draft.meta.creating = false
      draft.meta.error = error
    })
  })

  reducer.withHandler(Actions.AdminToolsSearchAccounts.TYPE, (state) => {
    const search: AccountSearch = {
      fetching: true,
      results: []
    }
    return produce(state, (draft) => {
      draft.search = search
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
