import * as Api from '#/api'

import { Account, AccountLookup, EntityId, Group, Media, Patient, Role } from '#/types'
import { CommonListPayload, LambdaAssociations, ValidAssociations } from '#/api/types'
import { Selector, createSelector } from 'reselect'
import { patientIDSelector, patientsSelector } from './patients'

import { AccountSearch } from '#/reducers/accounts'
import { AppState } from '#/redux'
import { UpdateSMSOptStatusPayload } from './types'
import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Types
export type AccountsSelector = Selector<AppState, AccountLookup>
// Actions
export const InviteUserToPatientPortal = defineAction('[accounts] invite_account_to_patient_portal')<{ accountId: EntityId, createAndSelectChannel?: boolean }>()
export const InviteSuccess = defineAction('[accounts] invite_account_to_patient_portal_success')()
export const InviteError = defineAction('[accounts] invite_account_to_patient_portal_error')<{ error: Error }>()

export const FetchingAccounts = defineAction('[accounts] fetching accounts')()
export const FetchingCompleted = defineAction('[accounts] fetching complete')()

interface GetAccountsPayload extends CommonListPayload {
  is_patient?: boolean
  inactive?: boolean
  isLambda: boolean
}
export const GetAccounts = defineAction('[accounts] get_accounts')<GetAccountsPayload>()
export const GetAccountsSuccess = defineAction('[accounts] get_accounts_success')<{ accounts: AccountLookup, accountIds: string[], search?: AccountSearch, count?: number, page?: number, per_page?: number }>()
export const GetAccountsError = defineAction('[accounts] get_accounts_error')<{ error: Error }>()

export const AdminToolsSearchAccounts = defineAction('[accounts] admin_tools_search_accounts')<Api.AccountLambdaQueryOpts>()

export const GetAccountsForPracticeEdit = defineAction('[accounts] get_accounts_for_practice_edit')<{ parentGroupId: EntityId, practiceId: EntityId, params: Api.AccountLambdaQueryOpts }>()
export const GetAccountsForPracticeEditSuccess = defineAction('[accounts] get_accounts_for_practice_edit_success')<{ accounts: AccountLookup, accountIds: string[] }>()

export const GetAccountsForPracticeEditError = defineAction('[accounts] get_accounts_for_practice_edit_error')<{ error: Error }>()

export const GetAccountById = defineAction('[accounts] get_account_by_id')<{ id: EntityId, associations?: LambdaAssociations[], ssoToken?: string }>()
export const GetAccountByIdSuccess = defineAction('[accounts] get_account_by_id_success')<{ account: AccountLookup, accountId: string[] }>()
export const GetAccountByIdError = defineAction('[accounts] get_account_by_id_error')<{ error: Error }>()

export const LoadAccountMediaSuccess = defineAction('[accounts] load_account_media_success')<{ id: EntityId, media: Media[] }>()
export const LoadAccountGroupsSuccess = defineAction('[accounts] load_account_groups_success')<{ id: EntityId, groups: Group[] }>()

interface UpdateAccountPayload {
  id: EntityId
  data: Api.PatchedEntity
  updated_at: string
  me?: boolean
  after?: () => void
}

export const UpdateAccount = defineAction('[accounts] edit_account')<UpdateAccountPayload>()
export const UpdateAccountSuccess = defineAction('[account] update_account_success')<{ account: AccountLookup, accountId: string[], me?: boolean }>()
export const UpdateAccountError = defineAction('[account] update_account_error')<{ error: Error }>()

export const SaveAccountAvatar = defineAction('[account] save avatar')<{ existingAvatarId?: EntityId, file?: File, association_id: EntityId, type: ValidAssociations }>()
export const SaveAccountAvatarEnd = defineAction('[account] save avatar end')()

export const GetAccountRoles = defineAction('[accounts] get_account_roles')()
export const GetAccountRolesSuccess = defineAction('[accounts] get_account_roles_success')<{ roles: Role[] }>()
export const GetAccountRolesError = defineAction('[accounts] get_account_roles_error')<{ error: Error }>()

export const ChangePassword = defineAction('[accounts] change_password')<{ id: EntityId, newPassword: string, updated_at: string }>()
export const ChangePasswordSuccess = defineAction('[accounts] change_password_success')()
export const ChangePasswordError = defineAction('[accounts] change_password_failure')<{ error: Error }>()

interface CreateAccountPayload {
  data: Api.CreateAccountEntity
  after?: () => void
}

export const CreateAccount = defineAction('[accounts] create_account')<CreateAccountPayload>()
export const CreateAccountSuccess = defineAction('[accounts] create_account_success')<{ account: AccountLookup, accountId: string[] }>()
export const CreateAccountError = defineAction('[accounts] create_account_error')<{ error: Error }>()

export const DeleteMediaFromAccount = defineAction('[accounts] delete_media_from_account')<{ mediaId: EntityId }>()
export const SetDefaultAvatar = defineAction('[accounts] set default avatar')<{ accountId: EntityId }>()

export const UpdateSMSOptStatus = defineAction('[accounts] update sms opt in')<UpdateSMSOptStatusPayload>()

// Selectors
export const accountsSelector: AccountsSelector = state => state.accounts.accounts
// Combiners
export const _getAccountByPatientID = (patientID: string, accounts: AccountLookup, patients: Patient[]) => {
  const patient = patients.find(patient => patient.id === patientID)
  return patient ? accounts[patient.account_id] : null
}

export const getAccountBySelectedPatient = createSelector(patientIDSelector, accountsSelector, patientsSelector, _getAccountByPatientID)

export const selectors = createSelectors<Account>('accounts')
