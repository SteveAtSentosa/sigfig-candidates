import * as Actions from '#/actions/accounts'
import * as Api from '#/api'
import * as React from 'react'

import { Account, AccountLookup, EntityId, Group, Option } from '#/types'
import { AccountEntity, accountListSchema } from '#/schemas/accounts'
import { AccountSearch, QuickAddSearch } from '#/reducers/accounts'
import { AddAvatar, ClearAvatars } from '#/actions/avatars'
import { CreateChannel, Touch } from '#/microservice-middleware'
import { LoadPatient, LoadPatientDetails } from '#/actions/patients'
import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { differenceBy, isObject, merge, uniqBy } from 'lodash'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { CreateChannelAutoSelect } from '#/actions/chat'
import { CreateMedia } from '#/actions/media'
import { OpenModal } from '#/actions/modals'
import { RefreshUser } from '#/actions/auth'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { ThrowCollisionStart } from '#/actions/collisions'
import constructLambdaURL from '#/utils/AvatarLambdaUrl'
import { normalize } from 'normalizr'

// import { GetChildGroups } from '#/actions/groups'
const {
  GetAccounts,
  GetAccountsSuccess,
  GetAccountsError,
  GetAccountsForPracticeEdit,
  GetAccountsForPracticeEditSuccess,
  GetAccountsForPracticeEditError,
  GetAccountById,
  GetAccountByIdSuccess,
  GetAccountByIdError,
  LoadAccountMediaSuccess,
  LoadAccountGroupsSuccess,
  GetAccountRoles,
  ChangePassword,
  CreateAccount,
  CreateAccountSuccess,
  CreateAccountError,
  UpdateAccount,
  UpdateAccountSuccess,
  UpdateAccountError,
  UpdateSMSOptStatus,
  SaveAccountAvatar,
  SaveAccountAvatarEnd,
  GetAccountRolesSuccess,
  GetAccountRolesError,
  ChangePasswordSuccess,
  ChangePasswordError,
  InviteUserToPatientPortal,
  InviteSuccess,
  InviteError,
  AdminToolsSearchAccounts,
  SetDefaultAvatar
} = Actions

// Sagas

export function* saga () {
  yield all([
    takeEvery(GetAccounts.TYPE, getAccountsSaga),
    takeEvery(GetAccountsForPracticeEdit.TYPE, getAccountsForPracticeEditSaga),
    takeEvery(GetAccountById.TYPE, getAccountByIdSaga),
    takeEvery(GetAccountRoles.TYPE, getAccountRolesSaga),
    takeLatest(ChangePassword.TYPE, changePasswordSaga),
    takeLatest(CreateAccount.TYPE, createAccountSaga),
    takeLatest(UpdateAccount.TYPE, updateAccountSaga),
    takeLatest(InviteUserToPatientPortal.TYPE, inviteUserSaga),
    takeLatest(SaveAccountAvatar.TYPE, saveAccountAvatarSaga),
    takeLatest(AdminToolsSearchAccounts.TYPE, adminToolsSearchAccountsSaga),
    takeLatest(SetDefaultAvatar.TYPE, setDefaultAvatarSaga),
    takeLatest(UpdateSMSOptStatus.TYPE, updateSMSOptInSaga)
  ])
}

export function* updateSMSOptInSaga (action: ReturnType<typeof UpdateSMSOptStatus>) {
  const { sms_opt_in, phone, is_registration, after } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const { id } = yield select(getAuthAccount)

    // TODO: update to Lambda patch account
    yield call(Api.updateSMSOptStatus(authToken), sms_opt_in, phone, is_registration)

    const { data: updatedAccount } = yield call(Api.getAccountFromLambda(authToken), id)

    // After editing, update account in list
    const currentAccount = yield select(state => state.accounts.accounts[id])
    const { entities: { accounts: account }, result: accountId } = normalize<AccountLookup, AccountEntity, string[]>([updatedAccount], accountListSchema)
    account[id] = { ...currentAccount, ...account[id] }

    yield put(UpdateAccountSuccess({ account, accountId }))

    yield put(RefreshUser({ account: updatedAccount as Api.LoginResponseAccount }))

    if (is_registration) {
      yield put(OpenModal({ modal: 'patientWelcome' }))
    } else {
      const successMessage = React.createElement('div', null, 'Notification status updated')
      yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
    }
    if (after) after()

  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
  }
}

