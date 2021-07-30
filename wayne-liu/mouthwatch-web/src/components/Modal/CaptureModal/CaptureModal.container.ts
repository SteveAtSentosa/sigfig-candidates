import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import CaptureModal from './CaptureModal'
import { CreateAppointment } from '#/actions/appointments'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => ({
  loggedInUserId: state.auth.data.account.id

})

const mapDispatch: ActionProps = {
  createAppointment: CreateAppointment
}

export default connect(mapState, mapDispatch)(CaptureModal)
