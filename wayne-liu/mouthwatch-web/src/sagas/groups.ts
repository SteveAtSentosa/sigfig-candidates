import * as Actions from '#/actions/groups'
import * as Api from '#/api'
import * as React from 'react'

import { Account, AccountLookup, EntityId, Group } from '#/types'
import { AccountEntity, accountListSchema } from '#/schemas/accounts'
import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { CreateMedia } from '#/actions/media'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { ThrowCollisionStart } from '#/actions/collisions'
import { getGroupAccountOwnerCandidates } from '#/actions/groups.selectors'
import { getLambdaGroupLogoSrc } from '#/utils'
import { normalize } from 'normalizr'
import { omit } from 'lodash'

// Sagas

export function* saga () {
  yield all([
    takeEvery(Actions.GetGroups.TYPE, getListSaga),
    takeEvery(Actions.GetChildGroups.TYPE, getChildGroupsSaga),
    takeLatest(Actions.GetGroupById.TYPE, getGroupByIdSaga),
    takeLatest(Actions.GetGroupAccountOwnerInvite.TYPE, getGroupAccountOwnerInviteSaga),
    takeLatest(Actions.CreateGroupAccountOwnerInvite.TYPE, createGroupAccountOwnerInviteSaga),
    takeLatest(Actions.DeleteGroupAccountOwnerInvite.TYPE, deleteGroupAccountOwnerInviteSaga),
    takeLatest(Actions.AcceptGroupAccountOwnerInvite.TYPE, acceptGroupAccountOwnerInviteSaga),
    takeLatest(Actions.GetAccountsByGroupId.TYPE, getAccountsByGroupIdSaga),
    takeLatest(Actions.GetGroupAccountOwner.TYPE, getGroupAccountOwnerSaga),
    takeLatest(Actions.GetGroupLogo.TYPE, getGroupLogoSaga),
    takeEvery(Actions.CreateGroup.TYPE, createGroupSaga),
    takeEvery(Actions.EditGroup.TYPE, editGroupSaga),
    takeLatest(Actions.AdminToolsSearchGroups.TYPE, adminToolsSearchGroupsSaga),
    takeLatest(Actions.GetEstimatedBilling.TYPE, getEstimatedBillingSaga)
  ])
}

export function* getListSaga (action: ReturnType<typeof Actions.GetGroups>) {
  try {
    const authToken = yield select(getAuthToken)
    const { associations, where: userDefinedWhere, page, perPage, sort = 'ASC', order = 'name', orderAs } = action.payload
    // TODO: LAMBDA
    // const { associations, where: userDefinedWhere, page, perPage, sort = 'name', order = 'ASC', orderAs } = action.payload
    const where = yield getGroupTypeWhere(userDefinedWhere)
    // Fetch the list of groups (dentistries)
    const response: Api.PaginatedDataResponse<Group> = yield call(Api.getGroupList(authToken), { associations, where, page, per_page: perPage, sort, order, order_as: orderAs } as Api.ListQueryOpts)
    // TODO: LAMBDA
    // const response = yield call(Api.getGroupList(authToken), { group_type: 'dentistry', page, per_page: perPage, sort, order, order_as: orderAs })
    yield put(Actions.GetGroupsSuccess({ data: response.data, page: response.page, count: response.count, per_page: response.per_page }))
  } catch (error) {
    yield put(Actions.GetGroupsError({ error }))
  }
}

export function* getChildGroupsSaga (action: ReturnType<typeof Actions.GetChildGroups>) {
  try {
    const { id } = action.payload
    yield fork(getChildGroups, id)
  } catch (error) {
    yield put(Actions.GetChildGroupsError({ error }))
  }
}

function* getChildGroups (id: EntityId, offset = 0) {
  const authToken = yield select(getAuthToken)
  const { data: childGroups, count, limit } = yield call(Api.getChildGroupsFromLambda(authToken), id, { per_page: 25, offset })
  yield put(Actions.GetChildGroupsSuccess({ parentId: id, childGroups }))
  if (offset + limit < count) {
    yield getChildGroups(id, offset + limit)
  }
}

export function* getGroupByIdSaga (action: ReturnType<typeof Actions.GetGroupById>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id, useLambda } = action.payload
    // include parent_group
    const { data: group } = useLambda ? yield call(Api.getGroupByIdFromLambda(authToken), id)
      : yield call(Api.getGroup(authToken), id, { associations: [{ model: 'group', associations: [{ model: 'media' }] }, { model: 'media' }] })
    // TODO LAMBDA:
    // const { data: group } = yield call(Api.getGroupByIdFromLambda(authToken), id)
    yield put(Actions.GetGroupByIdSuccess({ group }))
    yield put(Actions.SelectGroup({ id }))
  } catch (error) {
    yield put(Actions.GetGroupByIdError({ error }))
  }
}

