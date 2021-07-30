import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import { CreateSession } from '#/actions/video'
import Toolbar from './Toolbar'
import { connect } from 'react-redux'
import { getSelectedChannel } from '#/actions/chat'

export const mapState = (state: AppState): StateProps => {
  return {
    loggedInUser: state.auth.data.account,
    channel: getSelectedChannel(state),
    selectedChannel: state.chat.selectedChannel,
    viewPerms: state.ui.permissions
  }
}

export const mapDispatch: ActionProps = {
  createVideoSession: CreateSession
}

export default connect(mapState, mapDispatch)(Toolbar)
