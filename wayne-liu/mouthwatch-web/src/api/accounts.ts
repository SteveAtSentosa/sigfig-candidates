import { Account, EntityId, Me, Role } from '#/types'
import {
  AccountEntity,
  AccountLambdaQueryOpts,
  BulkCreateAccountEntity,
  CreateAccountEntity,
  DataResponse,
  LambdaAssociations,
  ListQueryOpts,
  PaginatedDataResponse,
  PatchedEntity,
  PatientPortalInvitationResponse,
  UrlOpts
} from './types'
import { buildCollisionPatch, makeAuthedJsonRequest, makeJsonRequest, normalizeQueryOpts } from './common'

/**
 * Invite account to patient portal
 */
export const inviteToPatientPortal = (authToken: string) => (id: EntityId): Promise<PatientPortalInvitationResponse> =>
  makeAuthedJsonRequest<PatientPortalInvitationResponse>(`/accounts/${id}/invite`, {
    authToken
  })

/**
 * Fetches a paginated list of accounts
 */
export const getAccountList = (authToken: string) => (opts: ListQueryOpts, urlOpts?: UrlOpts): Promise<PaginatedDataResponse<Account>> =>
  makeAuthedJsonRequest<PaginatedDataResponse<Account>>('/accounts', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, urlOpts)

export const getAccountListFromLambda = (authToken: string) => (opts: AccountLambdaQueryOpts): Promise<PaginatedDataResponse<Account>> =>
  makeAuthedJsonRequest<PaginatedDataResponse<Account>>('/accounts', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })

/**
 * Fetches a single account
 */
export const getAccountFromLambda = (authToken: string) => (id: EntityId, association?: LambdaAssociations, opts?: AccountLambdaQueryOpts): Promise<DataResponse<AccountEntity>> =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>(`/accounts/${id}${association ? `/${association}` : ''}`, {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })

export const getAccountGroupsFromLambda = (authToken: string) => (id: EntityId, opts?: AccountLambdaQueryOpts): Promise<DataResponse<AccountEntity>> =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>(`/accounts/${id}/groups`, {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })

export const getAccountMediaFromLambda = (authToken: string) => (id: EntityId, opts?: AccountLambdaQueryOpts): Promise<DataResponse<AccountEntity>> =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>(`/accounts/${id}/media`, {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })

/**
 * Creates a new account
 */
export const createAccountLambda = (authToken: string) => (account: CreateAccountEntity) =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>('/accounts', {
    authToken,
    method: 'POST',
    body: account
  }, { useLambda: true })

export const bulkCreateAccountLambda = (authToken: string) => (groupId: EntityId, accounts: BulkCreateAccountEntity[]) =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>('/accounts/bulkImport', {
    authToken,
    method: 'POST',
    body: {
      group_id: groupId,
      accounts
    }
  }, { useLambda: true })

/**
 * Edits fields of a account
 */
export const editAccountLambda = (authToken: string) => (id: EntityId, account: PatchedEntity, updatedAt: string, bypassCollisionHandling: boolean = false) =>
  makeAuthedJsonRequest<DataResponse<AccountEntity>>(`/accounts/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(account, updatedAt, bypassCollisionHandling)
  }, { useLambda: true })

/**
 * Update account sms opt status
 */
export const updateSMSOptStatus = (authToken: string) => (smsOptIn: boolean, phone?: string, isRegistration: boolean = false) =>
  makeAuthedJsonRequest('/accounts/sms_opt', {
    authToken,
    method: 'PUT',
    body: {
      sms_opt_in: smsOptIn,
      is_registration: isRegistration,
      phone
    }
  })

/**
 * Fetches a 'paginated' list of account roles
 */
export const getAccountRoleList = () => () =>
  makeJsonRequest<PaginatedDataResponse<Role>>('/accountroles')

/**
 * Fetches info about the logged in user most importantly view_permissions
 * @param authToken
 */

export const getMeFromLambda = (authToken: string) => () =>
  makeAuthedJsonRequest<DataResponse<Me>>('/me',
    { authToken },
    { useLambda: true }
  )