export function* getGroupAccountOwnerInviteSaga (action: ReturnType<typeof Actions.GetGroupAccountOwnerInvite>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id } = action.payload
    // include parent_group
    const { data: account } = yield call(Api.getGroupAccountOwnerInviteLambda(authToken), id)
    yield put(Actions.GetGroupAccountOwnerInviteSuccess({ account }))
  } catch (error) {
    yield put(Actions.GetGroupAccountOwnerInviteSuccess({ account: null }))
  }
}

export function* createGroupAccountOwnerInviteSaga (action: ReturnType<typeof Actions.CreateGroupAccountOwnerInvite>) {
  try {
    const authToken = yield select(getAuthToken)
    const { groupId, accountId } = action.payload
    // include parent_group
    const { data: { id: newOwnerAccountId } } = yield call(Api.createGroupAccountOwnerInviteLambda(authToken), groupId, accountId)

    const accountOwnerCandidates = yield select(getGroupAccountOwnerCandidates)
    const newOwnerAccount = accountOwnerCandidates[newOwnerAccountId] || null
    yield put(Actions.GetGroupAccountOwnerInviteSuccess({ account: newOwnerAccount }))
  } catch (error) {
    // TODO: handle error
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Something went wrong while changing account owner. Please try again later.' }))
  }
}

export function* deleteGroupAccountOwnerInviteSaga (action: ReturnType<typeof Actions.DeleteGroupAccountOwnerInvite>) {
  try {
    const authToken = yield select(getAuthToken)
    const { groupId } = action.payload
    // include parent_group
    yield call(Api.deleteGroupAccountOwnerInviteLambda(authToken), groupId)

    yield put(Actions.GetGroupAccountOwnerInviteSuccess({ account: null }))
  } catch (error) {
    // TODO: handle error
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Something went wrong. Please try again later.' }))
  }
}

export function* acceptGroupAccountOwnerInviteSaga (action: ReturnType<typeof Actions.AcceptGroupAccountOwnerInvite>) {
  try {
    const authToken = yield select(getAuthToken)
    const { groupId, code } = action.payload
    // include parent_group
    yield call(Api.acceptGroupAccountOwnerInviteLambda(authToken), groupId, code)

    yield put(Actions.AcceptGroupAccountOwnerInviteResult({ result: true }))
  } catch (error) {
    // TODO: handle error
    yield put(Actions.AcceptGroupAccountOwnerInviteResult({ result: false }))
  }
}

export function* getAccountsByGroupIdSaga (action: ReturnType<typeof Actions.GetAccountsByGroupId>) {
  try {
    const authToken = yield select(getAuthToken)
    const { groupId, params } = action.payload

    const opts: Api.AccountLambdaQueryOpts = { is_patient: false, sort: 'last_name', ...params }
    const { data: dentistryAccounts }: Api.PaginatedDataResponse<Account> = yield call(Api.getGroupAccountsFromLambda(authToken), groupId, opts)

    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>(dentistryAccounts, accountListSchema)
    const { entities: { accounts }, result: accountIds } = normalizedAccounts
    yield put(Actions.GetAccountsByGroupIdSuccess({ accounts, accountIds }))
  } catch (error) {
    yield put(Actions.GetAccountsByGroupIdSuccess({ accounts: [], accountIds: [] }))
  }
}

export function* getGroupAccountOwnerSaga (action: ReturnType<typeof Actions.GetAccountsByGroupId>) {
  try {
    const authToken = yield select(getAuthToken)
    const authAccount = yield select(getAuthAccount)
    const { groupId } = action.payload

    if (authAccount) {
      if ((authAccount.account_roles || []).find(role => role.name === 'accountowner')) {
        yield put(Actions.GetGroupAccountOwnerSuccess({ account: authAccount }))
        return
      }
    }
    const opts: Api.AccountLambdaQueryOpts = { is_patient: false, accountRoles: ['accountowner'] }
    const { data: dentistryAccounts }: Api.PaginatedDataResponse<Account> = yield call(Api.getGroupAccountsFromLambda(authToken), groupId, opts)

    const normalizedAccounts = normalize<AccountLookup, AccountEntity, string[]>(dentistryAccounts, accountListSchema)
    const { entities: { accounts }, result: accountIds } = normalizedAccounts
    yield put(Actions.GetGroupAccountOwnerSuccess({ account: accountIds[0] ? accounts[accountIds[0]] || null : null }))
  } catch (error) {
    yield put(Actions.GetGroupAccountOwnerSuccess({ account: null }))
  }
}

