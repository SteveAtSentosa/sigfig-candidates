import { ActionProps, FormData, OwnProps, StateProps } from './types'
import { ArchiveChannel, SendMessageToChannel, SendMessageToUser, SendMultimediaMessage } from '#/microservice-middleware'
import { CloseAttachmentsMenu, OpenAttachmentsMenu, PrepareAttachment, UploadMessageAttachments, getSelectedChannel } from '#/actions/chat'
import { formValueSelector, reduxForm } from 'redux-form'

import { AppState } from '#/redux'
import MessengerForm from './MessengerForm'
import { OpenAudioRecordingModal } from '#/actions/audio'
import { OpenModal } from '#/actions/modals'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const mapDispatch: ActionProps = {
  sendMessageToUser: SendMessageToUser,
  sendMessageToChannel: SendMessageToChannel,
  openAttachmentsMenu: OpenAttachmentsMenu,
  archiveChannel: ArchiveChannel,
  openAudioRecordingModal: OpenAudioRecordingModal,
  prepareAttachment: PrepareAttachment,
  sendMultiMediaMessage: SendMultimediaMessage,
  uploadMessageAttachments: UploadMessageAttachments,
  closeAttachmentsMenu: CloseAttachmentsMenu,
  openVideoRecordingModal: OpenModal
}

export const mapState = (state: AppState, props: OwnProps): StateProps => {
  const { chat, microservice } = state
  const currentMessage: string = formValueSelector(props.form)(state, 'message')
  return {
    loggedInAccount: state.auth.data.account,
    treatmentPlans: state.treatmentPlans.data,
    selectedChannel: getSelectedChannel(state),
    attachments: chat.attachments,
    isAttachmentsMenuOpen: chat.attachmentsMenu.isOpen,
    initialMessage: chat.initialMessage,
    currentMessage,
    uploadingAttachments: chat.uploading,
    isSiteOnline: chat.online,
    webSocketReadyState: microservice.readyState,
    viewPerms: state.ui.permissions
  }
}

export const ConnectedMessengerForm = connect(mapState, mapDispatch)(MessengerForm)

export const ConnectedMessengerFormWithRouter = withRouter(ConnectedMessengerForm)

export default reduxForm<FormData, any>({ enableReinitialize: true })(ConnectedMessengerFormWithRouter)
