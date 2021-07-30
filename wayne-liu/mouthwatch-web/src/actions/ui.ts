import { EntityId, SubscriptionStatus, ViewPermissions } from '#/types'
import { defineAction } from 'redoodle'

export const GetViewPermissions = defineAction('[ui] get_view_permissions')()
export const GetViewPermissionsSuccess = defineAction('[ui] get_view_permissions_success')<{ viewPerms: ViewPermissions, subscriptionStatus: SubscriptionStatus, groupId: EntityId, isPatient: boolean, createdAt: string}>()
export const GetViewPermissionsError = defineAction('[ui] get_view_permissions_error')()
