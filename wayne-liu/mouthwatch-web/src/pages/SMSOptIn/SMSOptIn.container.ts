import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import { UpdateSMSOptStatus } from '#/actions/accounts'
import SMSOptIn from './SMSOptIn'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

export const mapState = (state: AppState): StateProps => ({
  auth: state.auth,
  sendTextAlerts: formValueSelector('registerTextAlerts')(state, 'send_text_alerts')
})

export const actions: ActionProps = {
  updateSMSOptStatus: UpdateSMSOptStatus
}

export default connect(mapState, actions)(SMSOptIn)
