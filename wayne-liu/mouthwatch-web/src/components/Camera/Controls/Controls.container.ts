import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import Controls from './Controls'
import { SetRecording } from '#/actions/camera'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  const { camera } = state
  return {
    captureType: camera.captureType,
    videoMode: camera.videoMode,
    isRecording: camera.isRecording,
    facingMode: camera.facingMode,
    availableDevices: camera.availableDevices
  }
}

export const actions: ActionProps = {
  setRecording: SetRecording
}

export default connect(mapState, actions)(Controls)
