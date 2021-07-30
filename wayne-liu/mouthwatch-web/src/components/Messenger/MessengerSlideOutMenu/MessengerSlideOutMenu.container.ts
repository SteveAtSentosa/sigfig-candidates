import { ActionProps, StateProps } from './types'
import { AddAttachments, ClearAllAttachments, CloseAttachmentsMenu, RemoveAttachments, getPatientInChatUsers } from '#/actions/chat'

import { AppState } from '#/redux'
import ImagesSlideOutMenu from './MessengerSlideOutMenu'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    token: state.auth.data.token,
    attachments: state.chat.attachments,
    media: state.media.data,
    isOpen: state.chat.attachmentsMenu.isOpen,
    patientInChatUsers: getPatientInChatUsers(state),
    loggedInUser: state.auth.data.account.id
  }
}

export const actions: ActionProps = {
  closeAttachmentsMenu: CloseAttachmentsMenu,
  clearAllAttachments: ClearAllAttachments,
  addAttachments: AddAttachments,
  removeAttachments: RemoveAttachments
}

export default connect(mapState, actions)(ImagesSlideOutMenu)
