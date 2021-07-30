import { ActionProps, StateProps } from './types'
import { CloseAudioRecordingModal, OpenAudioRecordingModal, SaveAudioRecording, StashAudioRecording } from '#/actions/audio'
import { PrepareAttachment } from '#/actions/chat'

import { AppState } from '#/redux'
import AudioRecordingModal from './AudioRecordingModal'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  const { file, modal } = state.audio
  return {
    audioFile: file,
    modalState: modal
  }
}

const mapDispatch: ActionProps = {
  saveAudioRecording: SaveAudioRecording,
  stashAudioRecording: StashAudioRecording,
  closeModal: CloseAudioRecordingModal,
  openModal: OpenAudioRecordingModal,
  prepareAttachment: PrepareAttachment
}
export default connect(mapState, mapDispatch)(AudioRecordingModal)
