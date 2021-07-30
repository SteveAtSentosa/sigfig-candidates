import { ActionProps, StateProps } from './types'
import { CloseModal, OpenModal } from '#/actions/modals'

import { AppState } from '#/redux'
import VideoRecordModal from './VideoRecordModal'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    isOpen: state.modals.videoRecord.isOpen
  }
}

const mapDispatch: ActionProps = {
  closeModal: CloseModal,
  openModal: OpenModal
}

export default connect(mapState, mapDispatch)(VideoRecordModal)
