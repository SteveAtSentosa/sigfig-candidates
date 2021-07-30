import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import SelectCaptureType from './SelectCaptureType'
import { SetCaptureType } from '#/actions/camera'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  const { camera } = state
  return {
    captureType: camera.captureType
  }
}

export const actions: ActionProps = {
  setCaptureType: SetCaptureType
}

export default connect(mapState, actions)(SelectCaptureType)
