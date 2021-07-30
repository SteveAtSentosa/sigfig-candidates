import * as Api from '#/api'

import { Account, EntityId, Option, RoleName } from '#/types'

import { State as AccountState } from '#/reducers/accounts'
import { AdminToolsSearchAccounts } from '#/actions/accounts'
import { LoginResponseAccount } from '#/api/types'
import { RouteComponentProps } from 'react-router-dom'

interface Props {
  showSearch?: boolean
  showPagination?: boolean
  accountState?: AccountState
  authedAccount: Api.LoginResponseAccount
  searchAccounts: typeof AdminToolsSearchAccounts
}

export type StateProps = Pick<Props, 'accountState' | 'authedAccount'>
export type ActionProps = Pick<Props, 'searchAccounts'>
export type OwnProps = Pick<Props, 'showSearch' | 'showPagination'> & RouteComponentProps

export interface State {
  basicSearchQuery?: string
  order?: Api.SortOrder
  sort?: string
  accountRoles: RoleName[]
  showInactiveAccounts?: boolean
}

export interface FormValues {
  id?: string
  username: string
  account_roles: Option[]
  first_name: string
  last_name: string
  email?: string
  phone?: string
  prefix?: string
  suffix?: string
  specialty?: string
  can_video?: boolean | string
  time_zone_pref?: Option | string
  groups: Option[]
  practices: Option[]
}

export interface FormProps {
  account?: Account
  withoutUpdateAvatar?: boolean
  selectedGroupId?: EntityId
  changeSelectedGroupId?: (e: EntityId) => void
  groupOptions?: Option[]
  practiceOptions?: Option[]
  loggedInUser: LoginResponseAccount
  disableGroupDropdown?: boolean
}

export interface FormState {
  isResetOpen: boolean
}