export function* inviteUserSaga (action: ReturnType<typeof InviteUserToPatientPortal>) {
  try {
    const authToken = yield select(getAuthToken)
    const { accountId, createAndSelectChannel } = action.payload
    /*
      This saga attempts to handle both cases so that components can send either accountId or patientId
      At least one value is required, or it will error
      Note: Checking for Account status needs to happen before calling this saga
    */
    if (!accountId) throw new Error('Patient or Account id is required')
    const infoMessage = React.createElement('div', null, 'Sending invitation...')
    yield put(ShowNotificationPopUp({ type: 'info', content: (infoMessage) }))
    yield call(Api.inviteToPatientPortal(authToken), accountId)
    const { data: account }: Api.DataResponse<Account> = yield call(Api.getAccountFromLambda(authToken), accountId)
    yield put(LoadPatientDetails({ id: account.patient_id }))
    yield put(InviteSuccess())

    yield createChannelAfterInvitation(createAndSelectChannel, account.id)

    const successMessage = React.createElement('div', null, 'Invitation sent')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
    yield put(Touch({ updateUsers: true }))

  } catch (error) {
    yield put(InviteError({ error }))
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
  }
}

function* createChannelAfterInvitation (shouldAutoSelect: boolean, accountId: string) {
  if (shouldAutoSelect) {
    yield put(CreateChannelAutoSelect({ userIds: [ accountId ] }))
  } else {
    yield put(CreateChannel({ userIds: [ accountId ] }))
  }
}

export function* getAccountsSaga (action: ReturnType<typeof GetAccounts>) {
  try {
    const authToken = yield select(getAuthToken)
    const { associations, where, is_patient, inactive, isLambda, perPage, page, sort = 'ASC', order = 'email', orderAs } = action.payload
    const response: Api.PaginatedDataResponse<Account> = isLambda
      ? yield call(Api.getAccountListFromLambda(authToken), { is_patient, inactive })
      : yield call(Api.getAccountList(authToken), { associations, where, page, per_page: perPage, sort, order, order_as: orderAs }, { useV2: true })

    /*
      This is a hotfix for MW-3896
      This should be removed once we have converted to lambda endpoints
    */
    const nonHenryScheinAccounts: Account[] = response.data.filter(account => !account.account_roles.map(role => role.name).includes('hssales'))
    const providerAccounts: Account[] = nonHenryScheinAccounts.filter(account => !account.is_patient)

    separateGroupsAndPractices(providerAccounts)

    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>(nonHenryScheinAccounts, accountListSchema)

    const { result: accountIds, entities: { accounts } } = normalizedAccounts
    const { count, per_page } = response
    const search = getAccountSearchForResults(normalizedAccounts.result)
    yield put(GetAccountsSuccess({ accounts, accountIds, search, count, page, per_page }))
  } catch (error) {
    yield put(GetAccountsError({ error }))
  }
}

function getAccountSearchForResults (results: string[]): AccountSearch | QuickAddSearch {
  return {
    results: results,
    fetching: false
  }
}

/*
  Mutate accounts so that they include `practices` and `groups` in separate properties
  Account for any parent_groups of practices appropriately (assuming parentGroup was fetched as association)
*/
function separateGroupsAndPractices (accounts: Account[]) {
  return accounts.map((account: Account) => {
    const { groups, practices } = separateGroupsAndPracticeForSingleAccount(account)
    account.groups = groups
    account.practices = practices
  })
}

function separateGroupsAndPracticeForSingleAccount (account: Account) {
  if (!account.groups) {
    return {
      groups: [],
      practices: []
    }
  }
  const practices: Group[] = account.groups.filter(g => g.group_type.code === 'practice')
  const dentistries: Group[] = account.groups.filter(g => g.group_type.code === 'dentistry')
  const parentGroups: Group[] = practices.filter(prac => 'parent_group' in prac).map(p => p.parent_group)
  const groups: Group[] = uniqBy(dentistries.concat(parentGroups), 'id')

  return {
    groups,
    practices
  }
}

