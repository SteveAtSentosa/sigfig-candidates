import { AppState } from '#/redux'
import Messenger from './Messenger'
import { StateProps } from './types'
import { connect } from 'react-redux'
import { getSelectedChannel } from '#/actions/chat'

export const mapState = (state: AppState): StateProps => {
  return {
    selectedChannel: getSelectedChannel(state),
    loggedInUser: state.auth.data.account,
    isAttachmentMenuOpen: state.chat.attachmentsMenu.isOpen,
    attachments: state.chat.attachments
  }
}

export default connect(mapState)(Messenger)
