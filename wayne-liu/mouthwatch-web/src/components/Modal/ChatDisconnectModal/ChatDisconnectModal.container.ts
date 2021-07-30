import { ActionProps, StateProps } from './types'
import { Close, Connect } from '#/microservice-middleware'
import { CloseModal, OpenModal } from '#/actions/modals'

import { AppState } from '#/redux'
import ChatDisconnectModal from './ChatDisconnectModal'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    isOpen: state.modals.chatDisconnect.isOpen
  }
}

const mapDispatch: ActionProps = {
  closeModal: CloseModal,
  openModal: OpenModal,
  connect: Connect,
  disconnect: Close
}

export default connect(mapState, mapDispatch)(ChatDisconnectModal)
