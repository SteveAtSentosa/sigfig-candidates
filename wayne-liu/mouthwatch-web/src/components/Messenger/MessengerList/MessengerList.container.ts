import { ActionProps, StateProps } from './types'
import { ArchiveChannel, MarkAsRead } from '#/microservice-middleware'
import { ClearAllAttachments, ClearSelectedChannel, SelectChannel, getFilteredChannels } from '#/actions/chat'

import { AppState } from '#/redux'
import MessengerList from './MessengerList'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

export const mapState = (state: AppState): StateProps => {
  return {
    channels: getFilteredChannels(state),
    selectedChannel: state.chat.selectedChannel,
    loggedInAccount: state.auth.data.account,
    userRole: state.auth.data.account.account_roles[0].name,
    chatUsers: state.microservice.users,
    initialized: state.chat.initialized,
    microserviceChannels: state.microservice.channels
  }
}

export const mapDispatch: ActionProps = {
  selectChannel: SelectChannel,
  markChannelAsRead: MarkAsRead,
  clearAllAttachments: ClearAllAttachments,
  archiveChannel: ArchiveChannel,
  clearSelectedChannel: ClearSelectedChannel
}

export const ConnectedMessengerList = connect(mapState, mapDispatch)(MessengerList)
export default withRouter(ConnectedMessengerList)
