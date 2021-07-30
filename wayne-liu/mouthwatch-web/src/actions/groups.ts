import * as Api from '#/api'

import { Account, AccountLookup, EntityId, EstimatedBilling, Group } from '#/types'
import { AdminToolsSearchGroupsPayload, CallbackPayload } from './types'

import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Actions
export const AdminToolsSearchGroups = defineAction('[groups] admin_tools_search_groups')<AdminToolsSearchGroupsPayload>()

export const GetGroups = defineAction('[groups] get_groups')<{
  associations?: Api.AssociationValue
  where?: Api.WhereValue[]
  page?: number
  perPage?: number
  order?: string
  sort?: Api.SortOrder
  orderAs?: string
}>()

export const GetGroupsSuccess = defineAction('[groups] load success (list)')<{ data: Group[], count?: number, page?: number, per_page?: number }>()
export const GetGroupsError = defineAction('[groups] load error (list)')<{ error: Error }>()

export const GetGroupById = defineAction('[groups] get_group_by_id')<{ id: EntityId, useLambda?: boolean }>()
export const GetGroupByIdSuccess = defineAction('[groups] get_group_by_id_success')<{ group: Group }>()
export const GetGroupByIdError = defineAction('[groups] get_group_by_id_error')<{ error: Error }>()

export const GetGroupAccountOwnerInvite = defineAction('[groups] get_group_account_owner_invite')<{ id: EntityId }>()
export const GetGroupAccountOwnerInviteSuccess = defineAction('[groups] get_group_account_owner_invite_success')<{ account: Account | null }>()
export const CreateGroupAccountOwnerInvite = defineAction('[groups] create_group_account_owner_invite')<{ groupId: EntityId, accountId: EntityId }>()
export const DeleteGroupAccountOwnerInvite = defineAction('[groups] delete_group_account_owner_invite')<{ groupId: EntityId }>()
export const AcceptGroupAccountOwnerInvite = defineAction('[groups] accept_group_account_owner_invite')<{ groupId: EntityId, code: string }>()
export const AcceptGroupAccountOwnerInviteResult = defineAction('[groups] accept_group_account_owner_invite_result')<{ result: boolean }>()

export const GetEstimatedBilling = defineAction('[groups] get_estimated_billing')<{ groupId: EntityId }>()
export const GetEstimatedBillingSuccess = defineAction('[groups] get_estimated_billing_success')<{ estimatedBilling: EstimatedBilling }>()
export const GetEstimatedBillingError = defineAction('[groups] get_estimated_billing_error')<{ error: Error }>()

export const GetAccountsByGroupId = defineAction('[groups] get_accounts_by_group_id')<{ groupId: EntityId, params: Api.AccountLambdaQueryOpts }>()
export const GetAccountsByGroupIdSuccess = defineAction('[groups] get_accounts_by_group_id_success')<{ accounts: AccountLookup, accountIds: string[] }>()
export const ClearAccountsByGroupId = defineAction('[groups] clear_accounts_by_group_id')()

export const GetGroupAccountOwner = defineAction('[groups] get_group_account_owner')<{ groupId: EntityId }>()
export const GetGroupAccountOwnerSuccess = defineAction('[groups] get_group_account_owner_success')<{ account: Account | null }>()

export const GetChildGroups = defineAction('[groups] get child groups (practices) for dentistry')<{ id: EntityId }>()
export const GetChildGroupsSuccess = defineAction('[groups] get child groups (practices) for dentistry success')<{ parentId: EntityId, childGroups: Group[] }>()
export const GetChildGroupsError = defineAction('[groups] get child groups (practices) for dentistry error')<{ error: Error }>()

export const CreateGroup = defineAction('[groups] create_group')<{ data: Api.CreateGroupEntity } & CallbackPayload>()
export const CreateGroupSuccess = defineAction('[groups] create_group_success')()
export const CreateGroupError = defineAction('[groups] create_group_error')<{ error: Error }>()

export const EditGroup = defineAction('[groups] edit_group')<{ id: EntityId, data: Api.PatchedEntity, updated_at: string, customSuccessMessage?: string }>()
export const EditGroupSuccess = defineAction('[groups] edit_group success')()
export const EditGroupError = defineAction('[groups] edit_group error')<{ error: Error }>()

export const GetGroupLogo = defineAction('[groups] get group logo')<{ id: EntityId }>()
export const GetGroupLogoSuccess = defineAction('[groups] get group logo success')<{ id: EntityId, url: string }>()

export const SelectGroup = defineAction('[groups] select group')<{ id: EntityId }>()
export const ClearGroup = defineAction('[groups] clear group')()

export const selectors = createSelectors<Group>('groups')
