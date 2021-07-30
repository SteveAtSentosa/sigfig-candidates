import { ActionProps, FormData, OwnProps, StateProps } from './types'

import { AppState } from '#/redux'
import ProviderList from './ProviderList'
import { StartConversation } from '#/actions/gchat'
import { connect } from 'react-redux'
import { getFilteredChannels } from '#/actions/chat'
import { reduxForm } from 'redux-form'

export const mapState = (state: AppState): StateProps => {
  return {
    partitionedChannels: getFilteredChannels(state),
    chatUsers: state.accounts.accounts,
    chatUsersIds: state.accounts.accountIds
  }
}

export const mapDispatch: ActionProps = {
  startConversation: StartConversation
}

const ConnectedProviderList = connect<StateProps, {}, OwnProps>(mapState, mapDispatch)(ProviderList)

export default reduxForm<FormData, OwnProps>({})(ConnectedProviderList)
