import { StateProps, ActionProps } from './types'

import { AppState } from '#/redux'
import AddAttachmentsMenu from './AddAttachmentsMenu'
import { ClearAllAttachments } from '#/actions/chat'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    token: state.auth.data.token
  }
}

export const actions: ActionProps = {
  clearAllAttachments: ClearAllAttachments
}

export default connect(mapState, actions)(AddAttachmentsMenu)