export function* getGroupLogoSaga (action: ReturnType<typeof Actions.GetGroupLogo>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id } = action.payload
    const { data: group } = yield call(Api.getGroupByIdFromLambda(authToken), id)
    const url = group.group_logo ? getLambdaGroupLogoSrc(group.id) : '/static/images/logo_horizontal_2020@3x.png'
    yield put(Actions.GetGroupLogoSuccess({ id, url }))
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: `Error: ${error.message}` }))
  }
}

export function* createGroupSaga (action: ReturnType<typeof Actions.CreateGroup>) {
  const { data, after } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const response = yield call(Api.getGroupTypes(authToken))
    const dentistry = response.data.filter(option => option.name === 'Dentistry')[0]
    const dataWithRequiredFields: Api.CreateGroupEntity = Object.assign({}, omit(data, 'picture'), { group_type_id: dentistry.id, parent_id: '00000000-0000-4000-A000-000000000000' })
    const { data: group } = yield call(Api.createGroup(authToken), dataWithRequiredFields)
    // if picture, create new media with type: group-logo
    if (data['picture']) {
      yield put(CreateMedia({ file: data['picture'], association: 'group', association_id: group.id, type: 'group-logo', patientId: null }))
    }
    if (after) {
      after()
    }
    yield put(ShowNotificationPopUp({ type: 'success', content: 'Account created' }))
    yield put(Actions.CreateGroupSuccess())
  } catch (error) {
    yield put(Actions.CreateGroupError({ error }))
    yield put(ShowNotificationPopUp({ type: 'error', content: `Error: ${error.message}` }))
  }
}

export function* editGroupSaga (action: ReturnType<typeof Actions.EditGroup>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data: patch, id, updated_at, customSuccessMessage } = action.payload
    const { data } = yield call(Api.editGroup(authToken), id, patch, updated_at)
    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'groups' }))
    } else {
      yield put(Actions.EditGroupSuccess())
    }
    const successMessage = React.createElement('div', null, customSuccessMessage || 'Account Updated')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
  } catch (error) {
    yield put(Actions.EditGroupError({ error }))
    const errorMessage = React.createElement('div', null, `Error: ${error.message}`)
    yield put(ShowNotificationPopUp({ type: 'error', content: (errorMessage) }))
  }
}

export function* adminToolsSearchGroupsSaga (action: ReturnType<typeof Actions.AdminToolsSearchGroups>) {
  try {
    const authToken = yield select(getAuthToken)
    const { searchQuery, page, perPage, sort = 'name', order = 'ASC' } = action.payload

    const response: Api.PaginatedDataResponse<Group> = yield call(Api.getGroupListFromLambda(authToken), { name: searchQuery, page, per_page: perPage, sort, order })

    // fetch the child_groups
    for (let i in response.data) {
      yield getChildGroups(response.data[i].id)
    }

    yield put(Actions.GetGroupsSuccess({ data: response.data, page: response.page, count: response.count, per_page: response.per_page }))
  } catch (error) {
    yield put(Actions.GetGroupsError({ error }))
  }
}

/* Get the get the where clause for Groups */
function* getGroupTypeWhere (userDefinedWhere: Api.WhereValue[]) {
  const authToken = yield select(getAuthToken)
  // Get the id for the 'dentistry' group type
  const { data: groupTypes }: Api.PaginatedDataResponse<Api.GroupType> = yield call(Api.getGroupTypes(authToken))
  const dentistryId = groupTypes.filter(gt => gt.name === 'Dentistry')[0].id
  // Construct the where param to filter for dentistries only
  const where = userDefinedWhere ? [{ and: userDefinedWhere }] : [{ and: [] }]
  where[0].and.push({ prop: 'group_type_id', comp: '=', param: dentistryId })
  return where
}

export function* getEstimatedBillingSaga (action: ReturnType<typeof Actions.GetEstimatedBilling>) {
  try {
    const authToken = yield select(getAuthToken)
    const { groupId } = action.payload
    // include parent_group
    const estimatedBilling = yield call(Api.getEstimatedBilling(authToken), groupId)
    yield put(Actions.GetEstimatedBillingSuccess({ estimatedBilling }))
  } catch (error) {
    yield put(Actions.GetEstimatedBillingError({ error }))
  }
}
