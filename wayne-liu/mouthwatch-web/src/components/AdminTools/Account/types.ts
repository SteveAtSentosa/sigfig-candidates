import { AdminToolsSearchGroups } from '#/actions/groups'
import { State as GroupState } from '#/reducers/groups'
import { RouteComponentProps } from 'react-router-dom'
import { SortOrder } from '#/api/types'

interface Props extends RouteComponentProps {
  showSearch?: boolean
  showPagination?: boolean
  groupState: GroupState
  searchGroups: typeof AdminToolsSearchGroups
}

export type StateProps = Pick<Props, 'groupState' >
export type ActionProps = Pick<Props, 'searchGroups' >
export type OwnProps = RouteComponentProps & Pick<Props, 'showSearch' | 'showPagination' >

export interface State {
  showSearch?: boolean
  showPagination?: boolean
  basicSearchQuery?: string
  isSearching?: boolean
  searchQuery?: ''
  order?: SortOrder
  sort?: string
}
