import * as React from 'react'

import { ActionProps, InjectedProps, PassedProps, RenderUserGroupsProps, State, StateProps } from './types'
import { ClearGroup, GetChildGroups, GetGroupById } from '#/actions/groups'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import { connect } from 'react-redux'

class WithUserGroups extends React.Component<RenderUserGroupsProps & InjectedProps & PassedProps, State> {

  state: State = {
    selectedGroupId: ''
  }

  private changeSelectedGroupId = (id: EntityId) => {
    this.setState({ selectedGroupId: id })
  }

  private get userGroups () {
    return this.props.loggedInUser.groups
      .filter(group => group.group_type.code === 'dentistry')
      .map(group => ({ label: group.name, value: group.id }))
  }

  private get userPractices () {
    return this.props.loggedInUser.groups
      .filter(group => group.group_type.code === 'practice')
      .map(group => ({ label: group.name, value: group.id }))
  }

  private get selectedGroupId () {
    // For providers assigned to a dentistry, use the dentistry id
    // For superadmin and providers assigned to practices, use selectedGroupId
    return this.userGroups.length === 1 ? this.userGroups[0].value : this.state.selectedGroupId
  }

  private get childGroups () {
    const { childGroups } = this.props
    const { selectedGroupId } = this
    return selectedGroupId && childGroups[selectedGroupId] &&
      childGroups[selectedGroupId].map(p => ({ label: p.name, value: p.id }))
  }

  private get defaultPracticeOptions () {
    /*
      If the provider (caller) is assigned to a dentistry, they can assign the
      entity to any of the practices that are children of the dentistry.
      If the provider is assigned to one or more practices, they can assign the
      entity to any of the practices that they are a part of.
      For superadmin, the selectedGroupId controls which set of childGroups
      to pass down.
    */
    return this.childGroups || this.userPractices || []
  }

  private get defaultGroupOptions () {
    // NOTE: Superadmin will render ConnectedGroupField instead,
    // which fetches all available groups.
    // TODO LAMBDA: Hoist that functionality to this component?
    return this.userGroups || []
  }

  componentDidMount () {
    if (this.selectedGroupId) {
      this.props.getGroupById({ id: this.selectedGroupId })
      this.props.getChildGroups({ id: this.selectedGroupId })
      this.changeSelectedGroupId(this.selectedGroupId)
    }
  }

  componentDidUpdate (_prevProps, prevState) {
    const { selectedGroupId } = this.state
    if (prevState.selectedGroupId !== selectedGroupId) {
      this.props.getGroupById({ id: selectedGroupId })
      this.props.getChildGroups({ id: selectedGroupId })
    }
  }

  componentWillUnmount () {
    this.props.clearGroup()
  }

  render () {
    const { defaultPracticeOptions, defaultGroupOptions, changeSelectedGroupId } = this
    const { children, ...props } = this.props
    return children({
      defaultPracticeOptions,
      defaultGroupOptions,
      changeSelectedGroupId,
      ...props
    })
  }
}

export default connect<StateProps, ActionProps, InjectedProps, AppState>(
  (state: AppState) => ({
    loggedInUser: state.auth.data.account,
    group: state.groups.group,
    childGroups: state.groups.childGroups.byParentId
  }),
  {
    clearGroup: ClearGroup,
    getGroupById: GetGroupById,
    getChildGroups: GetChildGroups
  }
)(WithUserGroups)
