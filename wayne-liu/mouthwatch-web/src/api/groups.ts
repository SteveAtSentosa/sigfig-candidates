import { Account, EntityId, Group, PracticeLocation } from '#/types'
import {
  AccountLambdaQueryOpts,
  BillingInfoEntity,
  CreateGroupEntity,
  DataResponse,
  GroupLambdaQueryOpts,
  GroupType,
  ListQueryOpts,
  PaginatedDataResponse,
  PatchedEntity
} from './types'
import { buildCollisionPatch, makeAuthedJsonRequest, normalizeQueryOpts } from './common'

/**
 * Fetches a paginated list of groups
 */
export const getGroupList = (authToken: string) => (opts: ListQueryOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<Group>>('/groups', {
    authToken,
    query: normalizeQueryOpts(opts)
  })
}

export const getGroupTypes = (authToken: string) => () =>
  makeAuthedJsonRequest<PaginatedDataResponse<GroupType>>('/grouptypes', {
    authToken
  })

/**
 * Fetches a single group
 */
export const getGroup = (authToken: string) => (id: EntityId, opts?: ListQueryOpts): Promise<DataResponse<Group>> =>
  makeAuthedJsonRequest<DataResponse<Group>>(`/groups/${id}`, {
    authToken,
    query: normalizeQueryOpts(opts)
  })

/**
 * Creates a new group
 */
export const createGroup = (authToken: string) => (group: CreateGroupEntity) =>
  makeAuthedJsonRequest<DataResponse<Group>>('/groups', {
    authToken,
    method: 'POST',
    body: group
  })

/**
 * Edits fields of a group
 */
export const editGroup = (authToken) => (id: EntityId, group: PatchedEntity, updatedAt: string, bypassCollisionHandling = false) =>
  makeAuthedJsonRequest(`/groups/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(group, updatedAt, bypassCollisionHandling)
  })

/**
 * Replaces an entire group
 */
export const replaceGroup = (authToken: string) => (id: EntityId, group: Group) =>
  makeAuthedJsonRequest(`/groups/${id}`, {
    authToken,
    method: 'PUT',
    body: JSON.stringify(group)
  })

/**
 * Deletes a group
 */
export const deleteGroup = (authToken: string) => (id: EntityId) =>
  makeAuthedJsonRequest(`/groups/${id}`, {
    authToken,
    method: 'DELETE'
  })

/** LAMBDA ENDPOINTS */

/**
 * Get list of groups from lambda (returns a list of practices, will not return dentistry)
 *
 */
export const getGroupListFromLambda = (authToken: string) => (opts: GroupLambdaQueryOpts): Promise<PaginatedDataResponse<Group>> =>
  makeAuthedJsonRequest<PaginatedDataResponse<Group>>('/groups', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })

export const getChildGroupsFromLambda = (authToken: string) => (id: EntityId, opts: GroupLambdaQueryOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<Group>>(`/groups/${id}/practices`, {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })
}

/**
 * Get group (practice or dentistry) info from lambda
 *
 */
export const getGroupByIdFromLambda = (authToken: string) => (id: EntityId): Promise<DataResponse<Group>> => {
  return makeAuthedJsonRequest<DataResponse<Group>>(`/groups/${id}`, {
    authToken
  }, { useLambda: true })
}

export const getGroupAccountsFromLambda = (authToken: string) => (id: EntityId, opts: AccountLambdaQueryOpts): Promise<PaginatedDataResponse<Account>> => {
  return makeAuthedJsonRequest<PaginatedDataResponse<Account>>(`/groups/${id}/accounts`, {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })
}

export const getGroupLocationsFromLambda = (authToken: string) => (id: EntityId): Promise<PaginatedDataResponse<PracticeLocation>> => {
  return makeAuthedJsonRequest<PaginatedDataResponse<PracticeLocation>>(`/groups/${id}/locations`, {
    authToken
  }, { useLambda: true })
}

/**
 * Account Owner Invite
 */

export const getGroupAccountOwnerInviteLambda = (authToken: string) => (id: EntityId): Promise<DataResponse<EntityId>> => {
  return makeAuthedJsonRequest<DataResponse<EntityId>>(`/groups/${id}/account_owner_invite`, {
    authToken
  })
}

export const createGroupAccountOwnerInviteLambda = (authToken: string) => (groupId: EntityId, accountId: EntityId) =>
  makeAuthedJsonRequest(`/groups/${groupId}/account_owner_invite`, {
    authToken,
    method: 'POST',
    body: {
      account_id: accountId
    }
  })

export const deleteGroupAccountOwnerInviteLambda = (authToken: string) => (groupId: EntityId) =>
  makeAuthedJsonRequest(`/groups/${groupId}/account_owner_invite`, {
    authToken,
    method: 'DELETE'
  })

export const acceptGroupAccountOwnerInviteLambda = (authToken: string) => (groupId: EntityId, code: string) =>
  makeAuthedJsonRequest(`/groups/${groupId}/account_owner_invite/accept`, {
    authToken,
    method: 'POST',
    body: {
      one_time_password: code
    }
  })

/* Subscription - Invoices - Fetch BillingInvoices */
export const getInvoices = (authToken: string) => (groupId: EntityId, page: number) =>
  makeAuthedJsonRequest(`/groups/${groupId}/listBillingInvoices`, {
    authToken,
    query: { page }
  }, { useLambda: true })

export const getBillingInfo = (authToken: string) => (groupId: EntityId) =>
  makeAuthedJsonRequest<DataResponse<BillingInfoEntity>>(`/groups/${groupId}/billinginfo`, {
    authToken,
    method: 'GET'
  }, { useLambda: true })

export const updateBillingInfo = (authToken: string) => (groupId: EntityId, body: BillingInfoEntity) =>
  makeAuthedJsonRequest<DataResponse<BillingInfoEntity>>(`/groups/${groupId}/billinginfo`, {
    authToken,
    method: 'PATCH',
    body
  }, { useLambda: true })

export const getEstimatedBilling = (authToken: string) => (groupId: EntityId) =>
  makeAuthedJsonRequest<DataResponse<BillingInfoEntity>>(`/groups/${groupId}/getEstimatedBilling`, {
    authToken,
    method: 'GET'
  }, { useLambda: true })
