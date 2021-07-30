import * as React from 'react'

import { ActionProps, InjectedProps, PassedProps, State, StateProps } from './types'
import { ClearGroup, GetChildGroups, GetGroupById } from '#/actions/groups'
import { EntityId, Option } from '#/types'

import { AppState } from '#/redux'
import { connect } from 'react-redux'

const withUserGroups = <P extends InjectedProps>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> => {
  class WithUserGroups extends React.Component<Omit<PassedProps, keyof InjectedProps>, State> {

    state: State = {
      selectedGroupId: ''
    }

    private changeSelectedGroupId = (id: EntityId) => {
      this.setState({ selectedGroupId: id })
    }

    private get userGroups (): Option[] {
      return this.props.loggedInUser.groups
        .filter(group => group.group_type.code === 'dentistry')
        .map(group => ({ label: group.name, value: group.id }))
    }

    private get userPractices (): Option[] {
      return this.props.loggedInUser.groups
        .filter(group => group.group_type.code === 'practice')
        .map(group => ({ label: group.name, value: group.id }))
    }

    private get selectedGroupId (): EntityId {
      // For providers assigned to a dentistry, use the dentistry id
      // For superadmin and providers assigned to practices, use this.state.selectedGroupId
      return this.userGroups.length === 1 ? this.userGroups[0].value : this.state.selectedGroupId
    }

    private get childGroups (): Option[] {
      const { childGroups } = this.props
      const { selectedGroupId } = this
      return selectedGroupId && childGroups[selectedGroupId] &&
        childGroups[selectedGroupId].map(p => ({ label: p.name, value: p.id }))
    }

    private get defaultPracticeOptions (): Option[] {
      /*
        If the provider (caller) is assigned to a dentistry, they can assign the
        entity to any of the practices that are children of the dentistry.
        If the provider is assigned to one or more practices, they can assign the
        entity to any of the practices that they are a part of.
        For superadmin, the state.selectedGroupId controls which set of childGroups
        to pass down.
      */
      return this.childGroups || this.userPractices || []
    }

    private get defaultGroupOptions (): Option[] {
      // NOTE: Superadmin will render ConnectedGroupField instead,
      // which fetches all available groups.
      // TODO LAMBDA: Hoist that functionality to this component?
      return this.userGroups || []
    }

    private get requiresDefaultPracticeValue () {
      /*
        If a provider is assigned to only one practice, the `practices` field will
        be hidden. In this specific case, we will need to set a default value for practices
        so that the service does not return an error on submit. In all other cases,
        a default value for practices should not be set.
      */
      return this.defaultGroupOptions.length === 0 && this.defaultPracticeOptions.length === 1
    }

    private get defaultPracticeValue () {
      return this.requiresDefaultPracticeValue ? this.defaultPracticeOptions : []
    }

    componentDidMount () {
      const { getGroupById, getChildGroups } = this.props
      if (this.selectedGroupId) {
        getGroupById({ id: this.selectedGroupId })
        getChildGroups({ id: this.selectedGroupId })
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
      const { defaultPracticeOptions, defaultGroupOptions, changeSelectedGroupId, defaultPracticeValue } = this
      const { selectedGroupId } = this.state
      const { loggedInUser, group, childGroups, clearGroup, getGroupById, getChildGroups, ...props } = this.props

      const injectedProps: InjectedProps = { defaultPracticeValue, selectedGroupId, defaultPracticeOptions, defaultGroupOptions, changeSelectedGroupId }
      const wrappedProps: P = { ...(props as P) }

      return (
        <WrappedComponent
          {...wrappedProps}
          {...injectedProps}
        />
      )
    }
  }

  return connect<StateProps, ActionProps, P, AppState>(
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
}

export default withUserGroups
