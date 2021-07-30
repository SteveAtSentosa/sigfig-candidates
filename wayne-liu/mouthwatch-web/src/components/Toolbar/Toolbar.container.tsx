import * as React from 'react'

import { Account, EntityId } from '#/types'
import { ActionProps, Props, State, StateProps } from './types'
import { UpdatePatient, selectors } from '#/actions/patients'
import { addDays, isBefore } from 'date-fns'

import { AppState } from '#/redux'
import { CreateChannelAutoSelect } from '#/actions/chat'
import { InviteUserToPatientPortal } from '#/actions/accounts'
import { OpenModal } from '#/actions/modals'
import ToolbarUI from './ui/Toolbar'
import { connect } from 'react-redux'
import { isPatientLegal } from '#/utils'
import { withRouter } from 'react-router'

class ToolbarContainer extends React.PureComponent<Props & ActionProps & StateProps, State> {

  state: State = {
    archiveModalIsOpen: false
  }

  // see if patient already exists in a channel
  private get patientExistsInChannels () {
    const { patient: { account: { id } }, channels } = this.props

    let patientChannel = null
    channels.forEach(
      (channel) => {
        // if we've already found a patientChannel, no need to check the rest of the channels
        if (patientChannel) {
          return
        }
        patientChannel = channel.userToChannels.find(uc => uc.userId === id)
      }
    )

    if (patientChannel) {
      return true
    }

    return false
  }

  private openArchiveModal = () => this.setState({ archiveModalIsOpen: true })
  private closeArchiveModal = () => this.setState({ archiveModalIsOpen: false })

  private openConfirmationModal = (text: string, accountId: EntityId, sendToChatOnCancel = true, sendToChatOnConfirm = true) => {
    this.props.openModal({ modal: 'confirmInvitation', text, accountId, sendToChatOnCancel, sendToChatOnConfirm })
  }

  private activatePatient = () => {
    const { patientId, updatePatient, patient } = this.props
    if (patient && patient.status) {
      updatePatient({ id: patientId, patient: { status: { op: 'replace', value: 'New' } }, updated_at: patient.updated_at })
    }
  }

  private checkThenSendMessage = (account: Account) => () => {
    const { patient } = this.props
    if (this.invitationHasExpired(account)) {
      const text = 'This patient\'s invitation to the patient portal has expired. Do you want to send a new one?'
      this.openConfirmationModal(text, patient.account_id)
    } else if (patient && !isPatientLegal(patient.dob) && !this.patientExistsInChannels && account.status !== 'invited') {
      // if the patient is underage (< 18), and does not already exist in a channel
      const text = 'You are attempting to message a patient who is under 18. Do you wish to proceed?'
      this.openConfirmationModal(text, patient.account_id, false)
    } else if (account.status === 'inactive') {
      this.invitePatientAndCreateChannel(account)
    } else {
      this.sendMessageToPatient(account)
    }
  }

  private invitationHasExpired = (account: Account) => {
    const { status, last_email_sent } = account
    const expiresOn = addDays(new Date(last_email_sent), 30)
    return status === 'invited' && last_email_sent && isBefore(expiresOn, new Date())
  }

  private invitePatientAndCreateChannel = (account: Account) => {
    const { invitePatient } = this.props
    invitePatient({ accountId: account.id, createAndSelectChannel: true })
    this.props.history.push('/provider-chat')
  }

  private sendMessageToPatient = (account: Account) => {
    const { createChannelAndAutoSelect } = this.props
    createChannelAndAutoSelect({ userIds: [ account.id ] })
    this.props.history.push('/provider-chat')
  }

  render () {
    const { children, backButton, backButtonLink, title, patient, patientId, showUpgradeBadge } = this.props
    const { archiveModalIsOpen } = this.state

    return (
        <ToolbarUI
          archiveModalIsOpen={archiveModalIsOpen}
          openArchiveModal={this.openArchiveModal}
          closeArchiveModal={this.closeArchiveModal}
          backButton={backButton}
          backButtonLink={backButtonLink}
          activatePatient={this.activatePatient}
          checkThenSendMessage={this.checkThenSendMessage}
          title={title}
          patient={patient}
          patientId={patientId}
          children={children}
          showUpgradeBadge={showUpgradeBadge}
        />
    )
  }

}

export default withRouter(connect<StateProps, ActionProps, Props, AppState>(
  (state: AppState, props) => ({
    channels: state.microservice.channels,
    patient: selectors.getById(state, props.patientId)
  }),
  {
    updatePatient: UpdatePatient,
    invitePatient: InviteUserToPatientPortal,
    createChannelAndAutoSelect: CreateChannelAutoSelect,
    openModal: OpenModal
  }
)(ToolbarContainer))
