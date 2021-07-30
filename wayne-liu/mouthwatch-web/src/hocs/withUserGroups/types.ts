import { ClearGroup, GetChildGroups, GetGroupById } from '#/actions/groups'
import { EntityId, Group, Option } from '#/types'

import { LoginResponseAccount } from '#/api/types'

/*
  These InjectedProps have to be defined as optional so that the wrapped component
  is not required to set them manually. (WARNING: these CANNOT be overwritten if set
  manually on the wrapped component, but the linter will NOT throw an error if you do.)
*/
export interface InjectedProps {
  defaultPracticeOptions?: Option[]
  defaultGroupOptions?: Option[]
  changeSelectedGroupId?: (id: EntityId) => void
  selectedGroupId?: EntityId
  defaultPracticeValue?: Option[]
}

export interface StateProps {
  loggedInUser: LoginResponseAccount
  group: Group
  childGroups: Record<EntityId, Array<Group>>
}

export interface ActionProps {
  clearGroup: typeof ClearGroup
  getGroupById: typeof GetGroupById
  getChildGroups: typeof GetChildGroups
}

export interface State {
  selectedGroupId: EntityId
}

export type PassedProps = InjectedProps & StateProps & ActionProps

export interface RenderUserGroupsProps {
  children (props: PassedProps): React.ReactNode
}
