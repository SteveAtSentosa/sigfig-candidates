import { Role } from '#/types'
import { schema } from 'normalizr'

export const role = new schema.Entity<Role>('role')
export const roles = new schema.Array(role, 'account_roles')
export const mapping = { account_roles: roles }
