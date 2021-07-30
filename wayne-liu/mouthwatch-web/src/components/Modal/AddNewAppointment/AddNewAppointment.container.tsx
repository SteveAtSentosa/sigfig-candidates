import { ActionProps, OwnProps, StateProps } from './types'

import AddNewAppointmentModal from './AddNewAppointment'
import { AppState } from '#/redux'
import { CreateAppointment } from '#/actions/appointments'
import { connect } from 'react-redux'

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState): StateProps => {
    return {
      patients: state.patients.data
    }
  },
  {
    createAppointment: CreateAppointment
  }
)(AddNewAppointmentModal)
