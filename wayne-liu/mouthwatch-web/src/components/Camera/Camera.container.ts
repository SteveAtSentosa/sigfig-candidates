import { ActionProps, StateProps } from './types'
import { CaptureCameraMedia, Reset, SetAvailableDevices, SetCaptureType, SetDeviceType, SetFacingMode, SetRecording, SetVideoFile, SetVideoMode } from '#/actions/camera'

import { AppState } from '#/redux'
import Camera from './Camera'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  const { camera } = state
  return {
    availableDevices: camera.availableDevices,
    capturedMedia: camera.capturedMedia,
    captureType: camera.captureType,
    deviceType: camera.deviceType,
    facingMode: camera.facingMode,
    isRecording: camera.isRecording,
    videoFile: camera.videoFile,
    videoMode: camera.videoMode
  }
}

export const actions: ActionProps = {
  captureCameraMedia: CaptureCameraMedia,
  reset: Reset,
  setAvailableDevices: SetAvailableDevices,
  setCaptureType: SetCaptureType,
  setDeviceType: SetDeviceType,
  setFacingMode: SetFacingMode,
  setRecording: SetRecording,
  setVideoFile: SetVideoFile,
  setVideoMode: SetVideoMode,
  showNotificationPopUp: ShowNotificationPopUp
}

export default connect(mapState, actions)(Camera)