export function* adminToolsSearchAccountsSaga (action: ReturnType<typeof AdminToolsSearchAccounts>) {
  try {
    const authToken = yield select(getAuthToken)
    const response: Api.PaginatedDataResponse<Account> = yield call(Api.getAccountListFromLambda(authToken), { ...action.payload })
    /*
      This is a hotfix for MW-3896
      This should be removed once we have converted to lambda endpoints
    */
    const data = response.data.filter(account => !account.account_roles.map(role => role.name).includes('hssales'))

    separateGroupsAndPractices(data)

    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>(data, accountListSchema)

    const { result: accountIds, entities: { accounts } } = normalizedAccounts
    const { count, page, per_page } = response
    const search = getAccountSearchForResults(normalizedAccounts.result)
    yield put(GetAccountsSuccess({ accounts, accountIds, search, count, page, per_page }))
  } catch (error) {
    yield put(GetAccountsError({ error }))
  }
}

// get all accounts that are associated with a Practices's parent Group or it's children (sibling Practices)
// OR (release TBD) get accounts associated to a group but no practices
export function* getAccountsForPracticeEditSaga (action: ReturnType<typeof GetAccountsForPracticeEdit>) {
  try {
    const authToken = yield select(getAuthToken)
    const authAccount = yield select(getAuthAccount)
    const { parentGroupId: groupId, practiceId, params } = action.payload
    const loggedInUserId = authAccount.id

    const opts: Api.AccountLambdaQueryOpts = { is_patient: false, ...params }
    const { data: dentistryAccounts }: Api.PaginatedDataResponse<Account> = yield call(Api.getGroupAccountsFromLambda(authToken), groupId, opts)
    const { data: practiceAccounts }: Api.PaginatedDataResponse<Account> = yield call(Api.getGroupAccountsFromLambda(authToken), practiceId, opts)

    // filter out any accounts already associated with the current practice
    // also filter out the currently logged in user
    const filteredAccounts = differenceBy(dentistryAccounts, practiceAccounts, 'id')
      .filter(account => account.id !== loggedInUserId)
      .filter(account => !account.account_roles.map(role => role.name).includes('hssales'))
    /*
      The last filter above is a hotfix for MW-3896
      This should be removed once we have converted to lambda endpoints
    */

    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>(filteredAccounts, accountListSchema)
    const { entities: { accounts }, result: accountIds } = normalizedAccounts
    yield put(GetAccountsForPracticeEditSuccess({ accounts, accountIds }))
  } catch (error) {
    yield put(GetAccountsForPracticeEditError({ error }))
  }
}

export function* getAccountByIdSaga (action: ReturnType<typeof GetAccountById>) {
  const { id, ssoToken } = action.payload
  const authToken = yield select(getAuthToken)
  const token = ssoToken || authToken
  try {
    const { data }: Api.DataResponse<Account> = yield call(Api.getAccountFromLambda(token), id)
    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>([ data ], accountListSchema)
    const { entities: { accounts: account }, result: accountId } = normalizedAccounts
    yield put(GetAccountByIdSuccess({ account, accountId }))
    yield fork(getAccountMedia, id, 0, token)
    yield fork(getAccountGroups, id, 0, token)
  } catch (error) {
    yield put(GetAccountByIdError({ error }))
  }
}

function* getAccountMedia (id: EntityId, offset = 0, ssoToken?: string) {
  const authToken: string = yield select(getAuthToken)
  const token = ssoToken || authToken
  const { data: media, count, limit } = yield call(Api.getAccountMediaFromLambda(token), id, { offset })
  if (offset + limit < count) {
    yield getAccountMedia(id, offset + limit)
  }
  yield put(LoadAccountMediaSuccess({ id, media }))
}

