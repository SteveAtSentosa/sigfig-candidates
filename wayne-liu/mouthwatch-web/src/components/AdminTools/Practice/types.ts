import { EntityId, Group } from '#/types'
import { LoginResponseAccount, SortOrder } from '#/api/types'

import { AdminToolsSearchPractices } from '#/actions/practices'
import { GetGroupById } from '#/actions/groups'
import { State as PracticeState } from '#/reducers/practices'
import { RouteComponentProps } from 'react-router-dom'

export interface MatchParams {
  groupId: string
}

export interface Props {
  groupId: EntityId
  showSearch?: boolean
  showPagination?: boolean
  group: void | Group
  practiceState?: PracticeState
  loggedInUser: LoginResponseAccount
  getGroup: typeof GetGroupById
  searchPractices: typeof AdminToolsSearchPractices
}

export type StateProps = Pick<Props, 'group' | 'practiceState' | 'loggedInUser' >
export type ActionProps = Pick<Props, 'getGroup' | 'searchPractices' >
export type OwnProps = RouteComponentProps<MatchParams> & Pick<Props, 'groupId' | 'showSearch' | 'showPagination' >

export interface State {
  showSearch?: boolean
  showPagination?: boolean
  basicSearchQuery?: string
  isSearching?: boolean
  searchQuery?: string
  order?: SortOrder
  sort?: string
}
