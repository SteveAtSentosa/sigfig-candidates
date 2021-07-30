import { CaptureCameraMedia, CaptureType, CapturedMedia, DeviceType, FacingMode, Reset, SetAvailableDevices, SetCaptureType, SetDeviceType, SetFacingMode, SetRecording, SetVideoFile, SetVideoMode, VideoMode } from '#/actions/camera'

import { ShowNotificationPopUp } from '#/actions/notificationPopUp'

export interface DefaultProps {
  height: number
  width: number
  onVideoCancel: (video: File) => any
  onVideoCapture: (video: File) => any
  videoOnly: boolean
  snapshotOnly: boolean
  showControls: boolean
  onVideoSave: (videoFile: File) => any
  onImageCapture: (image: File) => any
  onImport: (files: File[]) => any
}

export interface Props extends Partial<DefaultProps> {
  capturedMedia: CapturedMedia
  captureType: CaptureType
  isRecording: boolean
  videoFile: File
  facingMode: FacingMode
  deviceType: DeviceType
  availableDevices: ConstrainDOMString[]
  captureCameraMedia: typeof CaptureCameraMedia
  setAvailableDevices: typeof SetAvailableDevices
  setDeviceType: typeof SetDeviceType
  setRecording: typeof SetRecording
  setFacingMode: typeof SetFacingMode
  setVideoMode: typeof SetVideoMode
  setVideoFile: typeof SetVideoFile
  setCaptureType: typeof SetCaptureType
  showNotificationPopUp: typeof ShowNotificationPopUp
  reset: typeof Reset
  videoMode: VideoMode
}

export type StateProps = Pick<Props, 'availableDevices' | 'captureType' | 'deviceType' | 'facingMode' | 'videoMode' | 'videoFile' | 'isRecording' | 'capturedMedia'>
export type ActionProps = Pick<Props, 'captureCameraMedia' | 'setAvailableDevices' | 'setDeviceType' | 'setFacingMode' | 'setRecording' | 'setVideoMode' | 'setVideoFile' | 'showNotificationPopUp' | 'reset' | 'setCaptureType'>
export type OwnProps = Pick<Props, 'onVideoSave' | 'onVideoCancel' | 'height' | 'width' | 'onImageCapture' | 'onVideoCapture' | 'onImport' | 'videoOnly' | 'snapshotOnly' | 'showControls'>