function* getAccountGroups (id: EntityId, offset = 0, ssoToken?: string) {
  const authToken: string = yield select(getAuthToken)
  const token = ssoToken || authToken
  const { data: lambdaGroups, count, limit } = yield call(Api.getAccountGroupsFromLambda(token), id, { offset })
  // Get `parent_group` and `group_type` objects, and merge them into each `group`
  const mergedGroups = []
  for (let i = 0; i < lambdaGroups.length; i++) {
    const group = lambdaGroups[i]
    /*
      Due to changes to the /grouptypes endpoint, below is the type defintion for group types
      type GroupType = { id, name }
      However, several components expect the following:
      type ExpectedGroupType = { id, name, code }
      The accounts/:id/groups endpoint does not return a `group_type` object at all
      Instead, it returns `group.group_type_id` and `group.group_type_code`
    */
    const groupType: Api.GroupType = { id: group.group_type_id, code: group.group_type_code, name: group.group_type_code }
    if (group.parent_id === '00000000-0000-4000-A000-000000000000') {
      // Do not merge parent_group if the parent is the `root` group
      const mergedGroup = merge({}, group, { parent_group: null, group_type: groupType })
      mergedGroups.push(mergedGroup)
    } else {
      const { data: parentGroup } = yield call(Api.getGroupByIdFromLambda(token), group.parent_id)
      const mergedGroup = merge({}, group, { parent_group: parentGroup, group_type: groupType })
      mergedGroups.push(mergedGroup)
    }
  }
  if (offset + limit < count) {
    yield getAccountGroups(id, offset + limit)
  }
  yield put(LoadAccountGroupsSuccess({ id, groups: mergedGroups }))
}

export function* updateAccountSaga (action: ReturnType<typeof UpdateAccount>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data: patch, id, me = false, updated_at, after } = action.payload
    if (patch.picture) {
      yield put(CreateMedia({ file: patch.picture['value'], association: 'account', association_id: id, type: 'acct-avatar', patientId: null }))
      delete patch.picture
    }

    const { data } = yield call(Api.editAccountLambda(authToken), id, patch, updated_at)

    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'accounts' }))
    } else {
      const { id } = action.payload
      const { data: updatedAccount } = yield call(Api.getAccountFromLambda(authToken), id)
      // After editing, update account in list
      const { entities: { accounts: account }, result: accountId } = normalize<AccountLookup, AccountEntity, string[]>([updatedAccount], accountListSchema)
      yield put(UpdateAccountSuccess({ account, accountId }))
      yield fork(getAccountMedia, id)
      yield fork(getAccountGroups, id)

      /*
        If user edits their own account, we need to update their data in state.auth.data
        Note that we only update dynamic properties because:
        1. A user cannot edit their own groups
        2. We should not look for media in state.auth.data.account
      */
      if (me) {
        yield put(RefreshUser({ account: updatedAccount as Api.LoginResponseAccount }))
      }
      // Update Avatar
      yield put(AddAvatar({ id, lambdaUrl: constructLambdaURL(id, 'provider') }))
      const successMessage = React.createElement('div', null, 'User updated')
      yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
      yield put(Touch({ updateUsers: true }))
      if (after) {
        after()
      }
    }
  } catch (error) {
    yield put(UpdateAccountError({ error }))
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
  }
}

export function* getAccountRolesSaga () {
  try {
    const { data: roles } = yield call(Api.getAccountRoleList())
    yield put(GetAccountRolesSuccess({ roles: roles }))
  } catch (error) {
    yield put(GetAccountRolesError({ error }))
  }
}

export function* changePasswordSaga (action: ReturnType<typeof ChangePassword>) {
  const { id, newPassword, updated_at } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const { data: account } = yield call(
      Api.editAccountLambda(authToken), id, { password: { value: newPassword, op: 'replace' } }, updated_at, true
    )
    const successMessage = React.createElement('div', null, 'Changed password for ', account.username)
    yield put(ChangePasswordSuccess())
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
  } catch (error) {
    yield put(ChangePasswordError({ error }))
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
  }
}

function formatCreateAccountData (data) {
  return Object.keys(data).reduce((obj, key) => {
    if (key === 'practices' && Array.isArray(data['practices'])) {
      const practiceIds = data['practices'].map(practice => practice.value)
      if (!obj['groups']) {
        obj['groups'] = practiceIds
      } else {
        obj['groups'] = obj['groups'].concat(practiceIds)
      }
    } else if (key === 'practices' && isObject(data['practices'])) {
      // e.g. practices: { label: string, value: string }
      if (!obj['groups']) {
        obj['groups'] = [ data['practices']['value'] ]
      } else {
        obj['groups'] = obj['groups'].concat(data['practices']['value'])
      }
    } else if (key === 'roles') {
      obj['roles'] = data['roles'].map(role => role.value)
    } else if (key === 'groups' && Array.isArray(data[key])) {
      obj['groups'] = data['groups'].map(group => (group as unknown as Option).value)
    } else if (key === 'groups' && isObject(data[key])) {
      // e.g. groups: { label: string, value: string }
      if (!obj['groups']) {
        obj['groups'] = [ data['groups']['value'] ]
      } else {
        obj['groups'] = obj['groups'].concat(data['groups']['value'])
      }
    } else if (key !== 'picture' && key !== 'confirm_password') {
      obj[key] = data[key]
    }
    return obj
  }, {} as Api.CreateAccountEntity)
}

