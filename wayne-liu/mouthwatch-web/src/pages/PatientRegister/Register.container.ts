import { ActionProps, StateProps } from './types'
import { RegisterPatient, ValidateRegistration } from '#/actions/auth'

import { AppState } from '#/redux'
import Registration from './Register'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => ({
  auth: state.auth
})

export const actions: ActionProps = {
  register: RegisterPatient,
  validate: ValidateRegistration
}

export default connect(mapState, actions)(Registration)
