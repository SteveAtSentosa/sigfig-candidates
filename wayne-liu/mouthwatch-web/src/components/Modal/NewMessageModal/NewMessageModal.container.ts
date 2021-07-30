import { ActionProps, StateProps } from './types'
import { CreateChannelAutoSelect, SelectChannel } from '#/actions/chat'

import { AppState } from '#/redux'
import { ArchiveChannel } from '#/microservice-middleware'
import NewMessageModal from './NewMessageModal'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { hasPermission } from '#/utils'

export const mapState = (state: AppState): StateProps => {
  return {
    chatUsers: state.microservice.users,
    loggedInUserId: state.auth.data.account.id,
    channels: state.microservice.channels,
    formValues: formValueSelector('selectMessageRecipients')(state, 'users'),
    groupMessagingEnabled: hasPermission(state.ui.permissions, 'group_messaging')
  }
}

const mapDispatch: ActionProps = {
  createChannelAndAutoSelect: CreateChannelAutoSelect,
  selectChannel: SelectChannel,
  archiveChannel: ArchiveChannel
}

export default connect(mapState, mapDispatch)(NewMessageModal)