export function* createAccountSaga (action: ReturnType<typeof CreateAccount>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data, after } = action.payload
    // concat practice and group id(s)
    // get role id(s)
    const newAccount: Api.CreateAccountEntity = formatCreateAccountData(data)
    const { data: newAccountData } = yield call(Api.createAccountLambda(authToken), newAccount)
    const { id, first_name, last_name, account_roles } = newAccountData

    // if picture, create new media with type: acct-avatar
    if (data['picture']) {
      yield put(CreateMedia({ file: data['picture'], association: 'account', association_id: id, type: 'acct-avatar', patientId: null }))
    }
    const isPatient = account_roles.find(role => role.name === 'patient')
    if (isPatient) {
      const patchedEntity: Api.PatchedEntity = {
        'account_id': {
          op: 'replace',
          value: id
        }
      }
      yield call(Api.editPatient(authToken), id, patchedEntity, new Date().toUTCString())
    }

    const successMessage = React.createElement('div', null, React.createElement('a', { href: `/admin-tools/manage-accounts/edit-account/${id}` }, `${first_name} ${last_name}`), ' has been added')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))

    const { entities: { accounts: account }, result: accountId } = normalize<AccountLookup, AccountEntity, string[]>([ newAccountData ], accountListSchema)
    if (after) {
      after()
    }
    yield put(CreateAccountSuccess({ account, accountId }))
    yield put(Touch({ updateUsers: true }))
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(CreateAccountError({ error }))
  }
}

function* saveAccountAvatarSaga (action: ReturnType<typeof SaveAccountAvatar>) {
  const { existingAvatarId, file, association_id, type } = action.payload
  const authToken = yield select(getAuthToken)
  try {
    if (existingAvatarId) {
      yield call(Api.deleteMedia(authToken), existingAvatarId)
    }
    if (file) {
      const avatarType: string = (type === 'account' ? 'acct' : 'patient') + '-avatar'
      const properties = JSON.stringify({ type: avatarType })
      yield call(Api.createMedia(authToken), { properties, association: type, association_id, file })
    }
    if (type === 'account') {
      const { data: updatedAccount } = yield call(Api.getAccountFromLambda(authToken), association_id)
      const { entities: { accounts: account }, result: accountId } = normalize<AccountLookup, AccountEntity, string[]>([updatedAccount], accountListSchema)
      yield put(GetAccountByIdSuccess({ account, accountId }))
    } else {
      yield put(LoadPatient({ id: association_id, associations: [{ model: 'media' }] }))
    }
    yield put(SaveAccountAvatarEnd())

    const successMessage = React.createElement('div', null, 'Avatar updated')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Could not update avatar' }))
  }
}

export function* refreshAccount (id: EntityId) {
  yield call(getAccountByIdSaga, ({ type: '[accounts] get_account_by_id', payload: { id } } as ReturnType<typeof GetAccountById>))
}

function* setDefaultAvatarSaga (action: ReturnType<typeof SetDefaultAvatar>) {
  const { accountId } = action.payload
  const authToken = yield select(getAuthToken)
  try {
    const { data: accountMedia } = yield call(Api.getAccountMediaFromLambda(authToken), accountId)
    const avatars = accountMedia.filter(m => m.type === 'acct-avatar')
    for (const avatar of avatars) {
      yield call(Api.deleteMedia(authToken), avatar.id)
    }
    yield call(refreshAccount, accountId)
    yield put(ClearAvatars())
    yield put(Touch({ updateUsers: true }))
    yield put(ShowNotificationPopUp({ type: 'success', content: 'Default avatar set' }))
  } catch (e) {
    yield put(ShowNotificationPopUp({ type: 'error', content: `Could not set default avatar: ${e.message}` }))
  }
}
