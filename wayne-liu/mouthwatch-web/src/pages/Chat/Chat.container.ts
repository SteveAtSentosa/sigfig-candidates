import { ActionProps, StateProps } from './types'
import { ClearSelectedChannel, getSelectedChannel } from '#/actions/chat'

import { AcceptConsentPolicies } from '#/actions/auth'
import { AppState } from '#/redux'
import Chat from './Chat'
import { CloseModal } from '#/actions/modals'
import { connect } from 'react-redux'

export const mapDispatch: ActionProps = {
  closeModal: CloseModal,
  clearSelectedChannel: ClearSelectedChannel,
  acceptConsentPolicies: AcceptConsentPolicies
}

export const mapState = (state: AppState): StateProps => ({
  openWelcomeModal: state.modals.patientWelcome.isOpen,
  loggedInUser: state.auth.data.account,
  updatedConsentPolicies: state.auth.updatedConsentPolicies,
  selectedChannel: getSelectedChannel(state)
})

export default connect(mapState, mapDispatch)(Chat)
