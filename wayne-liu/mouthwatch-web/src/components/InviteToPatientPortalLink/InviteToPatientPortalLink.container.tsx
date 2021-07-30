import * as React from 'react'

import { ActionProps, OwnProps, StateProps } from './types'
import { addDays, isAfter } from 'date-fns'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import InviteLinkUI from './InviteToPatientPortalLink'
import { InviteUserToPatientPortal } from '#/actions/accounts'
import { Loads } from '#/components/Loader'
import { OpenModal } from '#/actions/modals'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { isPatientLegal } from '#/utils'
import { selectors } from '#/actions/patients'

type Props = OwnProps & StateProps & ActionProps

class InvitePatientToPortalLink extends React.PureComponent<Props> {

  private get alreadyInvited () {
    const { patient } = this.props
    if (!patient || !patient.account) return false
    const { account: { status, last_email_sent } } = patient
    const expiresOn = addDays(new Date(last_email_sent), 30)
    return status === 'invited' && last_email_sent && isAfter(expiresOn, new Date())
  }

  private toggleAlreadyInvitedModal = () => {
    const { patient: { account_id } } = this.props
    const text = 'This patient has recently received an invitation to the patient portal. Are you sure you want to send a new one?'
    this.openConfirmationModal(text, account_id)
  }

  // if the patient isn't 18 or older, open the confirm modal
  private toggleUnderAgeModal = () => {
    const { patient: { account_id } } = this.props
    const text = 'You are attempting to message a patient who is under 18. Do you wish to proceed?'
    this.openConfirmationModal(text, account_id)
  }

  private saveAndinvitePatient = () => {
    const { patient, saveAndInvite, newEmail } = this.props
    // only save the patient if the email has changed
    // TODO: refactor this so that saveAndInvite button triggers underage / already invited modals
    if (saveAndInvite && !isEqual(patient.email, newEmail)) {
      // redux-form `submit` action dispatcher
      return saveAndInvite()
    }

    if (!patient.account_id) return null
    if (this.alreadyInvited) {
      this.toggleAlreadyInvitedModal()
    } else if (!isPatientLegal(patient.dob)) {
      this.toggleUnderAgeModal()
    } else {
      this.props.invitePatient({ accountId: patient.account_id })
    }
  }

  private openConfirmationModal = (text: string, accountId: EntityId) => {
    this.props.openModal({ modal: 'confirmInvitation', text, accountId, sendToChatOnCancel: false, sendToChatOnConfirm: false })
  }

  render () {
    const { patient, expectAccount, newEmail, showStatus } = this.props
    return (
      <Loads when={patient && !(patient instanceof Error)}>
        {() => (
          <InviteLinkUI
            patient={patient}
            newEmail={newEmail}
            showStatus={showStatus}
            expectAccount={expectAccount}
            invitePatientToPortal={this.saveAndinvitePatient}
          />
        )}
      </Loads>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState, props) => ({
    patient: selectors.getById(state, props.patientId)
  }), {
    invitePatient: InviteUserToPatientPortal,
    openModal: OpenModal
  }
)(InvitePatientToPortalLink)
