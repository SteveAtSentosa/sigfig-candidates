import { PrepareAttachment } from '#/actions/chat'
import { CloseAudioRecordingModal, OpenAudioRecordingModal, SaveAudioRecording, StashAudioRecording } from '#/actions/audio'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  stashAudioRecording: typeof StashAudioRecording
  saveAudioRecording: typeof SaveAudioRecording
  audioFile: File
  closeModal: typeof CloseAudioRecordingModal
  openModal: typeof OpenAudioRecordingModal
  modalState: 'open' | 'closed'
  prepareAttachment: typeof PrepareAttachment
}

export interface State {
  blob: Blob
  title: string
  isLoading: boolean
  isRecording: boolean
  recording?: string
  secondsRecorded?: string
  isPlaying: boolean
  isAboutToNavigate: boolean
  audioData: Uint8Array
}

export type ActionProps = Pick<Props, 'saveAudioRecording' | 'stashAudioRecording' | 'closeModal' | 'openModal' | 'prepareAttachment'>
export type StateProps = Pick<Props, 'audioFile' | 'modalState'>
