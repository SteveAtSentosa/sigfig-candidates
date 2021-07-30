import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import Attachment from './Attachment'
import { RemoveAttachments } from '#/actions/chat'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    token: state.auth.data.token
  }
}

export const mapDispatch: ActionProps = {
  removeAttachments: RemoveAttachments
}

export default connect(mapState, mapDispatch)(Attachment)
