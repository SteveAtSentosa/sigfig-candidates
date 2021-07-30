import { defineAction } from 'redoodle'
import { User, EntityId } from '#/types'

// Actions

export const LoadAllUsers = defineAction('[users] load_all')<{ selfId: EntityId }>()

export const LoadAllUsersSuccess = defineAction('[users] load_all_success')<{
  users: User[]
}>()

export const LoadAllUsersError = defineAction('[users] load_all_error')<{
  error: Error
}>()
