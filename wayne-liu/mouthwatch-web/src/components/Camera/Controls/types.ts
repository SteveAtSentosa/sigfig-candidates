import { CaptureType, FacingMode, SetRecording, VideoMode } from '#/actions/camera'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  captureType: CaptureType
  videoMode: VideoMode
  isRecording: boolean
  facingMode: FacingMode
  setRecording: typeof SetRecording
  onVideoRecordStop: () => void
  onVideoRecordStart: () => void
  onCameraSwitch: () => void
  onSnapshot: () => void
  onSave: () => void
  onCancel: () => void
  availableDevices: ConstrainDOMString[]
  showExtraControls: boolean
}

export type StateProps = Pick<Props, 'captureType' | 'videoMode' | 'isRecording' | 'facingMode' | 'availableDevices'>
export type ActionProps = Pick<Props, 'setRecording'>
export type OwnProps = Pick<Props, 'onVideoRecordStart' | 'onVideoRecordStop' | 'onSave' | 'onCancel' | 'onSnapshot' | 'onCameraSwitch' | 'showExtraControls'>
