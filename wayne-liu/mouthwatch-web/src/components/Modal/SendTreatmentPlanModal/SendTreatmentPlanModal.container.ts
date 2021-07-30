import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import { CloseModal } from '#/actions/modals'
import SendTreatmentPlanModal from './SendTreatmentPlanModal'
import { SendTreatmentPlanToPatient } from '#/actions/chat'
import { UpdatePatient } from '#/actions/patients'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const mapState = (state: AppState): StateProps => {
  return {
    treatmentPlanId: state.modals.sendTreatmentPlan.treatmentPlanId,
    isOpen: state.modals.sendTreatmentPlan.isOpen,
    chatUsers: state.accounts.accounts,
    channels: state.microservice.channels,
    loggedInUser: state.auth.data.account.id,
    treatmentPlans: state.treatmentPlans.data
  }
}

const mapDispatch: ActionProps = {
  closeModal: CloseModal,
  sendTreatmentPlanToPatient: SendTreatmentPlanToPatient,
  updatePatient: UpdatePatient
}
const ConnectedSendTreatmentPlanModal = connect(mapState, mapDispatch)(SendTreatmentPlanModal)

export default withRouter(ConnectedSendTreatmentPlanModal)
